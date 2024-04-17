precision mediump float;
varying vec2 a;
attribute vec2 uv;
uniform vec4 scaleOffset;
void main()
{
    a = uv;
    vec2 d = uv * scaleOffset.xy + scaleOffset.zw;
    gl_Position = vec4(d * 2. - vec2(1), 1, 1);
}

precision mediump float;
varying vec2 a;
uniform sampler2D tex;
void main()
{
    vec4 e = texture2D(tex, a);
    gl_FragColor = e;
}
