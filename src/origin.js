import url from '../assets/flow.mp3'
import { Sampler, Uniform } from './webgl-context'
import { Cy, Dy, Ey, Fy, Gy, Hy, Iy } from './shader/shader-programs'

var d

var u = function (a, b) {
  function c () {}

  c.prototype = b.prototype
  a.Aa = b.prototype
  a.prototype = new c
  a.prototype.constructor = a
  a.vNb = function (a, c, h) {
    for (var e = Array(arguments.length - 2), f = 2; f < arguments.length; f++)
      e[f - 2] = arguments[f]
    return b.prototype[c].apply(a, e)
  }
}

var UX = function () {}
UX.prototype.update = function () {}

var Ja = function () {
  this.nC = this.nC
  this.Oz = this.Oz
}
d = Ja.prototype
d.nC = !1
d.isDisposed = function () {
  return this.nC
}

d.qb = function () {
  this.nC || (this.nC = !0,
    this.Oa())
}

d.Ag = function (a) {
  this.TQa(Ga(Ka, a))
}

d.TQa = function (a, b) {
  this.nC ? l(b) ? a.call(b) : a() : (this.Oz || (this.Oz = []),
    this.Oz.push(l(b) ? q(a, b) : a))
}

d.Oa = function () {
  if (this.Oz)
    for (; this.Oz.length;)
      this.Oz.shift()()
}

var kd = 'closure_listenable_' + (1E6 * Math.random() | 0)

var Q = function () {
  Ja.call(this)
  this.Ks = new nd(this)
  this.wQa = this
  this.f$ = null
}
u(Q, Ja)
Q.prototype[kd] = !0
d = Q.prototype
d.ZC = function () {
  return this.f$
}

d.Hda = function (a) {
  this.f$ = a
}

d.addEventListener = function (a, b, c, e) {
  v(this, a, b, c, e)
}

d.removeEventListener = function (a, b, c, e) {
  zd(this, a, b, c, e)
}

d.dispatchEvent = function (a) {
  var b, c = this.ZC()
  if (c)
    for (b = []; c; c = c.ZC())
      b.push(c)
  var c = this.wQa
    , e = a.type || a
  if (za(a))
    a = new La(a, c)
  else if (a instanceof La)
    a.target = a.target || c
  else {
    var f = a
    a = new La(e, c)
    Bc(a, f)
  }
  var f = !0, h
  if (b)
    for (var k = b.length - 1; !a.bA && 0 <= k; k--)
      h = a.currentTarget = b[k],
        f = h.aI(e, !0, a) && f
  a.bA || (h = a.currentTarget = c,
    f = h.aI(e, !0, a) && f,
  a.bA || (f = h.aI(e, !1, a) && f))
  if (b)
    for (k = 0; !a.bA && k < b.length; k++)
      h = a.currentTarget = b[k],
        f = h.aI(e, !1, a) && f
  return f
}

d.Oa = function () {
  Q.Aa.Oa.call(this)
  this.Qaa()
  this.f$ = null
}

d.listen = function (a, b, c, e) {
  return this.Ks.add(String(a), b, !1, c, e)
}

d.Hh = function (a, b, c, e) {
  return this.Ks.add(String(a), b, !0, c, e)
}

d.Ne = function (a, b, c, e) {
  return this.Ks.remove(String(a), b, c, e)
}

d.SLa = function (a) {
  return this.Ks.dFa(a)
}

d.Qaa = function (a) {
  return this.Ks ? this.Ks.removeAll(a) : 0
}

d.aI = function (a, b, c) {
  a = this.Ks.Ih[String(a)]
  if (!a)
    return !0
  a = a.concat()
  for (var e = !0, f = 0; f < a.length; ++f) {
    var h = a[f]
    if (h && !h.removed && h.capture == b) {
      var k = h.listener
        , m = h.Mo || h.src
      h.RO && this.SLa(h)
      e = !1 !== k.call(m, c) && e
    }
  }
  return e && 0 != c.SFa
}

d.KI = function (a, b, c, e) {
  return this.Ks.KI(String(a), b, c, e)
}

d.hasListener = function (a, b) {
  return this.Ks.hasListener(l(a) ? String(a) : void 0, b)
}

var ZX = function (a, b) {
  Q.call(this)
  this.Ve = a
  this.yya = b
}
u(ZX, Q)
d = ZX.prototype
d.getName = function () {
  return this.Ve
}

d.kZ = function () {}

d.start = function () {}

d.stop = function () {}

d.c8 = function () {
  return !1
}

var HY = function (a, b) {
  ZX.call(this, b.displayName, b.identifier)
  this.Qu = b
  this.YFa = null
  this.yzb = this.Qu.identifier.toLowerCase()
  this.ta = a
  this.Hz = null
  this.lT = !1
  this.ra = new Lo(this)
  this.QXa = new EY
  this.aaa = new FY(80)
  a = q(function () {
    var a = ['_trackTiming', 'Visualizer', 'Frame Draw', Math.round(this.aaa.meb()), this.Qu.identifier]
    null != window._gaq && window._gaq.push(a)
  }, this)
  null != window._gaq || (a = function () {}
  )
  this.pZa = new GY(a)
  this.XT = this.LL = this.Jx = this.h8 = null
  v(this.ta, 'h', this.y$, !1, this)
}
u(HY, ZX)
d = HY.prototype
d.y$ = function () {
  if (null != this.Hz)
    switch (this.ta.ub) {
      case 4:
        this.lT = !0
        break
      case 3:
        this.lT = !1,
          this.Jx.start()
    }
}

