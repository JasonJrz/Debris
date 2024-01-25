
export default class Split {
  constructor({ element, type }) {
    this.element = element
    this.type = type

    if(this.element.length) {
      this.element.forEach((el) => {
        if (this.type === 'c') this.sC(el)
        if (this.type === 'w') this.sW(el)
        if (this.type === 'l') this.sL(el)
      })
    } else {
      if (this.type === 'c') this.sC(this.element)
      if (this.type === 'w') this.sW(this.element)
      if (this.type === 'l') this.sL(this.element)
    }
  }

  createChars(el, text) {
    const d = document.createElement('span')
    d.className = 'char-w'

    el.appendChild(d)
    
    const s = document.createElement('span')
    s.className = 'char'
    s.textContent = text

    d.appendChild(s)

    return d
  }

  createWords(text, parent = null) {
    const words = text.split(' ')
    
    const d = document.createElement('span')
    d.className = 'word-w'
    
    parent.parentElement.appendChild(d)

    words.forEach(word => {
      const s = document.createElement('span')
      s.className = 'word'
      s.innerHTML = `${word}&nbsp;`
  
      d.appendChild(s)
    })

    return d
  }

  createLines(el, text) {
    if(!text.length) return

    const d = document.createElement('span')
    d.className = 's-p-o'
    el.appendChild(d)

    const s = document.createElement('span')
    s.className = 's-t'
    s.textContent = text

    d.appendChild(s)

    return d
  }

  sC(el) {
    const text = el.innerText

    const e = [...text].map(l => {
      return this.createChars(el, l)
    })

    el.firstChild.replaceWith(...e)
  }

  sW(el) {
    if(el.length) {
      el.map(l => {
        const t = l.innerText
        this.p = l.parentElement
  
        return this.createWords(t, this.p)
      })
  
      this.p.parentNode.removeChild(this.p)
    } else {
      const t = el.innerText
      const p = el.parentElement

      this.createWords(t, p)
      p.parentNode.removeChild(p)
    }
  }

  sL(el) {
    const text = el.innerText
    const lines = text.split('<br>')

    const p = el.querySelector('p')

    lines.map(l => {
      const h = l.split('\n')
      const a = h.map(k => {
        return this.createLines(el, k)
      })

      return a
    })

    p.parentNode.removeChild(p)
  }
}