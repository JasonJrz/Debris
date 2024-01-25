
export default class Displace {
  constructor({ dom }) {
    this.dom = dom
  }

  transform(dom, scroll) {
    for(let i = 0; i < dom.length; i++) {
      const o = dom[i]
      const speed = o.speed

      o.el.style.transform = `translateY(${-scroll * speed}px)`
    }
  }
}