d.kZ = function (a) {
  var b = dm('DIV', ['staticpreview', this.yzb])
  a.appendChild(b)
}

// Get webgl context and return it.
d.Wwa = function (a) {
  var b = this.Qu.eNa
    , c = b.cla
  if (a = a.getContext('webgl', c) || a.getContext('experimental-webgl', c))
    for (c = 0; c < b.iba.length; ++c)
      if (!a.getExtension(b.iba[c]))
        return null
  return a
}

d.k2 = function (a) {
  return 1 == a ? this.ta.TZa() : this.QXa
}

d.stop = function () {
  null != this.Hz && (this.aaa.clear(),
    this.Hz = null,
    km(this.kf),
  this.LL && (km(this.XT),
    this.XT = null,
    this.LL.qb(),
    this.LL = null),
  this.Jx && (this.Jx.qb(),
    this.Jx = null),
    this.kf = null)
}

d.c8 = function () {
  if (null == this.h8) {
    var a = dm('CANVAS')
    a.width = 64
    a.height = 64
    this.h8 = null != this.Wwa(a)
  }
  return this.h8 && this.ta.YSa()
}

d.Yfa = function (a) {
  if (null != this.Hz)
    if (this.lT || this.Jx.start(),
    null != this.k2(this.Hz)) {
      var b = this.YFa
      this.aaa.ekb(function () {
        b.update(a)
      })
      this.pZa.Hib()
    } else
      this.stop()
}

d.start = function (a, b) {
  this.Hz != b && null != this.k2(b) && this.Yjb(a, b)
}

d.Yjb = function (a, b) {
  this.Hz = b
  this.lT = !1
  this.kf = a
  var c = dm('CANVAS')
    , e = Math.max(a.offsetHeight, 16)
  c.width = Math.max(a.offsetWidth, 16)
  c.height = e;
  (e = this.Wwa(c)) ? (this.XT = c,
    b = this.k2(b),
    null != b ? (this.LL = new MX(c, e),
      a.appendChild(this.XT),
      this.YFa = new this.Qu.wP(b, e, c, this.LL),
      this.Jx = new zU(this.Yfa, null, this),
      this.Jx.start()) : this.stop()) : this.stop()
}

var zU = function (a, b, c) {
  Ja.call(this)
  this.Sb = null
  this.eha = !1
  this.jf = a
  this.Kb = c
  this.Yr = b || window
  this.yj = q(this.Es, this)
}
u(zU, Ja)
d = zU.prototype
d.start = function () {
  this.stop()
  this.eha = !1
  var a = this.nua()
    , b = this.jpa()
  a && !b && this.Yr.mozRequestAnimationFrame ? (this.Sb = v(this.Yr, 'MozBeforePaint', this.yj),
    this.Yr.mozRequestAnimationFrame(null),
    this.eha = !0) : this.Sb = a && b ? a.call(this.Yr, this.yj) : this.Yr.setTimeout(Jba(this.yj), 20)
}

d.stop = function () {
  if (this.Xm()) {
    var a = this.nua()
      , b = this.jpa()
    a && !b && this.Yr.mozRequestAnimationFrame ? Ad(this.Sb) : a && b ? b.call(this.Yr, this.Sb) : this.Yr.clearTimeout(this.Sb)
  }
  this.Sb = null
}

d.xC = function () {
  this.stop()
  this.Es()
}

d.Xm = function () {
  return null != this.Sb
}

d.Es = function () {
  this.eha && this.Sb && Ad(this.Sb)
  this.Sb = null
  this.jf.call(this.Kb, t())
}

d.Oa = function () {
  this.stop()
  zU.Aa.Oa.call(this)
}

d.nua = function () {
  var a = this.Yr
  return a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame || a.oRequestAnimationFrame || a.msRequestAnimationFrame || null
}

d.jpa = function () {
  var a = this.Yr
  return a.cancelAnimationFrame || a.cancelRequestAnimationFrame || a.webkitCancelRequestAnimationFrame || a.mozCancelRequestAnimationFrame || a.oCancelRequestAnimationFrame || a.msCancelRequestAnimationFrame || null
}

