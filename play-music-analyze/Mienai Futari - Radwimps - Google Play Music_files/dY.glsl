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
uniform sampler2D mainTex;
uniform vec2 duv, alphaScaleOffset;
void main()
{
    vec4 f, g, h, i, j, k, l, m, n, o, p, q, r, s, t;
    f = texture2D(mainTex, a);
    g = texture2D(mainTex, a - duv);
    h = texture2D(mainTex, a + duv);
    i = texture2D(mainTex, a - 2. * duv);
    j = texture2D(mainTex, a + 2. * duv);
    k = texture2D(mainTex, a - 3. * duv);
    l = texture2D(mainTex, a + 3. * duv);
    m = vec4(0);
    n = vec4(1);
    o = .8521 * max(m, n - .7 * abs(g - f));
    p = .8521 * max(m, n - .7 * abs(h - f));
    q = .5273 * max(m, n - 2. * abs(i - f));
    r = .5273 * max(m, n - 2. * abs(j - f));
    s = .2369 * max(m, n - 2. * abs(k - f));
    t = .2369 * max(m, n - 2. * abs(l - f));
    f += o * g + p * h + q * i + r * j + s * k + t * l;
    gl_FragColor = f / (o + p + q + r + s + t + 1.);
    gl_FragColor.a = alphaScaleOffset.x * gl_FragColor.a + alphaScaleOffset.y;
}
