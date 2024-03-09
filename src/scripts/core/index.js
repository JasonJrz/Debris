
import L from '../components/loader'

import Gl from '../canvas'

import Home from '../pages/home'

export default class App {
  constructor({ device, engine, controller }) {
    this.device = device
    this.engine = engine
    this.controller = controller
    
    this.initPages()
    this.initGL()
    // this.initLoader()
    this.setParams()

    if(this.device) return
    this.engine.add(this.update.bind(this), 'engine')
  }

  /**
   * Set Controller parameters
   */
  setParams() {
    this.controller.params = {
      canvas: this.canvas,
      pages: this.pages,
      page: this.page,
      cb: this.cb.bind(this)
    }
  }
  
  cb() {
    this.page = this.controller.params.page
  }

  /**
   * Creates the pages
   */
  initPages() {
    this.pages = {
      home: new Home(),
    }

    this.page = this.pages[this.controller.template]
    this.page.init()
    this.page.vs.on()
  }

  /**
   * Creates WebGL world
   */
  initGL() {
    this.canvas = new Gl({
      canvas: 'gl',
      engine: this.engine,
      template: this.controller.template,
      scroll: this.page.vs.scroll,
    })

    // this.canvas.init(this.controller.template)
  }

  /**
   * Starts the loader
   */
  initLoader() {
    this.loader = new L({
      element: '#loader',
      counter: '#counter',
      assets: '.m-t',
      canvas: this.canvas,
      engine: this.engine,
      template: this.controller.template,
      device: this.device
    })

    this.loader.trigger('loaded', () => this.canvas.init(this.controller.template))
    this.loader.trigger('removed', () => {
      this.page.vs.on()
      this.page.onResize()
    })
  }

  update(dt) {
    if(this.page) this.page.update(dt)
    if(this.canvas) this.canvas.update(dt)
  }
}