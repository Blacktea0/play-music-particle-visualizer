precision mediump float;
varying vec2 a;
attribute vec2 b;
void main()
{
    a = b;
    gl_Position = vec4(b * 2. - vec2(1), 1, 1);
}

precision mediump float;
varying vec2 a;
uniform sampler2D c;
uniform vec3 d, e;
void main()
{
    vec4 f, i;
    f = texture2D(c, a);
    float g, h;
    g = .5 * (f.x + f.y);
    h = .5 * (f.z + f.w);
    i = vec4(d * g + e * h, g + h);
    gl_FragColor = 2. * sqrt(i);
    gl_FragColor.xyz = vec3(1) - gl_FragColor.xyz;
}

// c: "tex"
// d: "color0"
// e: "color1"