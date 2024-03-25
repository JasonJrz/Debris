
// import { Renderer, Camera, Transform } from 'ogl'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { listen } from '../utils/listener'
import { win } from '../utils/win'

import Home from './home'

export default class Gl {
  constructor({ engine, scroll, template }) {
    this.engine = engine
    this.scroll = scroll
    this.template = template

    this.createRen()
    this.createCam()
    this.createScene()
    // this.createLights()

    this.createHome()
    
    this.onResize()
    
    listen(window, 'add', 'resize', this.onResize.bind(this))
  }

  /**
   * Init Webgl
   */
  createRen() {
    const dpr = Math.min(devicePixelRatio, 2)
    const canvas = document.querySelector('#gl')

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    })

    this.renderer.setPixelRatio(dpr)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  createCam() {
    this.cam = new THREE.PerspectiveCamera(35, win.w / win.h, 0.1, 100)
    this.cam.position.x = 8
    this.cam.position.y = 5
    this.cam.position.z = 8

    this.controls = new OrbitControls(this.cam, this.renderer.domElement)
  }
  
  createScene() {
    this.scene = new THREE.Scene()
  }
  
  createLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
    directionalLight.position.set(5, 5, 5)
    this.scene.add(directionalLight)
  }
  /**
   * Pages
   */
  createHome() {
    this.home = new Home({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
    })
  }

  /**
   * Events.
   */
  onResize() {
    this.renderer.setSize(win.w, win.h)

    this.cam.aspect = win.w / win.h
    this.cam.updateProjectionMatrix()

    const fov = this.cam.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.cam.position.z
    const width = height * this.cam.aspect

    this.sizes = {
      height,
      width
    }
  }

  update(scroll, progress) {
    if(this.home) this.home.update(scroll)

    this.controls.update()
    this.renderer.render(this.scene, this.cam)
  }
}