
import D from './utils/detection'
import E from './utils/engine'
import G from './utils/grid'
import Xhr from './utils/xhr'

import C from './core'

const app = document.getElementById('app')
const template = app.getAttribute('data-template')

const device = D.isMobile()
const columns = device ? 4 : 12
const params = {
  device,
  engine: new E(),
  controller: new Xhr({
    transition: null,
    template,
    app
  }),

  grid: new G({ columns })
}

const application = new C(params)

window.A = application