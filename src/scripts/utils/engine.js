
export default class Engine {
  constructor() {
    this.callbacks = []
    this.inView = {}

    this.running = false
    this.run = true
    this.on = false

    this.lt = performance.now()
    this.FR = 1e3 / 60

    requestAnimationFrame(this.update)
  }

  add(callback, id, priority = 0) {
    this.callbacks.push({ callback, id, priority })
    this.callbacks.sort((a,b) => a.priority - b.priority)

    return () => this.remove(id)
  }

  remove(id) {
    this.callbacks = this.callbacks.filter(callback => callback.id !== id)
  }

  update = (t) => {
    requestAnimationFrame(this.update)
    const dt = (t - this.lt) / this.FR
    this.lt = t

    for(let i = 0; i < this.callbacks.length; i++) {
      this.callbacks[i].callback(dt)
    }
  }

  resetKeys() {
    for(const key in this.inView) {
      if(this.inView.hasOwnProperty(key)) {
        delete this.inView[key]
      }
    }
  }
}