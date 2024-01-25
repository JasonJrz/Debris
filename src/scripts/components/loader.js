
import anime from 'animejs'
import { Texture } from 'ogl'

import { lerp } from '../utils/math'
import Emitter from '../utils/emitter'

export default class Loader extends Emitter {
  constructor({ element, assets, counter, canvas, engine, template, device }) {
    super()

    this.id = 'loader'

    this.element = document.querySelector(element)
    this.assets = document.querySelectorAll(assets)
    this.counter = document.querySelector(counter)

    this.template = template
    this.canvas = canvas
    this.engine = engine
    this.device = device

    window.TEXTURES = {}

    /**
     * Dummy urls for test loading
     */
    this.urls = [
      '/images/p.jpg',
      '/images/fm.jpg',
      '/images/crm.jpg',
    ]

    this.loaded = 0

    //Percentage counter
    this.p = {
      target: 0,
      current: 0
    }

    this.engine.add(this.update.bind(this), this.id)

    this.load(this.urls)
  }

  load(urls) {
    /**
     * For dev only
     * Testing if loader is responsive to dozens of images
     */
    urls.forEach(url => {
      const texture = new Texture(this.canvas.gl, {
        generateMipmaps: false
      })
      
      const media = new Image()
      media.crossOrigin = 'anonymous'
      media.src = url
      
      media.onload = () => {
        texture.image = media

        this.loaded += 1
        this.p.target = this.loaded / urls.length * 100

        if(this.loaded === urls.length) this.emit('loaded')
      }

      window.TEXTURES[url] = texture
    })
  }

  update() {
    this.p.current = lerp(this.p.current, this.p.target, 0.06)

    if(this.p.current <= 99.6) {
      this.counter.textContent = `${Math.round(this.p.current)}%`
    } else {
      this.outro()
    }
  }

  outro() {
    this.engine.remove(this.id)
    this.emit('removed')

    const nav = document.querySelector('#nav')
    const marquee = document.querySelector('#t')

    const i = [nav, marquee]
    const y = [nav]

    const k = marquee == undefined ? y : i

    const timeline = anime.timeline({
      easing: 'easeOutQuad',
      complete: () => {
        this.canvas.loader.scene.removeChild(this.canvas.loader.mesh)
      }
    })

    timeline
    .add({
      targets: this.element,
      duration: 600,
      opacity: 0,
      delay: 500,
      complete: () => this.element.parentNode.removeChild(this.element)
    })
    .add({
      targets: this.canvas.loader.program.uniforms.p,
      value: [1, 0]
    }, 600)
    .add({
      targets: this.canvas.loader.program.uniforms.np,
      value: [1, 0],
      duration: 1600,
      easing: 'linear'
    }, 600)
    .add({
      targets: k,
      opacity: [0, 1]
    }, 1000)
    
    if(this.template === 'about') {
      anime({
        targets: this.canvas.approach.program.uniforms.s,
        value: 2,
        delay: 2000,
        easing: 'linear'
      })
    }
  }
}