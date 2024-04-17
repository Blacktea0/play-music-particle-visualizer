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
uniform sampler2D tex;
uniform vec3 color0, color1;
void main()
{
    vec4 f, i;
    f = texture2D(tex, a);
    float g, h;
    g = .5 * (f.x + f.y);
    h = .5 * (f.z + f.w);
    i = vec4(color0 * g + color1 * h, g + h);
    gl_FragColor = 2. * sqrt(i);
    gl_FragColor.xyz = vec3(1) - gl_FragColor.xyz;
}
