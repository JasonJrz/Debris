
import { listen } from './listener'

export default class Grid {
  constructor({ columns }) {
    this.col = columns
    this.active = false

    listen(window, 'add', 'keydown', this.onKeyDown.bind(this))
  }

  onKeyDown(event) {
    switch (true) {
      case event.code === 'Escape' && this.active:
        this.gClass({ escape: true })
        break
      case event.code === 'KeyG' && event.shiftKey:
        this.gClass({ escape: false })
        break
      default:
        break
    }
  }

  gClass(t) {
    if(this.active || t.escape) {
      this.destroy()
    } else if (!this.active) {
      this.create()
    }
  }

  destroy() {
    this.grid.parentNode.removeChild(this.grid)
    this.active = false
  }

  create() {
    this.grid = document.createElement('div')
    this.grid.id = 'g'

    const wrapper = document.createElement('div')
    wrapper.id = 'g_w'
    
    const s = []

    for(let c = 0; c < this.col; c++) {
      s[c] = document.createElement('div')
      wrapper.appendChild(s[c])
    }
    
    this.grid.appendChild(wrapper)
    document.body.prepend(this.grid)

    this.active = true
  }
}