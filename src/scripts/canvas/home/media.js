
import { Program, Mesh } from 'ogl'
import anime from 'animejs'

import FX from '../../modules/fx'

import { win } from '../../utils/win'
import { listen } from '../../utils/listener'
import { getOffset, isInside } from '../../utils/dom'

import vertex1 from '../../shaders/home_vert.glsl'
import fragment1 from '../../shaders/home_frag.glsl'

export default class {
  constructor({ scene, geometry, sizes, element, index, gl }) {
    this.scene = scene
    this.geometry = geometry
    this.sizes = sizes
    this.element = element
    this.index = index
    this.gl = gl

    this.speed = this.index === 0 ? 1.7 : 1

    this.createProgram()
    this.createMesh()
    setTimeout(() => this.onResize(this.sizes), 100)
    
    this.isTransitioning = false

    this.isLink = isInside(this.element, 'a')
    if(!this.isLink) return
    
    this.link = this.element.closest('.sw-l')
    listen(this.link, 'add', 'click', () => this.isTransitioning = true)
  }

  createProgram() {
    const image = this.element
    const data = image.getAttribute('data-src')

    this.texture = window.TEXTURES[data]
    const { width, height } = this.texture.image

    this.program = new Program(this.gl, {
      vertex: vertex1,
      fragment: fragment1,
      uniforms: {
        //Texture
        t: { value: this.texture },
        //Speed
        s: { value: 0 },
        //Viewport
        v: { value: [this.sizes.width, this.sizes.height] },
        //Img Natural-Width/Height aka(Dimensions)
        d: { value: [width, height] },
        //Mesh Size
        m: { value: [0, 0] },
        //Transition Mesh Size
        tms: { value: [0, 0] },
        //Time
        uTime: { value: 0 },
        //Alpha
        ua: { value: 0 },
        //Progress(0 -> 1)
        p: { value: 0 },
        //Negative Progress(1 -> 0)
        np: { value: 1 },
      },

      cullFace: false
    })
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
      // mode: this.gl.LINES
    })

    this.mesh.setParent(this.scene)
  }

  onResize(sizes) {
    this.sizes = sizes
    this.bounds = getOffset(this.element, this.scroll)

    this.setSize()
    this.setPosition()

    this.program.uniforms.m.value = [this.mesh.scale.x, this.mesh.scale.y]
  }

  setSize() {
    this.width = this.bounds.width / win.w
    this.height = this.bounds.height / win.h

    this.mesh.scale.x = this.sizes.width * this.width
    this.mesh.scale.y = this.sizes.height * this.height
  }

  setPosition(y = 0) {
    this.x = this.bounds.left / win.w
    this.y = this.bounds.top - y

    this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x * this.sizes.width)
    this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y / win.h) * this.sizes.height
  }

  /**
   * Page Transitions.
   */
  transition(element) {
    return new Promise(resolve => {
      const npx = element.mesh.position.x
      const npy = element.mesh.position.y
      const nsx = element.mesh.scale.x
      const nsy = element.mesh.scale.y

      this.program.uniforms.tms.value = [nsx, nsy]
      this.mesh.position.z += 0.01

      const fxEase = 'linear'

      const fx = new FX({
        onComplete: () => {
          resolve()
        }
      })

      fx.add(this.mesh.position, {
        duration: 900,
        easing: 'easeInOutSine',
        props: {
          x: npx,
          y: npy,
        },
      })
      
      fx.add(this.program.uniforms.p, {
        duration: 900,
        easing: fxEase,
        props: {
          value: 1,
        },
      })

      fx.add(this.program.uniforms.np, {
        duration: 900,
        easing: fxEase,
        props: {
          value: 0,
        },
      })
    })
  }

  outro() {
    return new Promise(resolve => {
      anime({
        targets: this.program.uniforms.ua,
        value: [1, 0],
        duration: 100,
        easing: 'easeOutQuad',
        complete: () => {
          this.scene.removeChild(this.mesh)
          resolve()
        }
      })
    })
  }

  intro() {
    return new Promise(resolve => {
      const fxEase = 'easeOutQuad'

      const fx = new FX({
        onComplete: () => {
          resolve()
        }
      })

      fx.add(this.program.uniforms.ua, {
        duration: 300,
        easing: fxEase,
        props: {
          value: 1
        },
      }, 400)
    })
  }

  /**
   * RAF.
   * Notes: Stop raf only for transitioning mesh since
   * there's collision in animating position
   */
  update(scroll) {
    //This stop the position and maintains updating the uniforms if necessary
    if(!this.isTransitioning) {
      this.scroll = scroll.current
      this.setPosition(scroll.current * this.speed)
    }

    this.program.uniforms.s.value = scroll.speed
    this.program.uniforms.uTime.value += 0.05
  }
}