
import { Plane, Transform } from 'ogl'

import Media from './media'

export default class Home {
  constructor({ gl, scene, sizes, geometry }) {
    this.gl = gl
    this.scene = scene
    this.sizes = sizes
    this.geometry = geometry

    this.group = new Transform()
    this.group.setParent(this.scene)

    this.createGeometry()
    this.createMedias()

    this.onResize(this.sizes)
    this.intro()
  }

  /**
   * Create GL Images
   */
  createGeometry() {
    this.geometry = new Plane(this.gl, {
      heightSegments: 16,
      widthSegments: 16
    })
  }

  createMedias() {
    this.elements = [...document.querySelectorAll('.m-i')]
    
    this.medias = this.elements.map((element, index) => {
      return new Media({
        index,
        element,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes,
        geometry: this.geometry
      })
    })
  }

  /**
   * Transitions.
   */
  transition(element) {
    return Promise.all(this.medias.map(media => {
      if(media.isTransitioning) {
        const t = media.texture.image.src
        const m = element.medias.find(item => item.texture.image.src === t)
        
        return media.transition(m)
      }
    }))
  }

  outro() {
    return Promise.all(this.medias.map(media => {
      if(!media.isTransitioning) {
        return media.outro()
      }
    }))
  }

  intro() {
    return Promise.all(this.medias.map(media => media.intro()))
  }

  /**
   * Events.
   */
  onResize(sizes) {
    this.medias.map(media => media.onResize(sizes))
  }

  /**
   * Raf.
   */
  update(scroll) {
    this.medias.map(media => media.update(scroll))
  }

  /**
   * Remove Mesh
   */
  destroy() {
    this.scene.removeChild(this.group)
  }
}