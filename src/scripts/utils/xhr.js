
import Cache from './cache'

import { listen } from './listener'

export default class Xhr {
  constructor({ transition, template, app }) {
    this.xhr = app

    this.transition = transition
    this.template = template
    this.clicked = false

    this.params = {
      canvas: null,
      pages: null,
      page: null,
      cb: null
    }

    this.routed = false
    this.cache = new Cache()

    this.linkListeners()
    listen(window, 'add', 'popstate', this.onPopState.bind(this))
  }

  onPopState() {
    this.onChange({ url: location.pathname })
  }

  async onChange({ url }) {
    if(this.clicked) return

    this.clicked = true
    const isCached = this.cache.get(url)

    this.params.page.terminate()
    this.params.page.vs.off()

    await Promise.all([
      setTimeout(() => this.params.canvas.outro(), 0),
      this.params.page.outro()
    ])

    window.scrollTo(0,0)

    if(isCached) {
      this.insertDom(isCached, url)
    } else {
      const req = await fetch(url)
  
      if(req.status === 200) {
        var html = await req.text()

        this.insertDom(html, url)
      } else {
        console.log('Fetch error, routing to index instead')
        this.onChange({ url: '/' })
      }
    }
    
    this.cache.set(url, html)

    const o = this.xhr.children[0]
    o.parentNode.removeChild(o)

    this.params.canvas.init(this.template)
    
    this.params.page = this.params.pages[this.template]
    this.params.page.init()
    this.params.cb()
    
    await Promise.all([
      this.params.canvas.transition(this.op, url),
      this.params.page.intro(),
    ])
    
    this.params.canvas.intro(),
    this.params.canvas.destroy(this.op)
    
    this.params.page.vs.on()

    this.clicked = false
    this.routed = true

    this.linkListeners()
  }

  insertDom(html, url) {
    const div = document.createElement('div')
    div.innerHTML = html

    history.pushState({}, '', url)

    const app = div.querySelector('#app')

    this.op = this.template
    this.template = app.getAttribute('data-template')

    this.xhr.setAttribute('data-template', this.template)
    this.xhr.insertAdjacentHTML('beforeend', app.innerHTML)
  }

  linkListeners() {
    const links = document.querySelectorAll('a')

    links.forEach(link => {
      const isLocal = link.href.indexOf(location.origin) > -1

      if(isLocal) {
        link.onclick = event => {
          event.preventDefault()

          //Current Route.
          const cr = window.location.pathname
          //New Route
          const nr = new URL(link.href).pathname

          if(cr === nr) return

          this.onChange({ url: link.href })
        }
      }
    })
  }
}