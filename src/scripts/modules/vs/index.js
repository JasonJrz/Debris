
import { clamp, lerp, damp, mapRange } from '../../utils/math'
import { win } from '../../utils/win'

import Displace from './displace'

export default class Vs {
  constructor({
    element,
    lerp = 0.06,
    speed = false,
    direction = false,
    smoothness = 1,
    progress = {},
    parallax = false,
  })
  {
    this.id = 'vs'

    this.element = element
    this.direction = direction
    this.parallax = parallax
    this.smoothness = smoothness
    this.speed = speed
    this.lerp = lerp

    if(progress.element) {
      this.counter = document.querySelector(progress.element)
      this.progress = true
    } else {
      this.progress = false
    }

    this.mouse = {
      move: 0,
      event: false
    }

    this.scroll = {
      direction: null,
      progress: 0,
      current: 0,
      target: 0,
      speed: 0,
      limit: 0,
      last: 0,
      lerp: lerp
    }

    this.off()
  }

  /**
   * Controller.
   */
  on() {
    this.run = true
  }

  off() {
    this.run = false
  }

  /**
   * Utilies.
   */
  getProgress() {
    this.scroll.progress = this.scroll.current / this.scroll.limit
    this.counter.textContent = `${Math.round(this.scroll.progress * 100)}%`
  }

  getSpeed() {
    this.diff = this.scroll.target - this.scroll.current
    this.scroll.speed = mapRange(-1000, 1000, -1, 1, this.diff)
  }

  getDirection() {
    if(this.scroll.current > this.scroll.last) {
      this.scroll.direction = 'up'
    } else {
      this.scroll.direction = 'down'
    }

    this.scroll.last = this.scroll.current
  }

  getDisplacement() {
    this.displace = new Displace({ dom: this.parallax })
  }

  /**
   * Events.
   */
  onResize() {
    this.scroll.limit = this.element.clientHeight - win.h
  }

  onWheel(deltaY) {
    this.scroll.target += deltaY * this.smoothness

    if(this.scroll.target < 0) this.scroll.target = 0
  }

  onKeyDown(event) {
    const dynamicSpace = win.h - 200
    const shift = event.shiftKey ? 1 : -1
    
    switch(event.code) {
      case 'ArrowUp':
        this.scroll.target -= 100
        break
      case 'ArrowDown':
        this.scroll.target += 100
        break
      case 'Space':
        this.scroll.target -= dynamicSpace * shift
        break
    }
    
    if(this.scroll.target < 0) this.scroll.target = 0
  }

  onTouchDown(event) {
    this.mouse.event = true
    this.mouse.move = event.pageY
  }

  onTouchUp() {
    this.mouse.event = false
  }

  onTouchMove(event) {
    if(!this.mouse.event) return

    this.scroll.target += -event.movementY * 1.5

    if(this.scroll.target < 0) this.scroll.target = 0
  }

  /**
   * RAF.
   */
  update(dt) {
    this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target)
    this.scroll.current = damp(this.scroll.current, this.scroll.target, this.scroll.lerp, dt)

    if(this.scroll.current < 0.01) this.scroll.current = 0

    this.element.style.transform = `translate3d(0, ${-this.scroll.current}px, 0)`

    if(this.parallax && this.displace) this.displace.transform(this.parallax, this.scroll.current)
    if(this.direction) this.getDirection()
    if(this.progress) this.getProgress()
    if(this.speed) this.getSpeed()
  }
}