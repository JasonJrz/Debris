
export default class Ren {
  constructor({
    canvas,
    engine,
    width = 300,
    height = 150,
    antialias = false,
    alpha = true
  })
  {
    this.canvas = document.querySelector(canvas)
    this.gl = this.canvas.getContext('webgl') || this.context.getContext('experimental-webgl')

    this.antialias = antialias
    this.dpr = this.antialias ? 1 : Math.min(devicePixelRatio, 2)

    this.engine = engine

    this.setSize(width, height)
    this.engine.add(this.render.bind(this), 'ren')
  }

  setSize(width, height) {
    this.width = width
    this.height = height

    this.gl.canvas.width = width * this.dpr
    this.gl.canvas.height = height * this.dpr
  }

  render() {
    console.log('Canvas Running')

    //Overclocks the RAF
    // this.engine.on = requestAnimationFrame(this.engine.update)

    this.gl.enable(this.gl.SCISSOR_TEST)
    this.gl.viewport(0, 0, this.gl.drawBufferWidth, this.gl.drawBufferHeight)
    this.gl.clearColor(1.0, 1.0, 0, 0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }
}