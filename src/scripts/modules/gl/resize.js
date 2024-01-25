
export function resizeCanvasToDisplay(canvas) {
  const dpr = Math.min(devicePixelRatio, 2)
  const displayWidth = Math.round(canvas.clientWidth * dpr)
  const displayHeight = Math.round(canvas.clientHeight * dpr)

  console.log(dpr)
  
  const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight
  
  if(needResize) {
    canvas.width = displayWidth
    canvas.height = displayHeight
  }
  
  return needResize
}