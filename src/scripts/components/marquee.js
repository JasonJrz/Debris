
import { lerp } from '../utils/math'

export default class Marq {
  constructor({ element, translation, speed }) {
    this.element = element
    this.translation = translation
    this.speed = speed
    
    this.metric = 102

    this.scroll = {
      current: this.translation,
      target: this.translation,
      lerp: 0.05
    }
  }

  loop(direction, amplitude) {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.lerp)

    if(direction === 'up') {
      this.scroll.target += this.speed * 0.2 + (amplitude * 2)

      if(this.scroll.target > this.metric) {
        this.scroll.current -= this.metric * 2
        this.scroll.target -= this.metric * 2
      }
    } else {
      this.scroll.target -= this.speed * 0.2 - (amplitude * 2)

      if(this.scroll.target < -this.metric) {
        this.scroll.current += this.metric * 2
        this.scroll.target += this.metric * 2
      }
    }

    this.element.style.transform = `translateX(${this.scroll.current}%)`
  }
}