var MX = function (a, b) {
  Ja.call(this)
  this.fq = a
  this.Sc = b
  this.Nx = null
  this.PO = []
  this.yQ = []
  this.iV = []
  this.RX = []
}
u(MX, Ja)
MX.prototype.Oa = function () {
  for (var a = 0; a < this.PO.length; ++a)
    this.Sc.deleteBuffer(this.PO[a].handle)
  this.PO = []
  for (a = 0; a < this.yQ.length; ++a) {
    var b = this.yQ[a]
    b.jq && this.Sc.deleteTexture(b.jq.handle)
    b.MP && this.Sc.deleteTexture(b.MP.handle)
    this.Sc.deleteFramebuffer(b.handle)
  }
  this.yQ = []
  for (a = 0; a < this.iV.length; ++a) {
    var b = this.iV[a]
      , c = this.Sc.getAttachedShaders(b.handle)
    if (c)
      for (var e = 0; e < c.length; ++e)
        this.Sc.detachShader(b.handle, c[e]),
          this.Sc.deleteShader(c[e])
    this.Sc.deleteProgram(b.handle)
  }
  this.iV = []
  for (a = 0; a < this.RX.length; ++a)
    this.Sc.deleteTexture(this.RX[a].handle)
  this.RX = []
}

MX.prototype.activateProgram = function (a) {
  if (this.Nx != a) {
    var b = this.Nx ? this.Nx.attribCount : 0
      , c = a.attribCount
    if (b > c)
      for (var e = c; e < b; ++e)
        this.Sc.disableVertexAttribArray(e)
    else
      for (e = b; e < c; ++e)
        this.Sc.enableVertexAttribArray(e)
    this.Sc.useProgram(a.handle)
    this.Nx = a
  }
}

MX.prototype.bindTexture = function (a, b) {
  var c = this.Nx.getSampler(a)
  if (void 0 != c)
    this.Sc.activeTexture(33984 + c.textureX),
      this.Sc.bindTexture(3553, b.handle)
  else
    throw Error('Texture ' + a + ' not found')
}

var $ja = function (a, b, c, e, f) {
  this.MP = this.jq = null
  this.handle = a.createFramebuffer()
  this.width = b
  this.height = c
  a.bindFramebuffer(36160, this.handle)
  e && (this.jq = new NX(a, b, c, e),
    a.framebufferTexture2D(36160, 36064, 3553, this.jq.handle, 0))
  f && (this.MP = new NX(a, b, c, f),
    a.framebufferTexture2D(36160, 36096, 3553, this.MP.handle, 0))
  a.bindFramebuffer(36160, null)
}
d = MX.prototype
d.createFramebuffer = function (a, b, c, e) {
  var f = null
  e && (f = {
    type: 5123,
    Gn: 33071,
    filter: 9728,
    format: 6402,
    data: null
  })
  a = new $ja(this.Sc, a, b, c, f)
  this.yQ.push(a)
  return a
}

d.createTexture = function (a, b, c) {
  a = new NX(this.Sc, a, b, c)
  this.RX.push(a)
  return a
}

d.bindAttributeBuffer = function (a, b) {
  a = this.Nx.attributes[a]
  this.Sc.bindBuffer(34962, b.handle)
  this.Sc.vertexAttribPointer(a, b.a1, 5126, !1, 0, 0)
}

d.drawArrays = function (a, b, c) {
  this.Sc.drawArrays(a, b, c)
}

d.createBuffer = function (a, b, c) {
  a = new aka(this.Sc, a, b, c)
  this.PO.push(a)
  return a
}

d.createProgram = function (a) {
  a = new a(this.Sc)
  this.iV.push(a)
  return a
}

var aka = function (a, b, c, e) {
  this.handle = a.createBuffer()
  this.a1 = b
  this.Qt = e.length / b
  this.usage = c
  if (0 != e.length % this.a1)
    throw Error('Number of elements is not a multiple of elementSize')
  if (e.length != this.a1 * this.Qt)
    throw Error('Unexpected number of elements')
  a.bindBuffer(34962, this.handle)
  a.bufferData(34962, e, this.usage)
}
  , NX = function (a, b, c, e) {
  this.width = b
  this.height = c
  this.handle = a.createTexture()
  this.type = void 0 != e.type ? e.type : 5121
  this.Gn = void 0 != e.Gn ? e.Gn : 10497
  this.filter = void 0 != e.filter ? e.filter : 9729
  this.format = void 0 != e.format ? e.format : 6408
  b = void 0 != e.data ? e.data : null
  a.bindTexture(3553, this.handle)
  a.texImage2D(3553, 0, this.format, this.width, this.height, 0, this.format, this.type, b)
  a.texParameteri(3553, 10240, this.filter)
  a.texParameteri(3553, 10241, this.filter)
  a.texParameteri(3553, 10242, this.Gn)
  a.texParameteri(3553, 10243, this.Gn)
}

d = MX.prototype
d.bindFramebuffer = function (a) {
  a ? (this.Sc.bindFramebuffer(36160, a.handle),
    this.Sc.viewport(0, 0, a.width, a.height)) : (this.Sc.bindFramebuffer(36160, null),
    this.Sc.viewport(0, 0, this.fq.width, this.fq.height))
}

d.blendColor = function (a, b, c, e) {
  this.Sc.blendColor(a, b, c, e)
}

d.blendEquation = function (a) {
  this.Sc.blendEquation(a)
}

d.blendEquationSeparate = function (a, b) {
  this.Sc.blendEquationSeparate(a, b)
}

