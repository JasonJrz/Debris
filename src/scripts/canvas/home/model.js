
import * as THREE from "three"
import { FBXLoader } from "three/addons/loaders/FBXLoader.js"
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"

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
    this.axis = []

    fbxLoader.load(this.file, (obj) => {
      this.obj = obj

      let totalVerts = 0
      const centroids = []
      const totalVertsForGeom = []

      this.obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const geometry = child.geometry.clone().applyMatrix4(child.matrixWorld)
          geometry.computeBoundingBox()

          this.voron.push(geometry)

          const centroid = this.getCentroid(geometry)
          centroids.push(centroid)

          totalVerts += geometry.attributes.position.count
          totalVertsForGeom.push(geometry.attributes.position.count)

          const rotation = [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2]
          for (let i = 0; i < geometry.attributes.position.count; i++) {
            this.axis.push(rotation)
          }
        }
      })

      const cen = new Float32Array(totalVerts * 3)
      const rotations = new Float32Array(this.axis.flat())

      let offset = 0
      
      centroids.forEach((centroid, index) => {
        const totalVertsForThatGeom = totalVertsForGeom[index]
        const total = totalVertsForThatGeom;
        for (let k = 0; k < total; k++) {
          for (let i = 0; i < centroid.length; i++) {
            cen[offset] = centroid[i]
            offset++
          }
        }
      });

      const geo = BufferGeometryUtils.mergeGeometries(this.voron, false)
      geo.setAttribute("centroid", new THREE.BufferAttribute(cen, 3))
      geo.setAttribute("axis", new THREE.BufferAttribute(rotations, 3))

      this.mesh = new THREE.Mesh(geo, this.program)
      this.mesh.position.set(0, -0.7, 0)

      this.scene.add(this.mesh)
    })
  }

  getCentroid(geometry) {
    const position = geometry.attributes.position
    const array = position.array
    const count = position.count

    let x = 0
    let y = 0
    let z = 0

    for (let i = 0; i < count; i++) {
      const index = i * 3
      x += array[index]
      y += array[index + 1]
      z += array[index + 2]
    }

    return [x / count, y / count, z / count]
  }
}