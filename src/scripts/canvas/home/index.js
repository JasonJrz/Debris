
import * as THREE from 'three'

import FX from '../../modules/fx'

import { listen } from '../../utils/listener'
import { win } from '../../utils/win'

import Model from './model'

import vertex from '../../shaders/vertex-pg.glsl'
import fragment from '../../shaders/fragment-pg.glsl'

export default class Home {
  constructor({ gl, scene, sizes, geometry }) {
    this.gl = gl
    this.scene = scene
    this.sizes = sizes
    this.geometry = geometry

    this.mouse = new THREE.Vector2(-1, -1)

    this.group = new THREE.Group()
    this.scene.add(this.group)
    
    this.createProgram()
    this.loadModel()

    this.isClicked = false

    listen(window, 'add', 'click', this.updateProgress.bind(this))
    listen(window, 'add', 'mousemove', this.onMM.bind(this))
  }
  
  createProgram() {
    this.program = new THREE.RawShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uMouse: { value: this.mouse }
      },

      // wireframe: true,
      // side: THREE.DoubleSide,
    })
  }
  
  loadModel() {
    this.model = new Model({
      scene: this.scene,
      sizes: this.sizes,
      program: this.program,
      file: '/newBrendan.fbx'
    })
  }

  updateProgress() {
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

  onMM(event) {
    const x = (event.clientX / win.w) * 2 - 1
    const y = -(event.clientY / win.h) * 2 + 1

    this.mouse.set(x, y)
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