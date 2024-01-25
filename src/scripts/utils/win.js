
export const win = {
  get w() {
    return window.innerWidth
  },

  get h() {
    return window.innerHeight
  },

  get path () {
    return window.location.pathname
  },

  get hostname () {
    return window.location.hostname
  },

  get href () {
    return window.location.href
  },

  get perfNow () {
    return window.performance.now()
  }
}