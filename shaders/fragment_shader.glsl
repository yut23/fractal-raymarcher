#version 300 es
precision highp float;

#define MANDELBULB 1
#define MANDELBOX 2

uniform int FRACTAL_TYPE;

uniform float MAX_DIST;
uniform int MARCH_ITERS;

uniform int BULB_ITERS;
uniform float BULB_BAILOUT;
uniform float BULB_POWER;

uniform vec3 cameraPos;


// from http://blog.hvidtfeldts.net/index.php/2011/09/distance-estimated-3d-fractals-v-the-mandelbulb-different-de-approximations/
float DE_bulb(vec3 pos) {
  vec3 z = pos;
  float dr = 1.0;
  float r = 0.0;
  for (int i = 0; i < BULB_ITERS; i++) {
    r = length(z);
    if (r > BULB_BAILOUT)
      break;

    // convert to polar coordinates
    float theta = acos(z.z / r);
    float phi = atan(z.y, z.x);
    dr = pow(r, BULB_POWER - 1.0) * BULB_POWER * dr + 1.0;

    // scale and rotate the point
    float zr = pow(r, BULB_POWER);
    theta = theta * BULB_POWER;
    phi = phi * BULB_POWER;

    // convert back to cartesian coordinates
    z = zr*vec3(sin(theta)*cos(phi), sin(theta)*sin(phi), cos(theta));
    z += pos;
  }
  return 0.5*log(r)*r/dr;
}


uniform float BOX_SCALE;// = 2.5;
uniform float BOX_MIN_R;// = 0.5;
uniform int BOX_ITERS;// = 20;

// by Rrrola, on FractalForums <http://www.fractalforums.com/3d-fractal-generation/a-mandelbox-distance-estimate-formula/msg21412/#msg21412>
float DE_box(vec3 pos) {
  float minRadius2 = BOX_MIN_R * BOX_MIN_R;

  //vec4 scalevec = vec4(BOX_SCALE, BOX_SCALE, BOX_SCALE, abs(BOX_SCALE)) / minRadius2;
  vec4 scalevec = vec4(BOX_SCALE) / minRadius2;
  float C1 = abs(BOX_SCALE-1.0), C2 = pow(abs(BOX_SCALE), float(1-BOX_ITERS));
  float size_factor = BOX_SCALE > 1.0 ? 2.0 * (BOX_SCALE + 1.0) / (BOX_SCALE - 1.0) : BOX_SCALE < -1.0 ? 2.0 : 1.0;
  pos *= size_factor;
  vec4 p = vec4(pos.xyz, 1.0), p0 = vec4(pos.xyz, 1.0);  // p.w is knighty's DEfactor
  for (int i=0; i < BOX_ITERS; i++) {
    p.xyz = clamp(p.xyz, -1.0, 1.0) * 2.0 - p.xyz;  // box fold: min3, max3, mad3
    float r2 = dot(p.xyz, p.xyz);  // dp3
    p.xyzw *= clamp(max(minRadius2/r2, minRadius2), 0.0, 1.0);  // sphere fold: div1, max1.sat, mul4
    p.xyzw = p*scalevec + p0;  // mad4
  }
  // this gives harder edges
  return ((max(max(abs(p.x),abs(p.y)),abs(p.z)) - C1) / p.w - C2) / size_factor;
  // this gives more rounded edges
  //return ((length(p.xyz) - C1) / p.w - C2) / size_factor;
}

float DE(vec3 pos) {
  if (FRACTAL_TYPE == MANDELBULB) {
    return DE_bulb(pos);
  } else if (FRACTAL_TYPE == MANDELBOX) {
    return DE_box(pos);
  }
  return 1.0;
}

/*
 * dir should be normalized
 */
float march(in vec3 dir, in float max_dist, in float stepFactor,
            in float pixelFactor, out int iters) {
  // Treat negative distances as positive if the camera is inside an object, so objects look hollow from inside
  float inside = sign(DE(cameraPos));
  float dist;
  float total_dist = 0.0;
  for (iters = 0; iters < MARCH_ITERS; iters++) {
    dist = inside * DE(cameraPos + dir * total_dist);
    if (dist < pixelFactor * total_dist) {
      return total_dist;
    }
    total_dist += dist * stepFactor;
    if (total_dist > MAX_DIST) {
      return total_dist;
    }
  }
  return -2.0;
}

// from http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 calcNormal( in vec3 p, in float h ) {
  const vec2 k = vec2(1,-1);
  return normalize( k.xyy*DE( p + k.xyy*h ) +
                    k.yyx*DE( p + k.yyx*h ) +
                    k.yxy*DE( p + k.yxy*h ) +
                    k.xxx*DE( p + k.xxx*h ) );
}


