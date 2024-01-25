
import { resizeCanvasToDisplay } from './resize'
// import { createUniformSetters } from './set'

import fragmentShader from '../../canvas/shaders/fragment_shader.glsl'
import vertexShader from '../../canvas/shaders/vertex_shader.glsl'

export default class GL {
  constructor({ canvas , engine }) {
    this.canvas = document.getElementById(canvas)
    this.gl = this.canvas.getContext('webgl', {
      antialias: true,
      alpha: true
    }) || this.canvas.getContext('experimental-webgl')
    this.element = document.querySelector('.media')
    this.data = this.element.getAttribute('data-src')
    this.size = this.element.getBoundingClientRect()

    this.engine = engine
    
    if(!this.gl) return

    this.media = new Image()
    this.media.crossOrigin = 'anonymous'
    this.media.src = this.data
    this.media.onload = () => {
      this.init(this.media)
      this.resize()
    }
  }

  init(image) {
    const vertex = this.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShader)
    const fragment = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShader)

    this.program = this.createProgram(this.gl, vertex, fragment)

    this.positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position')
    this.textureAttributeLocation = this.gl.getAttribLocation(this.program, 'a_texCoord')
    this.resolutionUniformLocation = this.gl.getUniformLocation(this.program, 'u_resolution')
    this.textureSizeLocation = this.gl.getUniformLocation(this.program, 'tSize')

    this.positionBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)

    //Set dom size instead of image size
    this.setQuad(this.gl, 0, 0, this.size.width, this.size.height)

    this.texCoordBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0

      // -0.5,0.5,0.0,
      // -0.5,-0.5,0.0,
      //  0.5,-0.5,0.0,
      //  0.5,0.5,0.0 
    ]), this.gl.STATIC_DRAW)

    const texture = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image)
  }

  createShader(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

    if(success) return shader

    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
  }

  createProgram(gl, vertex, fragment) {
    const program = gl.createProgram()

    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)

    if(success) return program

    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
  }

  setQuad(gl, x, y, width, height) {
    console.log(x, width, y, height)

    const x1 = x
    const x2 = x + Math.round(width)
    const y1 = y
    const y2 = y + Math.round(height)

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2
    ]), gl.STATIC_DRAW)
  }

  resize() {
    resizeCanvasToDisplay(this.gl.canvas)

    console.log(this.gl.canvas.width, this.gl.drawingBufferWidth)
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    // this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight)
    this.gl.clearColor(0, 0, 0, 0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.gl.useProgram(this.program)
    this.gl.enableVertexAttribArray(this.positionAttributeLocation)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)

    const size = 2
    const type = this.gl.FLOAT
    const normalized = false
    const stride = 0
    const offset = 0

    this.gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalized, stride, offset)
    this.gl.enableVertexAttribArray(this.textureAttributeLocation)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer)
    this.gl.vertexAttribPointer(this.textureAttributeLocation, size, type, normalized, stride, offset)

    this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.uniform2f(this.textureSizeLocation, this.media.width, this.media.height)

    const primitveType = this.gl.TRIANGLE_STRIP
    const count = 6

    this.gl.drawArrays(primitveType, offset, count)
  }
}