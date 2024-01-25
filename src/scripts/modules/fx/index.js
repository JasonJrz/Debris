
import { easings } from './easings'

export default class FX {
  constructor({ onComplete = null }) {
    this.animations = []
    this.animationFrameId = null
    this.easings = easings
    this.onCompleteCallback = onComplete || null
  }

  add(target, options, delay = 0) {
    options.startTime = performance.now() + delay
    options.endTime = options.startTime + options.duration
    this.animations.push({ target, options })
    this.animations.sort((a, b) => a.options.startTime - b.options.startTime)
  
    if (!this.animationFrameId) {
      this.startAnimationLoop()
    }
  }
  
  startAnimationLoop() {
    const animate = (timestamp) => {
      if (this.animations.length === 0) {
        this.animationFrameId = null // No active animations, stop the loop
        if (this.onCompleteCallback) {
          this.onCompleteCallback() // Call the onComplete callback
        }
        return
      }
  
      const currentTime = timestamp
      const onCompleteCallbacks = new Array(this.animations.length).fill(false)
  
      for (let i = 0; i < this.animations.length; i++) {
        const animation = this.animations[i]
        const { target, options } = animation
        const { props, duration, onComplete } = options
        const startTime = options.startTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
  
        if (currentTime >= startTime) {
          if (!options.initialValues) {
            // Initialize initial values if they are missing
            options.initialValues = {}
            for (const property in props) {
              options.initialValues[property] = target[property]
            }
          }
  
          for (const property in props) {
            const initialValue = options.initialValues[property]
            const toValue = props[property]
            const easedProgress = this.easings[options.easing || 'linear'](progress)
            target[property] = initialValue + (toValue - initialValue) * easedProgress
          }
  
          if (progress >= 1) {
            // Animation complete
            onCompleteCallbacks[i] = true
          }
        }
      }
  
      if (onCompleteCallbacks.every((completed) => completed)) {
        // If all animations are complete, call the overall onComplete callback
        if (this.onCompleteCallback) {
          this.onCompleteCallback()
        }
        this.animations = this.animations.filter((animation, index) => !onCompleteCallbacks[index])
      }
  
      this.animationFrameId = requestAnimationFrame(animate)
    }
  
    this.animationFrameId = requestAnimationFrame(animate)
  }  

  stopAnimationLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }
}