const vec3 LIGHT_POS = vec3(-10, 5, 5);
const float ambient_coeff = 0.6;
const float diffuse_coeff = 0.4;
const float specular_coeff = 0.2;
const float shininess = 10.0;
vec3 calcLight(vec3 p, vec3 dir, vec3 n, float ao) {
  vec3 l = normalize(LIGHT_POS - p);
  vec3 r = reflect(l, n);
  float Ia = ambient_coeff * ao;
  float Id = diffuse_coeff * max(dot(l, n), 0.0);
  float Is = specular_coeff * pow(max(dot(r, dir), 0.0), shininess);

  //return Ia + Id;
  return vec3(Ia + Id + Is);
}


float calcAO(vec3 pos, vec3 n, float delta_t, float scale) {
  vec3 delta_n = delta_t * n;
  float occlusion = (delta_t - DE(pos + delta_n)) / 2.0;
  occlusion += (2.0 * delta_t - DE(pos + 2.0*delta_n)) / 4.0;
  occlusion += (3.0 * delta_t - DE(pos + 3.0*delta_n)) / 8.0;
  occlusion += (4.0 * delta_t - DE(pos + 4.0*delta_n)) / 16.0;
  //for (int k = 1; k < 5; k++) {
  //  occlusion += (float(k) * delta_t - DE(pos + delta_t * float(k) * n)) / float(1 << k);
  //}
  return 1.0 - clamp(scale * occlusion, 0.0, 1.0);
}

uniform vec2 resolution;
uniform float STEP_MULT;
uniform float EPS_MULT;

uniform float AO_STEP;
uniform float AO_SCALE;

#define RENDER_ITERS 1
#define RENDER_LIGHTING 2
#define RENDER_AO 4
uniform int RENDER_MODE;
uniform int ITER_OVERRIDE;
uniform vec3 ITER_COLOR;

in mat3 cameraRot;
in float focalLengthPix;
out vec4 fragColor;
in float pixelSizeFactor;

void main() {
  vec2 pixelCoord = 2.0 * gl_FragCoord.xy - resolution;

  // the camera matrix is calculated in the vertex shader, since it's the same for all pixels
  vec3 direction = normalize(cameraRot * vec3(pixelCoord, -focalLengthPix));

  // compute pixel size
  // see pixel-footprint-calculations-clean.nb for the math
  float pixelSizeFactor = 2.0 / length(vec2(min(abs(pixelCoord.x), abs(pixelCoord.y)), focalLengthPix));

  float epsFactor = pixelSizeFactor / 2.0 / EPS_MULT;
  // The Mandelbox has less fine detail than the Mandelbulb, so we can decrease epsilon
  if (FRACTAL_TYPE == MANDELBOX) {
    epsFactor /= 2.0;
  }

  int iters;
  float dist = march(direction, MAX_DIST, STEP_MULT, epsFactor, iters);

  vec3 color = vec3(1.0);
  // crosshairs
  if (abs(pixelCoord.x + 0.5) <= 0.6 && abs(pixelCoord.y + 0.5) / 2.0 <= 5.3 ||
      abs(pixelCoord.y + 0.5) <= 0.6 && abs(pixelCoord.x + 0.5) / 2.0 <= 5.3) {
    color = vec3(0.5);
    fragColor = vec4(color, 1.0);
    return;
  }

  if ((RENDER_MODE & RENDER_ITERS) != 0) {
    color = ITER_COLOR / 255.0 * float(iters);
    if (ITER_OVERRIDE > 0) {
      color /= float(ITER_OVERRIDE);
    } else {
      color /= float(MARCH_ITERS);
    }
    fragColor = vec4(color, 1.0);
    return;
  } else if (dist > MAX_DIST) {
    // blue background
    color = vec3(0.25, 0.35, 0.75);
    fragColor = vec4(color, 1.0);
    return;
  } else if (dist == -2.0) {
    // black if we ran out of iterations
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  float inside = sign(DE(cameraPos));
  vec3 pos = cameraPos + dist * direction;
  vec3 n = inside * calcNormal(pos, epsFactor * dist);

  // calculate ambient occlusion
  float ao;
  if ((RENDER_MODE & RENDER_AO) != 0) {
    float delta_t = pow(10.0, -AO_STEP);
    ao = calcAO(pos, n, inside * delta_t, inside * AO_SCALE);
  } else {
    ao = 0.18;
  }

  // calculate lighting
  if ((RENDER_MODE & RENDER_LIGHTING) != 0) {
    color = calcLight(pos, direction, n, ao);
  } else {
    color *= ao;
  }

  // Output to screen
  fragColor = vec4(color, 1.0);
}
