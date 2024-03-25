
precision highp float;

uniform vec3 cameraPosition;

uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

#include ./includes/lights/directional.glsl
#include ./includes/lights/ambient.glsl
#include ./includes/lights/point.glsl

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDirection = normalize(vPosition - cameraPosition);

  vec3 color = vec3(1.0, 1.0, 1.0);
  vec3 light = vec3(0.0);

  light += ambientLight(
    vec3(1.0), // Light Color
    0.3        // Light Intensity
  );

  light += directionalLight(
    vec3(0.1, 0.1, 1.0),
    1.0,
    normal,
    vec3(0.0, 0.0, 3.0),
    viewDirection,
    2.0
  );

  light += pointLight(
    vec3(1.0, 0.1, 0.1),
    1.0,
    normal,
    vec3(0.0, 2.5, 0.0),
    viewDirection,
    20.0,
    vPosition,
    0.3
  );

  color *= light;

  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}