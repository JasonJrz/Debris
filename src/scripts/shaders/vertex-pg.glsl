
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

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

vec3 calculateBoxPosition(vec3 position) {
    // Assuming position is in the range [-1, 1] for each axis
    vec3 boxSize = vec3(1.0); // Size of the box
    return mix(-boxSize, boxSize, position * 0.5 + 0.5);
}

void main() {
  vec3 pos = position;

  float timer = 1.0 - (sin(uTime * 0.1) + 1.0) * 0.5;

  float prog = (pos.y + .0) * 0.5;
  float locProg = clamp((1.5 - timer - 0.8 * prog) / 0.2, 0.0, 1.0);

  pos = (pos - aCenter) * locProg;
  pos += 3.0 * normal * aRandom * timer;

  pos += aCenter;
  pos = rotate(pos, vec3(0.0, 1.0, 0.0), aRandom * timer * 3.14 * 4.0);

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vec4 modelMatrix = modelMatrix * vec4(normal, 0.0);

  // gl_PointSize = 0.1 * uResolution.y;
  // gl_PointSize *= (1.0 / - viewPosition.z);

  vUv = uv;
  vNormal = modelMatrix.xyz;
  vPosition = modelPosition.xyz;
}