d.blendFunc = function (a, b) {
  this.Sc.blendFunc(a, b)
}

d.blendFuncSeparate = function (a, b, c, e) {
  this.Sc.blendFuncSeparate(a, b, c, e)
}

d.clear = function (a) {
  this.Sc.clear(a)
}

d.clearColor = function (a, b, c, e) {
  this.Sc.clearColor(a, b, c, e)
}

d.colorMask = function (a, b, c, e) {
  this.Sc.colorMask(a, b, c, e)
}

d.depthMask = function (a) {
  this.Sc.depthMask(a)
}

d.disable = function (a) {
  this.Sc.disable(a)
}

d.enable = function (a) {
  this.Sc.enable(a)
}

d.viewport = function (a, b, c, e) {
  this.Sc.viewport(a, b, c, e)
}

d.getExtension = function (a) {
  return this.Sc.getExtension(a)
}

d.getSupportedExtensions = function () {
  return this.Sc.getSupportedExtensions()
}

d.setUniform = function (a, b) {
  var c = this.Nx.uniforms[a]
  if (!c)
    throw Error('No uniform named "' + a + '"')
  var e = this.Sc, f
  f = 2 == arguments.length ? b : Array.prototype.slice.call(arguments, 1)
  c.isMatrix ? c.setter.call(e, c.location, !1, f) : c.setter.call(e, c.location, f)
}

var lY = function (a, b, c) {
  var e = new Float32Array(3)
  e[0] = a
  e[1] = b
  e[2] = c
  return e
}
  , mY = function (a, b, c) {
  c[0] = a[0] + b[0]
  c[1] = a[1] + b[1]
  c[2] = a[2] + b[2]
  return c
}
  , nY = function (a, b, c) {
  c[0] = a[0] - b[0]
  c[1] = a[1] - b[1]
  c[2] = a[2] - b[2]
  return c
}
  , oY = function (a, b, c) {
  c[0] = a[0] * b
  c[1] = a[1] * b
  c[2] = a[2] * b
  return c
}
  , pY = function (a, b) {
  var c = a[0]
    , e = a[1]
    , f = a[2]
    , c = 1 / Math.sqrt(c * c + e * e + f * f)
  b[0] = a[0] * c
  b[1] = a[1] * c
  b[2] = a[2] * c
  return b
}
  , qY = function (a, b, c) {
  var e = a[0]
    , f = a[1]
  a = a[2]
  var h = b[0]
    , k = b[1]
  b = b[2]
  c[0] = f * b - a * k
  c[1] = a * h - e * b
  c[2] = e * k - f * h
  return c
}
var rY = function (a, b, c) {
  a[b] = c[0]
  a[b + 4] = c[1]
  a[b + 8] = c[2]
  a[b + 12] = c[3]
  return a
}
  , sY = [new Float64Array(4), new Float64Array(4), new Float64Array(4)]
var tY = function (a) {
  this.raw = new Float32Array(a)
  this.bL = new Float32Array(a)
  this.S$ = new Float32Array(a)
}
tY.prototype.syb = function (a, b, c) {
  for (var e = Math.min(a.length, b.length), f = 0; f < e; ++f) {
    for (var h = 0, k = 0, m = -c; m <= c; ++m) {
      var p = f + m
      if (!(0 > p || p >= a.length))
        var r = m / c
          , r = Math.exp(-4 * r * r)
          , h = h + r
          , k = k + r * a[p]
    }
    b[f] = k / h
  }
}

tY.prototype.UAb = function (a) {
  for (var b = 0; b < this.S$.length; ++b)
    this.S$[b] = this.raw[b]
  a.getFloatFrequencyData(this.raw)
  for (b = 0; b < this.raw.length; ++b) {
    a = this.S$[b]
    var c = Math.max(0, 20 * Math.pow(10, .05 * this.raw[b]))
    this.raw[b] = c + (c > a ? .1 : .8) * (a - c)
  }
  this.syb(this.raw, this.bL, 8)
  for (b = 0; b < this.bL.length; ++b)
    this.bL[b] = Math.max(0, 2 * this.raw[b] - this.bL[b])
}

