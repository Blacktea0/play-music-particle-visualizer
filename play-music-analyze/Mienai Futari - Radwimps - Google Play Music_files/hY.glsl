precision mediump float;
attribute vec2 a;
uniform sampler2D b;
uniform mat4 c;
void main()
{
    vec4 d = texture2D(b, a);
    gl_Position = c * vec4(d.xyz, 1);
    gl_PointSize = 1. + min(1. / gl_Position.w, 64.);
}

precision mediump float;
uniform float d;
void main()
{
    vec2 a = 2. * (gl_PointCoord - vec2(.5));
    float e = 1. - smoothstep(0., 1., dot(a, a));
    gl_FragColor = vec4(d * e);
}

// b: "positionTex"
// c: "worldViewProj"
// d: "density"