
#define PI 3.141592653

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

uniform float uTime;
uniform float p;
uniform float np;
uniform float es;

uniform vec2 v;
uniform vec2 m;
uniform vec2 tms;

varying vec2 vUv;
varying vec2 vScale;

varying float vBend;
varying float vNoise;

float ssio(float t) {
  return t * t * (3.0 - 2.0 * t);
}

void main() {
  vUv = uv;

  vec3 pos = position;
  float dist = distance(vUv, vec2(0.2, 0.2));

  float e = ssio(p);

  float activation = 1.0 - vUv.x;
  float latestStart = 0.5;
  float startAt = activation * latestStart;
  float vertProg = smoothstep(startAt, 1.0, e);

  vec2 newSize = tms / m - 1.0;
  vec2 scale = vec2(1.0 + newSize * vertProg);

  float endProg = smoothstep(startAt, 1.0, es);

  //<--- Bend Effect --->
  float bendFactor = smoothstep(0.0, 1.0, es);
  float raiseAmount = mix(0.0, 0.8, smoothstep(0.0, 0.8, clamp(pos.x - 0.1, 0.0, 1.0)));

  pos.z = mix(pos.z, raiseAmount, bendFactor * np);

  //<--- Flip Effect --->
  float flippedX = -pos.x;
  pos.x = mix(pos.x, flippedX, vertProg);
  pos.z += mix(0.0, 0.01, vertProg);
  float activationDiff = p;

  float aspectRatio = (m.x / m.y);
  float stepFormula = 0.5 - (activationDiff * p) * aspectRatio;

  vUv.x = mix(vUv.x , 1.0 - vUv.x, step(stepFormula, vertProg));

  pos.xy *= scale;
  
  vec4 nPosition = modelViewMatrix * vec4(pos, 1.0);

  vScale = scale;
  vBend = pos.z * 1.3;
  vNoise = sin(dist * 3.0 - (uTime * 0.5)) * 0.1;

  gl_Position = projectionMatrix * nPosition;
}