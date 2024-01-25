
precision highp float;

uniform float ua;
uniform float uTime;

varying vec3 vNormal;
varying vec2 vUv;
varying float vDistort;

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
} 

void main() {
  vec2 uv = vUv;
  float distort = vDistort * 2.2;

  vec3 brightness1 = vec3(0.8, 0.6, 0.6);
  vec3 contrast1 = vec3(0.8, 0.9, 0.7);
  vec3 oscilation1 = vec3(1.0, 1.0, 1.0);
  vec3 phase1 = vec3(0.2, 0.2, 0.2);

  vec3 palette1 = cosPalette(distort, brightness1, contrast1, oscilation1, phase1);

  vec3 brightness2 = vec3(0.2, 0.4, 0.7);
  vec3 contrast2 = vec3(0.6, 0.3, 0.8);
  vec3 oscilation2 = vec3(1.0, 1.0, 1.0);
  vec3 phase2 = vec3(0.1, 0.3, 0.5);

  vec3 palette2 = cosPalette(distort, brightness2, contrast2, oscilation2, phase2);

  vec3 color = mix(palette1, palette2, sin(uTime) * 0.2);

  gl_FragColor = vec4(color, ua);
}