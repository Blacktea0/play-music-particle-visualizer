precision mediump float;
varying vec2 a;
attribute vec2 b;
uniform vec4 c;
void main()
{
    a = b;
    vec2 d = b * c.xy + c.zw;
    gl_Position = vec4(d * 2. - vec2(1), 1, 1);
}

precision mediump float;
varying vec2 a;
uniform sampler2D d;
void main()
{
    vec4 e = texture2D(d, a);
    gl_FragColor = e;
}

// c: "scaleOffset"
// d: "tex"