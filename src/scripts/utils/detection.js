
class Detection {
  isMobile() {
    return navigator.maxTouchPoints > 0 && /mobi|android|tablet|ipad|iphone/i.test(navigator.userAgent)
  }
}

const DetectionManager = new Detection()
export default DetectionManager