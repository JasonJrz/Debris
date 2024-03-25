
attribute vec3 normal;
attribute vec3 position;
attribute vec2 uv;

attribute vec3 centroid;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

#include ./includes/math/rotate.glsl

void main() {
  vec3 pos = position;

  float timer = 1.0 - (sin(uTime * 0.1) + 1.0) * 0.5;

  pos += centroid * timer;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vec4 modelMatrix = modelMatrix * vec4(normal, 0.0);

  vUv = uv;
  vNormal = modelMatrix.xyz;
  vPosition = modelPosition.xyz;
}