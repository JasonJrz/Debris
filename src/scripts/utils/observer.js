
import EventEmitter from '../utils/emitter'

export default class Observer extends EventEmitter {
  constructor({
    element,
    threshold = 0,
    rootMargin = '0px',
    moniter = false
  })
  {
    super()

    this.element = element
    this.threshold = threshold
    this.rootMargin = rootMargin
    this.moniter = moniter

    this.observe()
  }

  observe() {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          this.emit('in')

          if(!this.moniter) {
            observer.disconnect()
            
            // console.log('observer disconnected')
          }
        } else {
          this.emit('out')
        }
      })
    }, {
      root: null,
      threshold: this.threshold,
      rootMargin: this.rootMargin
    })

    this.observer.observe(this.element)
  }
}