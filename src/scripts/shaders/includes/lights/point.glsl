vec3 pointLight(
  vec3  color,
  float intensity,
  vec3  normal,
  vec3  lightPosition,
  vec3  viewDirection,
  float specularPower,
  vec3  position,
  float decay
) {
  
  vec3 lightDelta = lightPosition - position;
  float lightDistance = length(lightDelta);
  
  vec3 lightDirection = normalize(lightDelta);
  vec3 lightReflection = reflect(-lightDirection, normal);

  float shading = dot(normal, lightDirection);
  shading = max(0.0, shading);

  float specular = -dot(lightReflection, viewDirection);
  specular = max(0.0, specular);
  specular = pow(specular, specularPower);

  float lightDecay = 1.0 - lightDistance * decay;
  lightDecay = max(0.0, lightDecay);

  return color * intensity * lightDecay * (shading + specular);
  return vec3(decay);
}