
import * as THREE from 'three'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'

export default class Model {
  constructor({ scene, sizes, file, program }) {
    this.scene = scene
    this.sizes = sizes
    this.file = file
    this.program = program

    this.loadModel()
  }

  loadModel() {
    const fbxLoader = new FBXLoader()

    this.voron = []
    this.piecePositions = []

    fbxLoader.load(this.file, (obj) => {
      // console.log('main:', obj)
      this.obj = obj

      let totalVerts = 0
      const centroids = []

      this.obj.traverse(child => {
        if(child instanceof THREE.Mesh) {
          const geometry = child.geometry.clone().applyMatrix4(child.matrixWorld)
          geometry.computeBoundingBox()
          this.voron.push(geometry)

          const centroid = this.getCentroid(geometry)
          centroids.push(centroid)
          
          totalVerts += geometry.attributes.position.count
        }
      })

      const cen = new Float32Array(totalVerts * 3)
      console.log(cen)

      let offset = 0
      centroids.forEach((centroid) => {
        for (let i = 0; i < centroid.length; i++) {
          cen[offset++] = centroid[i]
        }
      })
      
      console.log(cen)
      const geo = BufferGeometryUtils.mergeGeometries(this.voron, false)
      // g.setAttribute('aPiecePosition', new THREE.BufferAttribute(new Float32Array(this.piecePositions), 3))
      geo.setAttribute('centroid', new THREE.BufferAttribute(cen, 3))

      this.mesh = new THREE.Mesh(geo, this.program)
      this.mesh.position.set(0, -0.7, 0)

      this.scene.add(this.mesh)
    })
  }

  getCentroid(geometry) {
    const position = geometry.attributes.position;
    const array = position.array;
    const count = position.count;
    
    let x = 0, y = 0, z = 0;
    for (let i = 0; i < count; i++) {
      const index = i * 3;
      x += array[index];
      y += array[index + 1];
      z += array[index + 2];
    }

    return [x / count, y / count, z / count];
  }
}