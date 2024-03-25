
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
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
    const draco = new DRACOLoader()
    draco.setDecoderPath('/draco/')

    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(draco)

    let i = 0
    this.voron = []
    this.geo = []

    gltfLoader.load(this.file, (gltf) => {
      // console.log('test:', gltf)

      gltf.scene.traverse(child => {
        // console.log(child)
        if(child.name === 'Voronoi_Fracture') {
          if(child.children[0].children.length > 2) {
            child.children.forEach(f => {
              f.children.forEach(m => {
                this.voron.push(m.clone())
              })
            })
          } else {
            child.children.forEach(m => {
              this.voron.push(m.clone());
            })
          }
        }
      })

      // console.log(this.voron)

      this.voron.filter(v => {
        if(v.isMesh) return false

        else {
          i++;
          // console.log(v)
          return true
        }
      })

      // const g = BufferGeometryUtils.mergeGeometries(this.voron, false)
      // this.mesh = new THREE.Mesh(g, this.program)
      // this.scene.add(this.mesh)

      // this.obj.material = this.program
      // this.obj.position.set(0, -0.7, 0)
      
      // this.scene.add(obj)
    })
  }
}