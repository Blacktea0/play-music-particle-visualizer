precision mediump float;
attribute vec2 uv;
uniform sampler2D positionTex;
uniform mat4 worldViewProj;
void main()
{
    vec4 d = texture2D(positionTex, uv);
    gl_Position = worldViewProj * vec4(d.xyz, 1);
    gl_PointSize = 1. + min(1. / gl_Position.w, 64.);
}

precision mediump float;
uniform float density;
void main()
{
    vec2 a = 2. * (gl_PointCoord - vec2(.5));
    float e = 1. - smoothstep(0., 1., dot(a, a));
    gl_FragColor = vec4(density * e);
}
