
export function query(elements, obj) {
  if(Array.isArray(elements)) {
    for(let i = 0; i < elements.length; i++) {
      const o = elements[i]
      const selector = o.el

      if(typeof selector === 'string') {
        const el = document.querySelector(selector)
        obj[i] = {
            el: el,
            speed: o.speed
        } 
      }
    }
  } else {
    for(const [key, value] of Object.entries(elements)) {
      if (value instanceof HTMLElement || value instanceof NodeList || Array.isArray(value)) {
        obj[key] = value
      } else {
        obj[key] = document.querySelectorAll(value)
  
        if (obj[key].length === 0) {
          obj[key] = null
        } else if (obj[key].length === 1) {
          obj[key] = document.querySelector(value)
        }
      }
    }
  }

  return obj
}