var wY = function (a, b, c, e) {
  this.$h = a
  this.fq = c
  this.Ha = e
  this.zKa = new tY(256)
  a = 100 * Math.random()
  b = 1
  if (320 < this.fq.width || 320 < this.fq.height)
    b = 2
  this.KL = Math.floor(this.fq.width / b)
  this.JL = Math.floor(this.fq.height / b)
  this.gSa = this.KL / this.JL
  this.ISa = this.Ha.createProgram(Dy)
  this.Ha.createProgram(Cy)
  this.KUa = this.Ha.createProgram(Ey)
  this.Kab = this.Ha.createProgram(Fy)
  this.Oib = this.Ha.createProgram(Gy)
  this.Ulb = this.Ha.createProgram(Hy)
  this.rBb = this.Ha.createProgram(Iy)
  this.qCb = this.vVa(32)
  b = new Uint8Array(16384)
  for (c = 0; c < b.length; ++c)
    b[c] = Math.floor(255 * Math.random())
  this.m6 = this.Ha.createTexture(128, 128, {
    filter: 9728,
    data: b,
    type: 5121,
    format: 6406,
    Gn: 10497
  })
  b = {
    filter: 9729,
    Gn: 33071
  }
  this.ZT = this.Ha.createFramebuffer(this.KL, this.JL, b, !1)
  this.Lja = this.Ha.createFramebuffer(this.KL, this.JL, b, !1)
  this.dia = this.Ha.createFramebuffer(this.KL, this.JL, b, !1)
  this.Ji = this.Ha.createBuffer(2, 35044, new Float32Array([0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0]))
  this.jB = 60 * Math.random()
  this.UY = null
  this.Jt = new Float32Array(3)
  this.pna = lY(0, 0, 0)
  this.dI = new Float32Array(80)
  this.xQ = 0
  this.eA = .5
  this.iBa = !1
  this.sU = this.tU = 0
  b = new uY(this.Ha, 512, 1024)
  this.Si = [new vY(this.Ha, b, 0, 20, a), new vY(this.Ha, b, 20, 200, a + 50 + 50 * Math.random())]
  this.Ha.colorMask(!0, !0, !0, !0)
  this.Ha.depthMask(!1)
  this.Ha.disable(2929)
  this.Ha.disable(2884)
  this.Ha.disable(3042)
  this.Ha.activateProgram(this.Kab)
  this.Ha.bindAttributeBuffer('uv', this.Ji)
  for (c = 0; c < this.Si.length; ++c)
    this.Ha.bindFramebuffer(this.Si[c].Tt),
      this.Ha.drawArrays(4, 0, this.Ji.Qt),
      this.Ha.bindFramebuffer(this.Si[c].gV),
      this.Ha.drawArrays(4, 0, this.Ji.Qt)
  this.Wab()
}
u(wY, UX)
var kka = {
  wP: wY,
  displayName: 'Particles',
  identifier: 'Particles',
  eNa: {
    iba: ['OES_texture_float', 'OES_texture_float_linear'],
    cla: {
      antialias: !1,
      depth: !1,
      stencil: !1
    }
  }
}
wY.prototype.vVa = function (a) {
  for (var b = new Uint8Array(a * a * a * 4), c = new Float32Array(a * a * a * 4), e = new Float32Array(a * a * a * 4), f = 0; f < b.length; f += 4)
    c[f + 0] = Math.random() - .5,
      c[f + 1] = Math.random() - .5,
      c[f + 2] = Math.random() - .5,
      c[f + 3] = 2 * Math.random() - 1
  for (var h = 0; h < a; ++h)
    for (var k = 0; k < a - 1; ++k)
      for (f = 0; f < a; ++f) {
        var m = f + k * a + h * a * a, m = 4 * m, p
        p = k
        var r = h
          , A = (f + a - 1) % a
          , E = (f + 1) % a
          , G = (p + a - 2) % (a - 1)
          , J = (p + 1) % (a - 1)
          , N = (r + a - 1) % a
          , R = (r + 1) % a
        p *= a
        r *= a * a
        J *= a
        G *= a
        R *= a * a
        N *= a * a
        p = [c[f + J + r + 2] - c[f + G + r + 2] - c[f + p + R + 1] + c[f + p + N + 1], c[f + p + R + 0] - c[f + p + N + 0] - c[E + p + r + 2] + c[A + p + r + 2], c[E + p + r + 1] - c[A + p + r + 1] - c[f + J + r + 0] + c[f + G + r + 0], 0]
        e[m++] = p[0]
        e[m++] = p[1]
        e[m++] = p[2]
        e[m++] = p[3]
      }
  for (f = 0; f < b.length; ++f)
    b[f] = Math.floor(Math.min(Math.max(127.5 * (e[f] + 1), 0), 255))
  c = 4 * a
  e = a * c
  for (h = 0; h < a; ++h)
    for (k = h * e + (a - 1) * c,
      m = h * e,
      f = 0; f < 4 * a; ++f)
      b[k + f] = b[m + f]
  return this.Ha.createTexture(a, a * a, {
    data: b
  })
}

var xY = function (a, b, c) {
  var e = 2 * (Math.cos(.51 * a) + Math.sin(.29 * a))
    , f = 3 * Math.cos(a + Math.sin(.47 * a)) - 2 * Math.sin(.79 * a)
  a = .5 + .5 * (Math.sin(a + Math.cos(.31 * a)) * Math.cos(3.7 * a) - Math.sin(2.1 * a))
  a = b + a * (c - b)
  return lY(a * Math.cos(f) * Math.cos(e), a * Math.sin(e), a * Math.sin(f) * Math.cos(e))
}
d = wY.prototype
d.Nma = function (a, b) {
  a %= 6
  a = lY(Math.max(0, Math.min(1, Math.abs(a - 3) - 1)), Math.max(0, Math.min(1, 2 - Math.abs(a - 2))), Math.max(0, Math.min(1, 2 - Math.abs(a - 4))))
  a[0] = 1 - b + b * a[0]
  a[1] = 1 - b + b * a[1]
  a[2] = 1 - b + b * a[2]
  return a
}

