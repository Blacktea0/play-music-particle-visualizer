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
void main() { gl_FragColor = vec4(0, -10000, 0, 0); }
