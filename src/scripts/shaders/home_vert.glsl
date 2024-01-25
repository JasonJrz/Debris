
#define PI 3.141592653

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float s;
uniform float p;
uniform float np;

uniform vec2 v;
uniform vec2 m;
uniform vec2 tms;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;

  vec3 pos = position;
  
  vec4 nPosition = modelViewMatrix * vec4(pos, 1.0);

  nPosition.z += cos(nPosition.y / v.y * PI + uTime) * (s * 3.0 + 0.1);
  nPosition.y += sin(vUv.x * PI + uTime) * (0.05 + s * 1.3);

  gl_Position = projectionMatrix * nPosition;
}