d.update = function (a) {
  var b = 2 / 60
  this.UY && (b = (a - this.UY) / 1E3,
    b = Math.min(.2, b))
  this.UY = a
  a = this.sBb(b)
  this.zKa.UAb(this.$h)
  this.jB += a
  this.lBb(a)
  this.HAb()
  this.tc(a)
}

d.sBb = function (a) {
  for (var b = this.dI.length - 1; 0 < b; --b)
    this.dI[b] = this.dI[b - 1]
  this.dI[0] = 1E3 * a
  this.xQ = Math.min(30, this.xQ + 1)
  for (b = a = 0; b < this.xQ; ++b)
    a += this.dI[b]
  a /= this.xQ
  36 < a ? (++this.tU,
    this.sU = 0) : (++this.sU,
    this.tU = 0)
  30 < this.tU && (this.iBa = !0,
    this.tU = 0,
    this.eA = Math.max(.1, this.eA - Math.min(.1, (a - 36) / 200)))
  !this.iBa && 30 < this.sU && (this.sU = 0,
    this.eA = Math.min(1, this.eA + .01))
  return a / 1E3
}

d.lBb = function (a) {
  for (var b = 0; b < this.Si.length; ++b)
    this.Si[b].update(a, this.zKa.bL)
  this.Ha.colorMask(!0, !0, !0, !0)
  this.Ha.depthMask(!1)
  this.Ha.disable(2929)
  this.Ha.disable(2884)
  this.Ha.disable(3042)
  this.Ha.activateProgram(this.rBb)
  this.Ha.bindTexture('noiseTex', this.qCb)
  this.Ha.setUniform('time', this.jB, a)
  this.Ha.setUniform('drift', 60 * Math.sin(this.jB) * a, 150 * a, 120 * a)
  this.Ha.setUniform('randomTexOffset', Math.random(), Math.random())
  for (b = 0; b < this.Si.length; ++b) {
    var c = this.Si[b]
      , e = c.czb()
      , f = 3 * e
      , h = 12 * f * f * f
      , k = c.gV
    c.gV = c.Tt
    c.Tt = k
    k = Math.floor(this.eA * c.Tt.height) / c.Tt.height
    this.Ha.bindFramebuffer(c.Tt)
    this.Ha.bindTexture('randomTex', c.maa)
    this.Ha.bindTexture('positionTex', c.gV.jq)
    this.Ha.bindAttributeBuffer('uv', this.Ji)
    this.Ha.setUniform('emitterSize', .01 + f, h, a * e * 30)
    this.Ha.setUniform('pos0', this.Si[b].position)
    this.Ha.setUniform('vel0', this.Si[b].gha)
    this.Ha.setUniform('pos1', this.Si[1 - b].position)
    this.Ha.setUniform('vel1', this.Si[1 - b].gha)
    this.Ha.setUniform('quality', k)
    this.Ha.drawArrays(4, 0, this.Ji.Qt)
  }
}

