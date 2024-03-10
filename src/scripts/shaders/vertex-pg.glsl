
attribute vec3 normal;
attribute vec3 position;
attribute vec2 uv;

attribute float aRandom;

attribute vec3 aCenter;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;

uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  
  return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
              oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
              oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
              0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

void main() {
  vec3 pos = position;
  
  float timer = 1.0 - (sin(uTime * 0.1) + 1.0) * 0.5;

  float prog = (pos.x - 1.0) * 0.5;
  float locProg = clamp((1.5 - timer - 0.8 * prog) / 0.2, 0.0, 1.0);

  pos = (pos - aCenter) * locProg;
  pos += 1.2 * (normal + 80.0) * (0.5 - aRandom) * timer;

  pos += aCenter;
  pos = rotate(pos, vec3(0.0, 1.0, 0.0), aRandom * timer * 3.14 * 3.0);

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vec4 modelMatrix = modelMatrix * vec4(normal, 0.0);

  vUv = uv;
  vNormal = modelMatrix.xyz;
  vPosition = modelPosition.xyz;
}