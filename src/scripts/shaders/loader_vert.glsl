
attribute vec3 position;

attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float p;
uniform float np;

varying vec2 vUv;

float easeInOut(float t) {
    return t*t*(3.0-2.0*t);
}

void main() {
  vUv = uv;

  float ease = easeInOut(np);

  vec3 pos = position;
  float curtain = smoothstep(pos.y, 0.0, ease);
  pos.y -= curtain;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}