d.Tlb = function () {
  var a = new Float32Array(16)
    , b = new Float32Array(16)
    , c = new Float32Array(16)
  var e = this.gSa
    , f = 70 * Math.PI / 180 / 2
    , h = Math.sin(f)
  0 != h && 0 != e && (f = Math.cos(f) / h,
    b[0] = f / e,
    b[1] = 0,
    b[2] = 0,
    b[3] = 0,
    b[4] = 0,
    b[5] = f,
    b[6] = 0,
    b[7] = 0,
    b[8] = 0,
    b[9] = 0,
    b[10] = -1000.01 / 999.99,
    b[11] = -1,
    b[12] = 0,
    b[13] = 0,
    b[14] = -20 / 999.99,
    b[15] = 0)
  h = this.pna
  e = sY[0]
  nY(this.Jt, h, e)
  pY(e, e)
  e[3] = 0
  f = sY[1]
  qY(e, [0, 1, 0], f)
  pY(f, f)
  f[3] = 0
  var k = sY[2]
  qY(f, e, k)
  pY(k, k)
  k[3] = 0
  e[0] = -e[0]
  e[1] = -e[1]
  e[2] = -e[2]
  rY(a, 0, f)
  rY(a, 1, k)
  rY(a, 2, e)
  a[3] = 0
  a[7] = 0
  a[11] = 0
  a[15] = 1
  var e = -h[0]
    , f = -h[1]
    , h = -h[2]
    , k = a[1] * e + a[5] * f + a[9] * h + a[13]
    , m = a[2] * e + a[6] * f + a[10] * h + a[14]
    , p = a[3] * e + a[7] * f + a[11] * h + a[15]
  a[12] = a[0] * e + a[4] * f + a[8] * h + a[12]
  a[13] = k
  a[14] = m
  a[15] = p
  var e = b[0]
    , f = b[1]
    , h = b[2]
    , k = b[3]
    , m = b[4]
    , p = b[5]
    , r = b[6]
    , A = b[7]
    , E = b[8]
    , G = b[9]
    , J = b[10]
    , N = b[11]
    , R = b[12]
    , ba = b[13]
    , la = b[14]
    , b = b[15]
    , Ha = a[0]
    , lb = a[1]
    , tb = a[2]
    , jd = a[3]
    , X = a[4]
    , ug = a[5]
    , Ie = a[6]
    , ml = a[7]
    , yb = a[8]
    , nh = a[9]
    , nl = a[10]
    , vg = a[11]
    , wg = a[12]
    , ud = a[13]
    , Gf = a[14]
    , a = a[15]
  c[0] = e * Ha + m * lb + E * tb + R * jd
  c[1] = f * Ha + p * lb + G * tb + ba * jd
  c[2] = h * Ha + r * lb + J * tb + la * jd
  c[3] = k * Ha + A * lb + N * tb + b * jd
  c[4] = e * X + m * ug + E * Ie + R * ml
  c[5] = f * X + p * ug + G * Ie + ba * ml
  c[6] = h * X + r * ug + J * Ie + la * ml
  c[7] = k * X + A * ug + N * Ie + b * ml
  c[8] = e * yb + m * nh + E * nl + R * vg
  c[9] = f * yb + p * nh + G * nl + ba * vg
  c[10] = h * yb + r * nh + J * nl + la * vg
  c[11] = k * yb + A * nh + N * nl + b * vg
  c[12] = e * wg + m * ud + E * Gf + R * a
  c[13] = f * wg + p * ud + G * Gf + ba * a
  c[14] = h * wg + r * ud + J * Gf + la * a
  c[15] = k * wg + A * ud + N * Gf + b * a
  this.Ha.bindFramebuffer(this.ZT)
  this.Ha.clearColor(0, 0, 0, 0)
  this.Ha.clear(16384)
  this.Ha.enable(3042)
  this.Ha.blendEquation(32774)
  this.Ha.blendFunc(1, 1)
  this.Ha.activateProgram(this.Ulb)
  this.Ha.setUniform('worldViewProj', c)
  c = this.fq.height / 450 / (256 * this.eA)
  c = Math.max(c, 2 / 255)
  this.Ha.setUniform('density', c)
  for (c = 0; 2 > c; ++c)
    a = this.Si[c],
      this.Ha.bindTexture('positionTex', a.Tt.jq),
      this.Ha.bindAttributeBuffer('uv', a.hha),
      a = Math.floor(this.eA * a.Tt.height) * a.Tt.width,
      e = Math.floor(a / 2),
      0 == c ? (this.Ha.colorMask(!0, !1, !1, !1),
        this.Ha.drawArrays(0, 0, e),
        this.Ha.colorMask(!1, !0, !1, !1)) : (this.Ha.colorMask(!1, !1, !0, !1),
        this.Ha.drawArrays(0, 0, e),
        this.Ha.colorMask(!1, !1, !1, !0)),
      this.Ha.drawArrays(0, e, a - e)
  this.Ha.colorMask(!0, !0, !0, !0)
  this.Ha.disable(3042)
  this.Ha.bindFramebuffer(this.Lja)
  this.Ha.activateProgram(this.KUa)
  this.Ha.bindTexture('tex', this.ZT.jq)
  this.Ha.bindAttributeBuffer('uv', this.Ji)
  this.Ha.setUniform('color0', this.Nma(.05 * this.jB, .85))
  this.Ha.setUniform('color1', this.Nma(.05 * this.jB + 2, .85))
  this.Ha.drawArrays(4, 0, this.Ji.Qt)
}

d.tc = function () {
  this.Tlb()
  this.Ha.disable(3042)
  this.Ha.bindFramebuffer(this.ZT)
  this.Ha.activateProgram(this.ISa)
  this.Ha.bindTexture('mainTex', this.Lja.jq)
  this.Ha.bindAttributeBuffer('uv', this.Ji)
  this.Ha.setUniform('duv', 1 / this.KL, 0)
  this.Ha.setUniform('alphaScaleOffset', 1, 0)
  this.Ha.drawArrays(4, 0, this.Ji.Qt)
  this.Ha.enable(3042)
  this.Ha.blendFunc(770, 771)
  this.Ha.bindFramebuffer(this.dia)
  this.Ha.bindTexture('mainTex', this.ZT.jq)
  this.Ha.bindAttributeBuffer('uv', this.Ji)
  this.Ha.setUniform('duv', 0, 1 / this.JL)
  this.Ha.setUniform('alphaScaleOffset', .25, .75)
  this.Ha.drawArrays(4, 0, this.Ji.Qt)
  this.Ha.disable(3042)
  this.Ha.bindFramebuffer(null)
  this.Ha.activateProgram(this.Oib)
  this.Ha.bindTexture('mainTex', this.dia.jq)
  this.Ha.bindTexture('grainTex', this.m6)
  this.Ha.bindAttributeBuffer('uv', this.Ji)
  this.Ha.setUniform('grainScaleOffset', this.fq.width / this.m6.width, this.fq.height / this.m6.height, Math.random(), Math.random())
  this.Ha.drawArrays(4, 0, this.Ji.Qt)
}

