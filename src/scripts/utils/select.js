
export function select(el) {
  var element = el

  if(el instanceof HTMLElement || el == window) {
    var element = el
  } else {
    var element = document.querySelector(el)
  }

  return element
}