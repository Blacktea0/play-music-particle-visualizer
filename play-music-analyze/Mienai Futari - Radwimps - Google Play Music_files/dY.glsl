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
uniform vec2 d, e;
void main()
{
    vec4 f, g, h, i, j, k, l, m, n, o, p, q, r, s, t;
    f = texture2D(c, a);
    g = texture2D(c, a - d);
    h = texture2D(c, a + d);
    i = texture2D(c, a - 2. * d);
    j = texture2D(c, a + 2. * d);
    k = texture2D(c, a - 3. * d);
    l = texture2D(c, a + 3. * d);
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
    gl_FragColor.a = e.x * gl_FragColor.a + e.y;
}

// c: "mainTex"
// d: "duv"
// e: "alphaScaleOffset"