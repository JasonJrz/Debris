
import * as THREE from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import vertex from '../../shaders/vertex-pg.glsl'
import fragment from '../../shaders/fragment-pg.glsl'
import Model from './model'
import Tester from './tester'

// import andreObj from '../../../assets/andre.obj'

export default class Home {
  constructor({ gl, scene, sizes, geometry }) {
    this.gl = gl
    this.scene = scene
    this.sizes = sizes
    this.geometry = geometry

    this.group = new THREE.Group()
    this.scene.add(this.group)
    
    this.createProgram()
    this.loadModel()
  }
  
  createProgram() {
    this.program = new THREE.RawShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: { value: 0 }
      },

      // wireframe: true,
      // side: THREE.DoubleSide,
    })
  }
  
  loadModel() {
    this.model = new Model({
      scene: this.scene,
      sizes: this.sizes,
      file: '/newBrendan.fbx',
      program: this.program
    })

    // this.tester = new Tester({
    //   scene: this.scene,
    //   sizes: this.sizes,
    //   file: '/models/ico-more.glb',
    //   program: this.program
    // })


    // const objLoader = new OBJLoader()
    // // const glbLoader = new GLTFLoader()
    // // const dracoLoader = new DRACOLoader()
    // // dracoLoader.setDecoderPath('./draco/')
    // // glbLoader.setDRACOLoader(dracoLoader)

    // objLoader.load('/andre.obj', (obj) => {
    //   this.obj = obj.children[0]
    //   // this.obj = obj.scene.children[0]
      
    //   const geometry = obj.children[0].geometry
    //   const count = geometry.attributes.position.count

    //   let randoms = new Float32Array(count)
    //   let centers = new Float32Array(count * 3)

    //   for(let i = 0; i < count; i += 3) {
    //     let rand = Math.random()

    //     randoms[i] = rand
    //     randoms[i + 1] = rand
    //     randoms[i + 2] = rand

    //     let x1 = geometry.attributes.position.array[i * 3]
    //     let y1 = geometry.attributes.position.array[i * 3 + 1]
    //     let z1 = geometry.attributes.position.array[i * 3 + 2]

    //     let x2 = geometry.attributes.position.array[i * 3 + 3]
    //     let y2 = geometry.attributes.position.array[i * 3 + 4]
    //     let z2 = geometry.attributes.position.array[i * 3 + 5]

    //     let x3 = geometry.attributes.position.array[i * 3 + 6]
    //     let y3 = geometry.attributes.position.array[i * 3 + 7]
    //     let z3 = geometry.attributes.position.array[i * 3 + 8]

    //     let center = new THREE.Vector3(x1,y1,z1).add(new THREE.Vector3(x2, y2, z2)).add(new THREE.Vector3(x3, y3, z3)).divideScalar(3)

    //     centers.set([center.x, center.y, center.z],  i * 3)
    //     centers.set([center.x, center.y, center.z], (i + 1) * 3)
    //     centers.set([center.x, center.y, center.z], (i + 2) * 3)
    //   }

    //   geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
    //   geometry.setAttribute('aCenter', new THREE.BufferAttribute(centers, 3))

    //   this.obj.material = this.program
    //   this.obj.position.set(0, -0.5, 0)
      
    //   this.group.add(this.obj)
    // })
  }

  update() {
    this.program.uniforms.uTime.value += 0.05
  }
}