
import * as THREE from 'three'

import FX from '../../modules/fx'
import { listen } from '../../utils/listener'

import Model from './model'

import vertex from '../../shaders/vertex-pg.glsl'
import fragment from '../../shaders/fragment-pg.glsl'

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

    this.isClicked = false
    listen(window, 'add', 'click', this.updateProgress.bind(this))
  }
  
  createProgram() {
    this.program = new THREE.RawShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 }
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
  }

  updateProgress(event) {
    const fx = new FX({})

    fx.add(this.program.uniforms.uProgress, {
      easing: 'linear',
      duration: 800,
      props: {
        value: this.isClicked ? 0 : 1
      }
    })

    this.isClicked = !this.isClicked 
  }

  update() {
    //Run uTime if the window has been clicked
    //Stop if isClicked false
    this.time = 0
    
    if(!this.isClicked) return
    
    this.time += 0.05
    this.program.uniforms.uTime.value += this.time
  }
}