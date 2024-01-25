
export default class Clock {
  constructor({ element }) {
    this.elements = element instanceof NodeList ? Array.from(element) : [element]

    this.updateTime()
    setInterval(() => this.updateTime(), 1000)
  }

  updateTime() {
    const date = new Date()
    const f = new Intl.DateTimeFormat('en-us', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date)

    this.elements.forEach(element => {
      element.textContent = f
    })
  }
}
