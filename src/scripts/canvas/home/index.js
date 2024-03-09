
import * as THREE from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'

import vertex from '../../shaders/vertex-pg.glsl'
import fragment from '../../shaders/fragment-pg.glsl'
import { Vector3 } from 'three'

// import andreObj from '../../../assets/andre.obj'

export default class Home {
  constructor({ gl, scene, sizes, geometry }) {
    this.gl = gl
    this.scene = scene
    this.sizes = sizes
    this.geometry = geometry

    this.group = new THREE.Group()
    this.scene.add(this.group)
    
    this.createGeometry()
    this.createProgram()
    this.createMesh()
    this.loadObj()
  }

  /**
   * Create GL Images
   */
  createGeometry() {
    // this.geometry = new THREE.IcosahedronGeometry(1,10)
    this.geometry = new THREE.SphereGeometry(2, 32, 32).toNonIndexed()

    this.len = this.geometry.attributes.position.count

    this.randoms = new Float32Array(this.len * 3)
    let centers = new Float32Array(this.len * 3)

    for(let i = 0; i < this.len; i += 3) {
      let rand = Math.random()

      this.randoms[i] = rand
      this.randoms[i + 1] = rand
      this.randoms[i + 2] = rand

      let x1 = this.geometry.attributes.position.array[i * 3]
      let y1 = this.geometry.attributes.position.array[i * 3 + 1]
      let z1 = this.geometry.attributes.position.array[i * 3 + 2]

      let x2 = this.geometry.attributes.position.array[i * 3 + 3]
      let y2 = this.geometry.attributes.position.array[i * 3 + 4]
      let z2 = this.geometry.attributes.position.array[i * 3 + 5]

      let x3 = this.geometry.attributes.position.array[i * 3 + 6]
      let y3 = this.geometry.attributes.position.array[i * 3 + 7]
      let z3 = this.geometry.attributes.position.array[i * 3 + 8]

      let center = new THREE.Vector3(x1,y1,z1).add(new THREE.Vector3(x2, y2, z2)).add(new THREE.Vector3(x3, y3, z3)).divideScalar(3)

      centers.set([center.x, center.y, center.z],  i * 3)
      centers.set([center.x, center.y, center.z], (i + 1) * 3)
      centers.set([center.x, center.y, center.z], (i + 2) * 3)
    }

    this.geometry.setAttribute('aRandom', new THREE.BufferAttribute(this.randoms, 1))
    this.geometry.setAttribute('aCenter', new THREE.BufferAttribute(centers, 3))
  }
  
  createProgram() {
    this.program = new THREE.RawShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: { value: 0 } 
      },

      // wireframe: true,
      side: THREE.DoubleSide
    })
  }
  
    loadObj() {
      const objLoader = new OBJLoader()
      objLoader.load('/andre.obj', (obj) => {
        this.obj = obj.children[0]

        const geometry = obj.children[0].geometry
        const count = geometry.attributes.position.count

        let randoms = new Float32Array(count)
        let centers = new Float32Array(count * 3)

        for(let i = 0; i < count; i += 3) {
          let rand = Math.random()

          randoms[i] = rand
          randoms[i + 1] = rand
          randoms[i + 2] = rand

          let x1 = this.geometry.attributes.position.array[i * 3]
          let y1 = this.geometry.attributes.position.array[i * 3 + 1]
          let z1 = this.geometry.attributes.position.array[i * 3 + 2]

          let x2 = this.geometry.attributes.position.array[i * 3 + 3]
          let y2 = this.geometry.attributes.position.array[i * 3 + 4]
          let z2 = this.geometry.attributes.position.array[i * 3 + 5]

          let x3 = this.geometry.attributes.position.array[i * 3 + 6]
          let y3 = this.geometry.attributes.position.array[i * 3 + 7]
          let z3 = this.geometry.attributes.position.array[i * 3 + 8]

          let center = new THREE.Vector3(x1,y1,z1).add(new THREE.Vector3(x2, y2, z2)).add(new THREE.Vector3(x3, y3, z3)).divideScalar(3)

          centers.set([center.x, center.y, center.z],  i * 3)
          centers.set([center.x, center.y, center.z], (i + 1) * 3)
          centers.set([center.x, center.y, center.z], (i + 2) * 3)
        }

        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
        geometry.setAttribute('aCenter', new THREE.BufferAttribute(centers, 3))

        this.obj.material = this.program
        this.obj.position.set(0, -0.5, 0)
        
        // this.group.add(this.obj)
      })
    }

  createMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.program)
    this.group.add(this.mesh)
  }

  onResize() {

  }

  update() {
    this.program.uniforms.uTime.value += 0.05
  }
}