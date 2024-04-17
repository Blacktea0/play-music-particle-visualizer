precision mediump float;
varying vec2 a;
attribute vec2 uv;
void main()
{
    a = uv;
    gl_Position = vec4(uv * 2. - vec2(1), 1, 1);
}

precision mediump float;
varying vec2 a;
uniform sampler2D grainTex, mainTex;
uniform vec4 grainScaleOffset;
void main()
{
    vec2 f = a * 2. - vec2(1);
    float g, h;
    g = smoothstep(.2, 5., dot(f, f));
    h = texture2D(grainTex, a * grainScaleOffset.xy + grainScaleOffset.zw).w;
    vec3 i = texture2D(mainTex, a).xyz;
    i *= 1. - g;
    gl_FragColor.xyz = abs(i - .05 * h);
    gl_FragColor.w = 1.;
}

// c: "grainTex"
// d: "mainTex"
// e: "grainScaleOffset"