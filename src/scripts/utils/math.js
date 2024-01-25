
export function clamp(min, max, input) {
  return Math.max(min, Math.min(max, input))
}

export function lerp(start, end, ease) {
  return start + (end - start) * ease
}

export function damp(x, y, lambda, delta) {
  return lerp(x, y, 1 - Math.exp(-lambda * delta))
}

export function mapRange(inMin, inMax, outMin, outMax, input) {
  return ((input - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}