d.Wab = function () {
  this.Jt = new Float32Array(3)
  mY(this.Si[0].position, this.Si[1].position, this.Jt)
  oY(this.Jt, .5, this.Jt)
}

d.HAb = function () {
  var a = this.Si[0].position
    , b = this.Si[1].position
    , c = .3 * this.jB
  this.pna = lY(4.4 * Math.cos(c), 0, 4.4 * Math.sin(c))
  c = new Float32Array(3)
  mY(a, b, c)
  oY(c, .5, c)
  oY(c, .05, c)
  oY(this.Jt, .95, this.Jt)
  mY(this.Jt, c, this.Jt)
}

var uY = function (a, b, c) {
  this.mN = b
  this.kN = c
  this.y9 = b * c
  this.maa = this.jVa(a)
  this.hha = this.tVa(a)
}
uY.prototype.jVa = function (a) {
  for (var b = this.mN, c = this.kN, e = new Float32Array(b * c * 4), f = Math.floor(e.length / 8), h = 0; h < f;) {
    var k, m, p
    do
      k = 2 * Math.random() - 1,
        m = 2 * Math.random() - 1,
        p = 2 * Math.random() - 1
    while (1 < k * k + m * m + p * p)
    e[h++] = k
    e[h++] = m
    e[h++] = p
    e[h++] = Math.random()
  }
  for (var r = [-1, 1, 1, 1, -1, 1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, -1, -1, -1, -1, -1], A = 0; f < e.length;)
    for (k = e[A++],
      m = e[A++],
      p = e[A++],
      A++,
      h = 0; h < r.length;)
      e[f++] = k * r[h++],
        e[f++] = m * r[h++],
        e[f++] = p * r[h++],
        e[f++] = Math.random()
  return a.createTexture(b, c, {
    filter: 9728,
    data: e,
    type: 5126,
    Gn: 10497
  })
}

uY.prototype.tVa = function (a) {
  for (var b = new Float32Array(2 * this.y9), c = 0, e = 0; e < this.kN; ++e)
    for (var f = 0; f < this.mN; ++f) {
      var h = f / this.mN
        , k = e / this.kN
      b[c++] = h
      b[c++] = k
    }
  return a.createBuffer(2, 35044, b)
}

var vY = function (a, b, c, e, f) {
  this.doa = c
  this.tfa = this.RV = 0
  this.MX = f
  this.position = new Float32Array(3)
  this.gha = new Float32Array(3)
  this.TE = [new Float32Array(e - c), new Float32Array(e - c)]
  this.y9 = b.y9
  this.maa = b.maa
  c = {
    type: 5126,
    filter: 9728
  }
  this.Tt = a.createFramebuffer(b.mN, b.kN, c, !1)
  this.gV = a.createFramebuffer(b.mN, b.kN, c, !1)
  this.hha = b.hha
  this.sMa(0)
}
vY.prototype.update = function (a, b) {
  this.xBb(b)
  this.sMa(a)
}

vY.prototype.sMa = function (a) {
  var b = this.position
    , c = xY(this.MX + .01, 1.5, 3)
    , e = b[0] - c[0]
    , f = b[1] - c[1]
    , b = b[2] - c[2]
    , e = .01 / (.001 + Math.sqrt(e * e + f * f + b * b))
    , e = .3 * Math.log(1 + 5 * e)
  this.MX += this.tfa * a * e
  a = xY(this.MX, 1.5, 3)
  nY(a, this.position, this.gha)
  this.position = a
}

vY.prototype.xBb = function (a) {
  for (var b = this.TE[0].length, c = 0, e = 0; e < b; ++e)
    var f = a[e + this.doa] - Math.min(this.TE[0][e], this.TE[1][e])
      , f = 4 * f
      , c = Math.max(c, f);
  c = Math.min(1, c)
  this.RV = Math.max(.95 * this.RV, c)
  this.tfa = Math.max(.9 * this.tfa, 3 * this.RV)
  for (e = 0; e < b; ++e)
    this.TE[1][e] = this.TE[0][e],
      this.TE[0][e] = a[e + this.doa]
}

vY.prototype.czb = function () {
  return .05 * this.RV
}

// entrance
const canvas = document.querySelector('canvas')
if (canvas == null) {
  throw 'canvas not found'
}
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const context = canvas.getContext('webgl')
if (context == null) {
  throw 'webgl context not found'
}

const extensions = ['OES_texture_float', 'OES_texture_float_linear']
for (const extension of extensions) {
  if (context.getExtension(extension) == null) {
    console.log('Extension not found' + extension)
  }
}

canvas.addEventListener('click', (e) => {
  console.log('clicked')
  const audioCtx = new AudioContext()
  const audio = new Audio(url)
  const audioElement = document.body.appendChild(audio)
  const analyserNode = audioCtx.createAnalyser()
  const track = audioCtx.createMediaElementSource(audioElement)
  track.connect(analyserNode)
  audioCtx.resume()
  audioElement.play()

  const mxContext = new MX(canvas, context)
  const particle = new wY(analyserNode, context, canvas, mxContext)

  function render (now) {
    particle.update(now)
    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
})
