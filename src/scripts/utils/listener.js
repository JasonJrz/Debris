
import { select } from './select'

export function listen(element, action, event, cb) {
  const el = select(element)

  const array = Array.isArray(event)

  if(array) {
    for(let i = 0; i < event.length; i++) {
      el[action + 'EventListener'](event[i], cb, false)
    }
  } else {
    el[action + 'EventListener'](event, cb, false)
  }
}