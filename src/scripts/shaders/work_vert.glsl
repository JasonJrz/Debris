
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
varying vec2 vScale;

varying vec3 vWave;

float ssio(float t) {
  return t * t * (3.0 - 2.0 * t);
}

void main() {
  vUv = uv;

  vec3 pos = position;

  float e = ssio(p);

  float activation = vUv.x;
  float latestStart = 0.5;
  float startAt = activation * latestStart;
  float vertProg = smoothstep(startAt, 1.0, e);

  vec2 newSize = tms / m - 1.0;
  vec2 scale = vec2(1.0 + newSize * vertProg);

  pos.z += sin(vertProg * 3.0) * np;

  pos.xy *= scale;
  
  vec4 nPosition = modelViewMatrix * vec4(pos, 1.0);
  nPosition.z += cos(nPosition.y / v.y * PI) * (s * 3.0);

  vScale = scale;
  vWave = pos;

  gl_Position = projectionMatrix * nPosition;
}