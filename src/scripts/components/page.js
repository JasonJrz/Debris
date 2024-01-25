
import Vs from '../modules/vs'

import { listen } from '../utils/listener'
import { query } from '../utils/query'

import anime from 'animejs'

export default class Page {
  constructor({ engine, parallax, elements }) {
    this.engine = engine
    this.para = parallax
    this.els = {
      ...elements
    }

    this.events = ['wheel', 'resize', 'keydown', 'mousedown', 'mouseup', 'mousemove']
    listen(window, 'add', this.events, this.controller.bind(this))
  }

  /**
   * Controllers.
   */
  controller(event) {
    if(this.vs && this.vs.run)

    switch(true) {
      case event.type === 'wheel':
        this.onWheel(event)
        break
      case event.type === 'keydown':
        this.onKeyDown(event)
        break
      case event.type === 'mousedown':
        this.onTouchDown(event)
        break
      case event.type === 'mouseup':
        this.onTouchUp(event)
        break
      case event.type === 'mousemove':
        this.onTouchMove(event)
        break
      case event.type === 'resize':
        this.onResize()
        break
    }
  }

  init() {
    this.elements = {}
    query(this.els, this.elements)

    this.parallax = []

    this.vs = new Vs({
      lerp: 0.09,
      speed: true,
      engine: this.engine,
      element: this.elements.container,
      parallax: this.parallax,
      direction: true,
      smoothness: 1.2,
    })

    this.onResize()

    if(this.para.length > 0) {
      query(this.para, this.parallax)
      this.vs.getDisplacement()
    }
  }

  terminate() {
    listen(window, 'remove', this.events, this.controller.bind(this))
  }

  /**
   * Events.
   */
  onWheel({ deltaY }) {
    this.vs.onWheel(deltaY)
  }

  onKeyDown(event) {
    this.vs.onKeyDown(event)
  }

  onTouchDown(event) {
    this.vs.onTouchDown(event)
  }

  onTouchUp() {
    this.vs.onTouchUp()
  }

  onTouchMove(event) {
    this.vs.onTouchMove(event)
  }

  onResize() {
    this.vs.onResize()
  }

  /**
   * Transitions.
   */
  outro(transition) {
    return new Promise(async resolve => {
      if(transition) {
        await transition()
      } else {
        await new Promise(resolve => {
          anime({
            targets: this.elements.container,
            opacity: [1, 0],
            duration: 200,
            easing: 'easeOutQuad',
            complete: () => resolve()
          })
        })
      }

      resolve()
    })
  }

  intro(transition) {
    return new Promise(async resolve => {
      if(transition) {
        await transition()
      } else {
        await new Promise(resolve => {
          anime({
            targets: this.elements.container,
            opacity: [0, 1],
            duration: 1000,
            delay: 300,
            easing: 'easeOutQuad',
            complete: () => resolve()
          })
        })
      }

      resolve()
    })
  }

  /**
   * RAF.
   */
  update(dt) {
    this.vs.update(dt)
  }
}