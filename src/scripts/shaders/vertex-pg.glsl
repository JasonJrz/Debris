
attribute vec3 normal;
attribute vec3 position;
attribute vec2 uv;

attribute vec3 centroid;
attribute vec3 axis;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uProgress;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

#include ./includes/math/rotate.glsl

void main() {
  vec3 pos = position;

  float timer = 1.0 - (sin(uTime * 0.2) + 1.0) * 0.5;
  timer *= uProgress;

  // pos += centroid * uProgress;

  // Calculate the spherical coordinates
  float phi = atan(pos.y, pos.x);
  float theta = acos(pos.z / length(pos));

  // float newRadius = length(pos + centroid);
  float newRadius = length(pos); 

  // Calculate the new position using the updated spherical coordinates
  pos = vec3(
    newRadius * sin(theta) * cos(phi),
    newRadius * sin(theta) * sin(phi),
    newRadius * cos(theta)
  );

  vec3 rotationAxis = normalize(cross(centroid, axis));

  pos += centroid * uProgress;
  
  // Apply rotation around the centroid axis
  pos = rotate(pos, rotationAxis, uTime * 0.2);


  // Calculate the final position by blending between the original position and the spherical position based on timer
  vec3 finalPos = mix(position, pos, uProgress);

  vec4 modelPosition = modelMatrix * vec4(finalPos, 1.0);
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vec4 modelMatrix = modelMatrix * vec4(normal, 0.0);

  vUv = uv;
  vNormal = modelMatrix.xyz;
  vPosition = modelPosition.xyz;
}