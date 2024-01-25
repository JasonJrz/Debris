
precision highp float;

uniform float uTime;
uniform float p;

varying vec2 vUv;

#define NUM_OCTAVES 5

vec3 toRGB(vec3 rgb) {
  return rgb / 255.0;
}

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float fbm(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);

  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

void main() {
  vec2 uv = vUv;

  vec3 color = toRGB(vec3(10.0));

  // float progress = smoothstep(p + 0.1, p - 0.1, noise(gl_FragCoord.xy * 0.2));
  float progress = smoothstep(p, p - 0.01, fbm(gl_FragCoord.xy * 0.005));
  float alpha = mix(0.0, 1.0, progress);

  gl_FragColor = vec4(color, alpha);
}