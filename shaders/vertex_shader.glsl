#version 300 es
in vec2 vPosition;

uniform vec3 cameraPos;
uniform vec3 lookDir;
uniform vec2 resolution;
uniform float fov;
out mat3 cameraRot;
out float focalLengthPix;

void main() {
  gl_Position = vec4(vPosition, 0.0, 1.0);

  // calculate model-view matrix
  vec3 r = normalize(cross(lookDir, vec3(0.0, 1.0, 0.0))); // rightDir
  vec3 u = normalize(cross(r, lookDir));

  cameraRot = mat3(r, u, -lookDir);
  focalLengthPix = resolution.y / tan(radians(fov) / 2.0);
}
