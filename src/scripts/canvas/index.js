
import { Renderer, Camera, Transform } from 'ogl'

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
    
    this.onResize()
    
    listen(window, 'add', 'resize', this.onResize.bind(this))
  }

  /**
   * Creates the WebGL page when the preloader emits a completed state
   * this provides time for the preloader to load the assets(images, etc.)
   */
  init(template) {
    if(template === 'home') {
      this.createHome()
    }

    this.template = template
  }

  destroy(template) {
    if(template === 'home') {
      this.home.destroy()
      this.home = null
    }
  }

  /**
   * Init Webgl
   */
  createRen() {
    const dpr = Math.min(devicePixelRatio, 2)
    const canvas = document.querySelector('#gl')

    this.renderer = new Renderer({
      dpr,
      canvas,
      alpha: true,
      antialias: true,
      width: win.w,
      height: win.h,
    })

    this.gl = this.renderer.gl
  }

  createCam() {
    this.cam = new Camera(this.gl)
    this.cam.position.z = 5
  }

  createScene() {
    this.scene = new Transform(this.gl)
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
   * Transitions
   */
  transition(template, url) {
    return new Promise(async resolve => {
      this.homeToCase = template === 'home' && url.indexOf('case') > -1
      this.caseToCase = template === 'case' && url.indexOf('case') > -1

  
      if(this.homeToCase) await this.home.transition(this.case)
      if(this.caseToCase) await this.case.transition(this.oldCase)

      resolve()
    })
  }

  outro() {
    return new Promise(async resolve => {
      this.oldCase = this.case

      if(this.home) await this.home.outro()
      if(this.case) await this.case.outro()
      if(this.approach) await this.approach.outro()

      resolve()
    })
  }

  intro() {
    return new Promise(async resolve => {
      if(this.home) await this.home.intro()
      if(this.case) await this.case.intro()
      if(this.approach) await this.approach.intro()

      resolve()
    })
  }

  /**
   * Events.
   */
  onResize() {
    this.renderer.setSize(win.w, win.h)

    this.cam.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    })

    const fov = this.cam.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.cam.position.z
    const width = height * this.cam.aspect

    this.sizes = {
      height,
      width
    }

    if(this.home) this.home.onResize(this.sizes)
  }

  update(scroll, progress) {
    if(this.home) this.home.update(scroll)

    this.renderer.render({
      scene:this.scene,
      camera: this.cam
    })
  }
}