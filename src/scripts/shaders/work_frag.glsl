
precision highp float;

uniform sampler2D t;

uniform float s;
uniform float np;
uniform float p;
uniform float ua;
uniform float uTime;

uniform vec2 d;
uniform vec2 m;

varying vec2 vUv;
varying vec2 vScale;

varying vec3 vWave;

vec2 backgroundCoverUv( vec2 screenSize, vec2 imageSize, vec2 uv ) {
	float screenRatio = screenSize.x / screenSize.y;
	float imageRatio = imageSize.x / imageSize.y;
	vec2 newSize = screenRatio < imageRatio 
	? vec2(imageSize.x * (screenSize.y / imageSize.y), screenSize.y)
	: vec2(screenSize.x, imageSize.y * (screenSize.x / imageSize.x));
	vec2 newOffset = (screenRatio < imageRatio 
	? vec2((newSize.x - screenSize.x) / 2.0, 0.0) 
	: vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;
	return uv * screenSize / newSize + newOffset;
}

vec3 rgbShift(sampler2D texture, vec2 uv, float offset) {
  float r = texture2D(texture, uv + offset).r;
  float g = texture2D(texture, uv).g;
  float b = texture2D(texture, uv + offset).b;

  return vec3(r, g, b);
}

void main() {
  vec2 newUV = vUv;
	vec3 wave = vWave;
  vec2 scaledPlane = m * vScale;

  newUV = backgroundCoverUv(scaledPlane, d, newUV);

	vec3 color = rgbShift(t, newUV, s * 0.05); 

	float gb = abs(sin(wave.z));

  gl_FragColor = vec4(color, ua);
	gl_FragColor.rgb += gb * 0.7;
}