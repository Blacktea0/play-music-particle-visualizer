precision mediump float;
varying vec2 a;
attribute vec2 uv;
uniform float quality;
void main()
{
    a = uv * vec2(1, quality);
    gl_Position = vec4(a * 2. - vec2(1), 1, 1);
}

precision mediump float;
varying vec2 a;
uniform sampler2D positionTex, randomTex, noiseTex;
uniform vec2 time, randomTexOffset;
uniform vec3 pos0, vel0, pos1, vel1, drift, emitterSize;
const float o = 32.;
const float p = .5 / (o * (o - 1.));
const float q = o / (o - 1.);
const float r = (o - 1.) / (o * o);
const float s = o;
const float t = 1. / o;
vec3 F(vec3 u)
{
    float v = p + floor(u.z) * t;
    return texture2D(noiseTex, vec2(u.x, v + fract(u.y * q) * r)).xyz;
}
vec3 G(vec3 u)
{
    u.z *= o;
    vec3 v, w, x, A, B, C, D, E;
    v = u * .03 - time.x * vec3(.03, .05, .07);
    w = F(v);
    x = F(v + vec3(0, 0, 1));
    A = 2. * mix(w, x, fract(v.z)) - vec3(1);
    B = u * .15 + time.x * vec3(.01, .02, .03);
    C = F(B);
    D = F(B + vec3(0, 0, 1));
    E = 2. * mix(C, D, fract(B.z)) - vec3(1);
    return 8. * A + 5. * E + drift;
}
vec3 H(vec4 u, vec3 v, vec3 w)
{
    vec3 x, B;
    x = u.xyz - v;
    float A = dot(x, x);
    B = x / (1. + A * A);
    B *= 1.5 * max(0., dot(x, w));
    return B;
}
vec3 I(vec4 u, vec3 v, float w)
{
    vec3 x, A;
    x = u.xyz - v;
    A = (1. - smoothstep(0., .5, u.w)) * normalize(x);
    return A * w;
}
void main()
{
    vec4 u, w;
    u = texture2D(positionTex, a);
    float v, B, C, D;
    v = texture2D(randomTex, a + randomTexOffset).w;
    w = texture2D(randomTex, a);
    vec3 x, A, E;
    x = pos0 - w.w * vel0;
    A = pos1 - w.w * vel1;
    B = emitterSize.x;
    C = emitterSize.y;
    D = emitterSize.z;
    if (v < C)
        u = vec4(x + B * w.xyz, 0);
    u.xyz += H(u, x, vel0) + H(u, A, vel1) + I(u, x, D);
    E = G(u.xyz);
    u.xyz += time.y * 30. * .002 * E;
    u.w += time.y;
    if (u.w > 2. + 4. * w.w)
        u.y = -1e4;
    gl_FragColor = u;
}
