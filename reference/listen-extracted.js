var u = function (a, b) {
  function c() {
  }

  c.prototype = b.prototype;
  a.Aa = b.prototype; // the base class of a is b
  a.prototype = new c;
  a.prototype.constructor = a;
  a.vNb = function (a, c, h) {
    for (var e = Array(arguments.length - 2), f = 2; f < arguments.length; f++)
      e[f - 2] = arguments[f];
    return b.prototype[c].apply(a, e)
  }
};
var Ja = function () {
  this.nC = this.nC;
  this.Oz = this.Oz
};
Ja.prototyped.nC = !1;
Ja.prototyped.isDisposed = function () {
  return this.nC
}
;
Ja.prototyped.qb = function () {
  this.nC || (this.nC = !0,
    this.Oa())
}
;
Ja.prototyped.Ag = function (a) {
  this.TQa(Ga(Ka, a))
}
;
Ja.prototyped.TQa = function (a, b) {
  this.nC ? l(b) ? a.call(b) : a() : (this.Oz || (this.Oz = []),
    this.Oz.push(l(b) ? q(a, b) : a))
}
;
Ja.prototyped.clear = function () {
  if (this.Oz)
    for (; this.Oz.length;)
      this.Oz.shift()()
}
;
/// BEGIN OF PARTICLE EFFECT
var MX = function (a, b) {
  Ja.call(this);
  // canvas
  this.canvas = a;
  // webgl context
  this.gl = b;
  // current using program
  this.usingProgram = null;
  // buffer list
  this.bufferList = [];
  // framebuffer list
  this.framebufferList = [];
  // shader list
  this.programList = [];
  // texture list
  this.textureList = []
};
u(MX, Ja);
// on delete
MX.prototype.clear = function () {
  for (var a = 0; a < this.bufferList.length; ++a)
    this.gl.deleteBuffer(this.bufferList[a].handle);
  this.bufferList = [];
  for (a = 0; a < this.framebufferList.length; ++a) {
    var b = this.framebufferList[a];
    b.colorTexture && this.gl.deleteTexture(b.colorTexture.handle);
    b.depthTexture && this.gl.deleteTexture(b.depthTexture.handle);
    this.gl.deleteFramebuffer(b.handle)
  }
  this.framebufferList = [];
  for (a = 0; a < this.programList.length; ++a) {
    var b = this.programList[a]
      , c = this.gl.getAttachedShaders(b.handle);
    if (c)
      for (var e = 0; e < c.length; ++e)
        this.gl.detachShader(b.handle, c[e]),
          this.gl.deleteShader(c[e]);
    this.gl.deleteProgram(b.handle)
  }
  this.programList = [];
  for (a = 0; a < this.textureList.length; ++a)
    this.gl.deleteTexture(this.textureList[a].handle);
  this.textureList = []
}
;
MX.prototype.activateProgram = function (program) {
  if (this.usingProgram != program) {
    var b = this.usingProgram ? this.usingProgram.attribCount : 0
      , c = program.attribCount;
    if (b > c)
      for (var e = c; e < b; ++e)
        this.gl.disableVertexAttribArray(e);
    else
      for (e = b; e < c; ++e)
        this.gl.enableVertexAttribArray(e);
    this.gl.useProgram(program.handle);
    this.usingProgram = program
  }
}
;
MX.prototype.bindTexture = function (a, b) {
  var c = this.usingProgram.getSampler(a);
  if (void 0 != c)
    this.gl.activeTexture(33984 + c.textureX),
      this.gl.bindTexture(3553, b.handle);
  else
    throw Error("Texture " + a + " not found");
}
;
/**
 *
 * @param gl webgl context
 * @param width width
 * @param height height
 * @param colorConfig color texture
 * @param depthConfig depth texture
 */
var Framebuffer = function (gl, width, height, colorConfig, depthConfig) {
  this.depthTexture = this.colorTexture = null;
  this.handle = gl.createFramebuffer();
  this.width = width;
  this.height = height;
  gl.bindFramebuffer(36160, this.handle);
  if (colorConfig) {
    this.colorTexture = new Texture(gl, width, height, colorConfig)
    gl.framebufferTexture2D(36160 /* GL_FRAMEBUFFER */,
      36064 /* GL_COLOR_ATTACHMENT0 */,
      3553 /* GL_TEXTURE_2D */,
      this.colorTexture.handle, 0)
  }
  if (depthConfig) {
    this.depthTexture = new Texture(gl, width, height, depthConfig)
    gl.framebufferTexture2D(36160 /* GL_FRAMEBUFFER */,
      36096 /* GL_DEPTH_ATTACHMENT */,
      3553 /* GL_TEXTURE_2D */,
      this.depthTexture.handle, 0)
  }
  gl.bindFramebuffer(36160, null)
};
MX.prototype.createFramebuffer = function (width, height, colorConfig, useDefault) {
  var depthConfig = null;
  if (useDefault) {
    depthConfig = {
      type: 5123,
      wrap: 33071,
      filter: 9728,
      format: 6402,
      data: null
    }
  }
  const framebuffer = new Framebuffer(this.gl, width, height, colorConfig, depthConfig);
  this.framebufferList.push(framebuffer);
  return framebuffer
}
;
MX.prototype.createTexture = function (a, b, c) {
  a = new Texture(this.gl, a, b, c);
  this.textureList.push(a);
  return a
}
;
MX.prototype.bindAttributeBuffer = function (a, b) {
  const location = this.usingProgram.attribMapping[a];
  this.gl.bindBuffer(34962 /* GL_ARRAY_BUFFER */, b.handle);
  this.gl.vertexAttribPointer(location, b.dimension, 5126 /* GL_FLOAT */, !1, 0, 0)
}
;
MX.prototype.drawArrays = function (a, b, c) {
  this.gl.drawArrays(a, b, c)
}
;
/**
 * create buffer
 * @param dimension
 * @param usage
 * @param data
 * @returns {*}
 */
MX.prototype.createBuffer = function (dimension, usage, data) {//a: Dimension b: Usage, c: Buffer data
  const buffer = new Buffer(this.gl, dimension, usage, data);
  this.bufferList.push(buffer);
  return buffer
}
;
MX.prototype.createProgram = function (a) {
  const program = new a(this.gl);
  this.programList.push(program);
  return program
}
;
// handle with buffer
var Buffer = function (gl, dimension, usage, data) { // e: Buffer data.
  this.handle = gl.createBuffer();
  this.dimension = dimension; // Dimension
  this.vertexCount = data.length / dimension; // Vertex num
  this.usage = usage; // usage
  if (0 != data.length % this.dimension)
    throw Error("Number of elements is not a multiple of elementSize");
  if (data.length != this.dimension * this.vertexCount)
    throw Error("Unexpected number of elements");
  gl.bindBuffer(34962, this.handle);
  gl.bufferData(34962, data, this.usage)
}
/**
 * create texture
 * @param gl the {@link WebGLRenderingContext}
 * @param width width
 * @param height height
 * @param config config
 * @constructor
 */
var Texture = function (gl, width, height, config) {
  this.width = width;
  this.height = height;
  this.handle = gl.createTexture();
  this.type = void 0 != config.type ? config.type : gl.UNSIGNED_BYTE;
  this.wrap = void 0 != config.wrap ? config.wrap : gl.REPEAT;
  this.filter = void 0 != config.filter ? config.filter : gl.LINEAR;
  this.format = void 0 != config.format ? config.format : gl.RGBA;
  const data = void 0 != config.data ? config.data : null;
  gl.bindTexture(gl.TEXTURE_2D, this.handle);
  gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.width, this.height, 0, this.format, this.type, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrap)
}
/// Attach shader source to webgl context
var ShaderProgram = function (context, vsSource, fsSource) {
  this.handle = context.createProgram();
  this.attribMapping = {};
  // parameter count
  this.attribCount = 0;
  // uniform name storage
  this.uniformMapping = {};
  // sampler name storage
  this.samplerMapping = {};
  var e = context.createShader(context.VERTEX_SHADER)
    , f = context.createShader(context.FRAGMENT_SHADER);
  context.shaderSource(e, vsSource);
  context.compileShader(e);
  if (!context.getShaderParameter(e, context.COMPILE_STATUS))
    throw vsSource = context.getShaderInfoLog(e),
      context.deleteShader(e),
      context.deleteShader(f),
      Error("Error compiling program:\n" + vsSource);
  context.shaderSource(f, fsSource);
  context.compileShader(f);
  if (!context.getShaderParameter(f, context.COMPILE_STATUS))
    throw vsSource = context.getShaderInfoLog(f),
      context.deleteShader(e),
      context.deleteShader(f),
      Error("Error compiling program:\n" + vsSource);
  context.attachShader(this.handle, e);
  context.attachShader(this.handle, f);
  context.linkProgram(this.handle);
  if (!context.getProgramParameter(this.handle, context.LINK_STATUS))
    throw Error("Error linking program:\n" + context.getProgramInfoLog(this.handle));
};
// getUniform
ShaderProgram.prototype.getUniform = function (a) {
  var b = this.uniformMapping[a];
  if (!b)
    throw Error("No uniform named: " + a);
  return b
}
;
// getSampler
ShaderProgram.prototype.getSampler = function (a) {
  var b = this.samplerMapping[a];
  if (!b)
    throw Error("No sampler named: " + a);
  return b
}
;
// uniform functions
var Uniform = function (gl, type, location) {
  this.type = type;
  this.location = location;
  this.isMatrix = !1;
  switch (type) {
    case 5126:
      this.setter = gl.uniform1f;
      break;
    case 35664:
      this.setter = gl.uniform2fv;
      break;
    case 35665:
      this.setter = gl.uniform3fv;
      break;
    case 35666:
      this.setter = gl.uniform4fv;
      break;
    case 35670:
    case 5124:
      this.setter = gl.uniform1i;
      break;
    case 35671:
    case 35667:
      this.setter = gl.uniform2iv;
      break;
    case 35672:
    case 35668:
      this.setter = gl.uniform3iv;
      break;
    case 35673:
    case 35669:
      this.setter = gl.uniform4iv;
      break;
    case 35674:
      this.setter = gl.uniformMatrix2fv;
      this.isMatrix = !0;
      break;
    case 35675:
      this.setter = gl.uniformMatrix3fv;
      this.isMatrix = !0;
      break;
    case 35676:
      this.setter = gl.uniformMatrix4fv;
      this.isMatrix = !0;
      break;
    case 35678:
    case 35680:
      this.setter = gl.uniform1i;
      break;
    default:
      throw Error("Unrecognized uniform type: " + type);
  }
}
  , Sampler = function (a, b, c, e) {
  Uniform.call(this, a, b, c);
  this.textureX = e
};
u(Sampler, Uniform);
MX.prototype.bindFramebuffer = function (a) {
  a ? (this.gl.bindFramebuffer(36160, a.handle),
    this.gl.viewport(0, 0, a.width, a.height)) : (this.gl.bindFramebuffer(36160, null),
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height))
}
;
MX.prototype.blendColor = function (a, b, c, e) {
  this.gl.blendColor(a, b, c, e)
}
;
MX.prototype.blendEquation = function (a) {
  this.gl.blendEquation(a)
}
;
MX.prototype.blendEquationSeparate = function (a, b) {
  this.gl.blendEquationSeparate(a, b)
}
;
MX.prototype.blendFunc = function (a, b) {
  this.gl.blendFunc(a, b)
}
;
MX.prototype.blendFuncSeparate = function (a, b, c, e) {
  this.gl.blendFuncSeparate(a, b, c, e)
}
;
MX.prototype.clear = function (a) {
  this.gl.clear(a)
}
;
MX.prototype.clearColor = function (a, b, c, e) {
  this.gl.clearColor(a, b, c, e)
}
;
MX.prototype.colorMask = function (a, b, c, e) {
  this.gl.colorMask(a, b, c, e)
}
;
MX.prototype.depthMask = function (a) {
  this.gl.depthMask(a)
}
;
MX.prototype.disable = function (a) {
  this.gl.disable(a)
}
;
MX.prototype.enable = function (a) {
  this.gl.enable(a)
}
;
MX.prototype.viewport = function (a, b, c, e) {
  this.gl.viewport(a, b, c, e)
}
;
MX.prototype.getExtension = function (a) {
  return this.gl.getExtension(a)
}
;
MX.prototype.getSupportedExtensions = function () {
  return this.gl.getSupportedExtensions()
}
;
MX.prototype.setUniform = function (a, b) {
  var c = this.usingProgram.uniformMapping[a];
  if (!c)
    throw Error('No uniform named "' + a + '"');
  var e = this.gl;
  var f;
  f = 2 == arguments.length ? b : Array.prototype.slice.call(arguments, 1);
  c.isMatrix ? c.setter.call(e, c.location, !1, f) : c.setter.call(e, c.location, f)
}
;
var WX = function () {
  EU.call(this);
  this.queue = []
};
u(WX, EU);
WX.prototype.add = function (a) {
  Sb(this.queue, a) || (this.queue.push(a),
    v(a, "finish", this.J9, !1, this))
}
;
WX.prototype.remove = function (a) {
  Zb(this.queue, a) && zd(a, "finish", this.J9, !1, this)
}
;
WX.prototype.Oa = function () {
  Jb(this.queue, function (a) {
    a.qb()
  });
  this.queue.length = 0;
  WX.Aa.clear.call(this)
}
;
var XX = function () {
  WX.call(this);
  this.N1 = 0
};
u(XX, WX);
XX.prototype.play = function (a) {
  if (0 == this.queue.length)
    return !1;
  if (a || this.Uq())
    this.N1 = 0,
      this.Aw();
  else if (this.hf())
    return !1;
  this.CU();
  this.kw() && this.R9();
  var b = this.kw() && !a;
  this.startTime = t();
  this.endTime = null;
  this.dX();
  Jb(this.queue, function (c) {
    b && !c.kw() || c.play(a)
  });
  return !0
}
;
XX.prototype.pause = function () {
  this.hf() && (Jb(this.queue, function (a) {
    a.hf() && a.pause()
  }),
    this.oea(),
    this.O9())
}
;
XX.prototype.stop = function (a) {
  Jb(this.queue, function (b) {
    b.Uq() || b.stop(a)
  });
  this.QA();
  this.endTime = t();
  this.onStop();
  this.fp()
}
;
XX.prototype.J9 = function () {
  this.N1++;
  this.N1 == this.queue.length && (this.endTime = t(),
    this.QA(),
    this.zU(),
    this.fp())
}
;
var YX = function () {
  WX.call(this);
  this.Ni = 0
};
u(YX, WX);
YX.prototype.play = function (a) {
  if (0 == this.queue.length)
    return !1;
  if (a || this.Uq())
    this.Ni < this.queue.length && !this.queue[this.Ni].Uq() && this.queue[this.Ni].stop(!1),
      this.Ni = 0,
      this.Aw();
  else if (this.hf())
    return !1;
  this.CU();
  this.kw() && this.R9();
  this.startTime = t();
  this.endTime = null;
  this.dX();
  this.queue[this.Ni].play(a);
  return !0
}
;
YX.prototype.pause = function () {
  this.hf() && (this.queue[this.Ni].pause(),
    this.oea(),
    this.O9())
}
;
YX.prototype.stop = function (a) {
  this.QA();
  this.endTime = t();
  if (a)
    for (a = this.Ni; a < this.queue.length; ++a) {
      var b = this.queue[a];
      b.Uq() && b.play();
      b.Uq() || b.stop(!0)
    }
  else
    this.Ni < this.queue.length && this.queue[this.Ni].stop(!1);
  this.onStop();
  this.fp()
}
;
YX.prototype.J9 = function () {
  this.hf() && (this.Ni++,
    this.Ni < this.queue.length ? this.queue[this.Ni].play() : (this.endTime = t(),
      this.QA(),
      this.zU(),
      this.fp()))
}
;
var ZX = function (a, b) {
  Q.call(this);
  this.Ve = a;
  this.yya = b
};
u(ZX, Q);
d = ZX.prototype;
d.getName = function () {
  return this.Ve
}
;
d.kZ = function () {
}
;
d.start = function () {
}
;
d.stop = function () {
}
;
d.c8 = function () {
  return !1
}
;
var $X = function (a, b, c, e, f) {
  HU.apply(this, arguments)
};
u($X, HU);
$X.prototype.qB = function () {
  var a = this.sB && this.Ft() ? "right" : "left";
  this.element.style[a] = this.coords[0] + "px";
  this.element.style.top = this.coords[1] + "px";
  this.element.style.width = this.coords[2] + "px";
  this.element.style.height = this.coords[3] + "px"
}
;
var bY = function (a, b) {
  ZX.call(this, "Album art", "Album art");
  this.ta = a;
  this.Da = b;
  this.MK = this.lw = !1;
  this.wb = 0;
  this.Qz = this.kf = this.oj = null;
  this.Hm = new aY;
  this.pr = new aY;
  this.Gg = new Kl(-1, -1);
  this.$j = -1;
  this.Th = new Hl(-1, -1);
  this.Tk = new Hl(-1, -1);
  this.Lr = new Hl(-1, -1);
  this.Cw = this.mDa = -1;
  this.GE = new Hl(-1, -1);
  this.rA = this.xba = -1;
  this.bW = new Hl(-1, -1);
  this.Tw = new Hl(-1, -1);
  this.ra = new Lo(this)
};
u(bY, ZX);
var aY = function () {
  this.FZ = this.fl = this.he = null
};
d = bY.prototype;
bY.prototype.Ntb = function (a, b) {
  var c = dm("DIV", "panning-background")
    , e = dm("DIV", "panning-overlay")
    , f = dm("IMG", "panning-img");
  f.src = tr(b.Qc() || "", 160) || sr();
  c.appendChild(f);
  a.appendChild(c);
  a.appendChild(e)
}
;
bY.prototype.kZ = function (a) {
  this.HZ(q(this.Ntb, this, a))
}
;
bY.prototype.start = function (a) {
  this.lw || (this.lw = !0,
    this.kf = a,
    this.Gg.width = this.kf.offsetWidth,
    this.Gg.height = this.kf.offsetHeight,
    this.Qz = dm("DIV", "panning"),
    this.Qz.style.width = this.Gg.width + "px",
    this.Qz.style.height = this.Gg.height + "px",
    this.kf.appendChild(this.Qz),
    this.Yya(this.Hm),
    this.Yya(this.pr),
    a = dm("DIV", "overlay"),
    a.style.width = this.Gg.width + "px",
    a.style.height = this.Gg.height + "px",
    this.Qz.appendChild(a),
    this.$j = Math.min(this.Gg.width, this.Gg.height),
    this.Th.x = Math.floor((this.Gg.width - this.$j) / 2),
    this.Th.y = Math.floor((this.Gg.height - this.$j) / 2),
    this.Cw = Math.max(this.Gg.width, this.Gg.height),
    this.GE.x = Math.floor((this.Gg.width - this.Cw) / 2),
    this.GE.y = Math.floor((this.Gg.height - this.Cw) / 2),
    this.mDa = Math.floor(1.2 * this.Cw),
    this.ra.listen(this.ta, "h", this.y$),
    this.MK = !0,
    this.E1())
}
;
bY.prototype.stop = function () {
  this.lw && (this.lw = !1,
    this.ra.removeAll(),
    hm(this.Qz),
    this.pea(0))
}
;
bY.prototype.c8 = function () {
  return !0
}
;
bY.prototype.Yya = function (a) {
  a.he = null;
  a.fl = dm("DIV", "art-container");
  this.Qz.appendChild(a.fl);
  a.FZ = dm("IMG", "art-image");
  a.fl.appendChild(a.FZ)
}
;
bY.prototype.y$ = function () {
  if (this.lw)
    switch (this.ta.ub) {
      case 4:
        this.oj && this.oj.pause();
        break;
      case 3:
        this.oj && this.oj.play(),
          this.MK = !0,
        2 == this.wb && this.E1()
    }
}
;
bY.prototype.pea = function (a) {
  this.wb = this.lw ? a : 0;
  this.oj && this.oj.qb();
  return this.lw
}
;
bY.prototype.HZ = function (a) {
  var b = this.Da.Ts();
  b ? a(b) : Oo(q(this.HZ, this, a), 500)
}
;
bY.prototype.ZXa = function (a) {
  this.MK = !1;
  a != this.Hm.he && (this.kib(),
    this.tyb(a))
}
;
bY.prototype.E1 = function () {
  this.lw && this.MK && this.HZ(q(this.ZXa, this))
}
;
bY.prototype.kib = function () {
  switch (Math.floor(4 * Math.random())) {
    case 0:
      this.Tk.x = this.Th.x;
      this.Tk.y = -this.$j;
      this.Lr.x = this.Th.x;
      this.Lr.y = this.Gg.height;
      break;
    case 1:
      this.Tk.x = this.Th.x;
      this.Tk.y = this.Gg.height;
      this.Lr.x = this.Th.x;
      this.Lr.y = -this.$j;
      break;
    case 2:
      this.Tk.x = this.Gg.width;
      this.Tk.y = this.Th.y;
      this.Lr.x = -this.$j;
      this.Lr.y = this.Th.y;
      break;
    default:
      this.Tk.x = -this.$j,
        this.Tk.y = this.Th.y,
        this.Lr.x = this.Gg.width,
        this.Lr.y = this.Th.y
  }
}
;
bY.prototype.tyb = function (a) {
  if (this.pea(1)) {
    var b = this.pr;
    this.pr = this.Hm;
    this.Hm = b;
    this.Hm.he = a;
    a = tr(this.Hm.he.Qc() || "", 1280) || sr();
    this.Hm.FZ.src = a;
    this.oj = new YX;
    this.pr.he && this.oj.add(this.Sxb());
    this.ifa = new XX;
    this.pr.he && this.ifa.add(this.oyb());
    this.ifa.add(this.nyb());
    this.oj.add(this.ifa);
    this.oj.add(this.GXa());
    this.rA = this.Cw;
    this.Tw.x = this.GE.x;
    this.Tw.y = this.GE.y;
    v(this.oj, "end", q(this.lDa, this));
    this.oj.play()
  }
}
;
bY.prototype.Sxb = function () {
  var a = new XX, b;
  b = this.pr.fl;
  b = new Hl(b.offsetLeft, b.offsetTop);
  var c = xp(this.pr.fl);
  a.add(new $X(this.pr.fl, [b.x, b.y, c.width, c.height], [this.Th.x, this.Th.y, this.$j, this.$j], 2E3, Wia));
  a.add(new IU(this.Hm.fl, [this.Tk.x, this.Tk.y], [this.Tk.x, this.Tk.y], 2E3));
  return a
}
;
bY.prototype.oyb = function () {
  var a = new XX;
  a.add(new IU(this.pr.fl, [this.Th.x, this.Th.y], [this.Lr.x, this.Lr.y], 2E3));
  a.add(new KU(this.pr.fl, 1, .3, 2E3));
  return a
}
;
bY.prototype.nyb = function () {
  var a = new XX;
  a.add(new $X(this.Hm.fl, [this.Tk.x, this.Tk.y, this.$j, this.$j], [this.Th.x, this.Th.y, this.$j, this.$j], 2E3));
  a.add(new KU(this.Hm.fl, .3, 1, 2E3));
  return a
}
;
bY.prototype.GXa = function () {
  var a = new XX;
  a.add(new $X(this.Hm.fl, [this.Th.x, this.Th.y, this.$j, this.$j], [this.GE.x, this.GE.y, this.Cw, this.Cw], 2E3, LU));
  return a
}
;
bY.prototype.lDa = function () {
  if (this.pea(2))
    if (this.MK)
      this.E1();
    else {
      this.xba = this.rA;
      this.bW.x = this.Tw.x;
      this.bW.y = this.Tw.y;
      this.rA = Math.floor(pl(this.Cw, this.mDa + 1));
      this.Tw.x = Math.floor(pl(this.Gg.width - this.rA, 1));
      this.Tw.y = Math.floor(pl(this.Gg.height - this.rA, 1));
      var a = Math.floor(pl(3E4, 45001));
      this.oj = new XX;
      this.oj.add(new $X(this.Hm.fl, [this.bW.x, this.bW.y, this.xba, this.xba], [this.Tw.x, this.Tw.y, this.rA, this.rA], a, Xia));
      v(this.oj, "end", q(this.lDa, this));
      this.oj.play()
    }
}
;
/**
 * cY
 * @param gl the {@link WebGLRenderingContext}
 */
var cY = function (gl) {
  // create program and set to this.handler
  ShaderProgram.call(this, gl, "precision mediump float;varying vec2 a;attribute vec2 b;uniform vec4 c;void main(){a=b;vec2 d=b*c.xy+c.zw;gl_Position=vec4(d*2.-vec2(1),1,1);}", "precision mediump float;varying vec2 a;uniform sampler2D d;void main(){vec4 e=texture2D(d,a);gl_FragColor=e;}");
  // only has one attribute
  this.attribCount = 0;
  gl.bindAttribLocation(this.handle, this.attribCount, "b");
  this.attribMapping.uv = this.attribCount++;
  gl.useProgram(this.handle);
  // traverse all uniform GL_ACTIVE_UNIFORMS
  for (var b = gl.getProgramParameter(this.handle, 35718), c = 0, e = 0; e < b; ++e) {
    var f = gl.getActiveUniform(this.handle, e);
    if (f) {
      var name = dka[f.name];
      if (name) {
        var location = gl.getUniformLocation(this.handle, f.name)
        var type = f.type;
        // if type == SAMPLER_2D or SAMPLER_CUBE
        if (35678 == type || 35680 == type) {
          var qx = new Sampler(gl, type, location, c++);
          gl.uniform1i(location, qx.textureX);
          this.samplerMapping[name] = qx;
        } else {
          this.uniformMapping[name] = new Uniform(gl, type, location);
        }
        // 35678 == f || 35680 == f ? (f = new QX(a,f,k,c++),
        // a.uniform1i(k, f.Fu),
        // this.gu[h] = f) : this.Vr[h] = new PX(a,f,k)
      }
    }
  }
};
u(cY, ShaderProgram);
var dka = {
  c: "scaleOffset",
  d: "tex"
};
var dY = function (a) {
  ShaderProgram.call(this, a, "precision mediump float;varying vec2 a;attribute vec2 b;void main(){a=b;gl_Position=vec4(b*2.-vec2(1),1,1);}", "precision mediump float;varying vec2 a;uniform sampler2D c;uniform vec2 d,e;void main(){vec4 f,g,h,i,j,k,l,m,n,o,p,q,r,s,t;f=texture2D(c,a);g=texture2D(c,a-d);h=texture2D(c,a+d);i=texture2D(c,a-2.*d);j=texture2D(c,a+2.*d);k=texture2D(c,a-3.*d);l=texture2D(c,a+3.*d);m=vec4(0);n=vec4(1);o=.8521*max(m,n-.7*abs(g-f));p=.8521*max(m,n-.7*abs(h-f));q=.5273*max(m,n-2.*abs(i-f));r=.5273*max(m,n-2.*abs(j-f));s=.2369*max(m,n-2.*abs(k-f));t=.2369*max(m,n-2.*abs(l-f));f+=o*g+p*h+q*i+r*j+s*k+t*l;gl_FragColor=f/(o+p+q+r+s+t+1.);gl_FragColor.a=e.x*gl_FragColor.a+e.y;}");
  this.attribCount = 0;
  a.bindAttribLocation(this.handle, this.attribCount, "b");
  this.attribMapping.uv = this.attribCount++;
  a.useProgram(this.handle);
  for (var b = a.getProgramParameter(this.handle, 35718), c = 0, e = 0; e < b; ++e) {
    var f = a.getActiveUniform(this.handle, e);
    if (f) {
      var h = eka[f.name];
      if (h) {
        var k = a.getUniformLocation(this.handle, f.name)
          , f = f.type;
        35678 == f || 35680 == f ? (f = new Sampler(a, f, k, c++),
          a.uniform1i(k, f.textureX),
          this.samplerMapping[h] = f) : this.uniformMapping[h] = new Uniform(a, f, k)
      }
    }
  }
};
u(dY, ShaderProgram);
var eka = {
  c: "mainTex",
  d: "duv",
  e: "alphaScaleOffset"
};
var eY = function (a) {
  ShaderProgram.call(this, a, "precision mediump float;varying vec2 a;attribute vec2 b;void main(){a=b;gl_Position=vec4(b*2.-vec2(1),1,1);}", "precision mediump float;varying vec2 a;uniform sampler2D c;uniform vec3 d,e;void main(){vec4 f,i;f=texture2D(c,a);float g,h;g=.5*(f.x+f.y);h=.5*(f.z+f.w);i=vec4(d*g+e*h,g+h);gl_FragColor=2.*sqrt(i);gl_FragColor.xyz=vec3(1)-gl_FragColor.xyz;}");
  this.attribCount = 0;
  a.bindAttribLocation(this.handle, this.attribCount, "b");
  this.attribMapping.uv = this.attribCount++;
  a.useProgram(this.handle);
  for (var b = a.getProgramParameter(this.handle, 35718), c = 0, e = 0; e < b; ++e) {
    var f = a.getActiveUniform(this.handle, e);
    if (f) {
      var h = fka[f.name];
      if (h) {
        var k = a.getUniformLocation(this.handle, f.name)
          , f = f.type;
        35678 == f || 35680 == f ? (f = new Sampler(a, f, k, c++),
          a.uniform1i(k, f.textureX),
          this.samplerMapping[h] = f) : this.uniformMapping[h] = new Uniform(a, f, k)
      }
    }
  }
};
u(eY, ShaderProgram);
var fka = {
  c: "tex",
  d: "color0",
  e: "color1"
};
var fY = function (a) {
  ShaderProgram.call(this, a, "precision mediump float;varying vec2 a;attribute vec2 b;void main(){a=b;gl_Position=vec4(b*2.-vec2(1),1,1);}", "precision mediump float;varying vec2 a;void main(){gl_FragColor=vec4(0,-10000,0,0);}");
  this.attribCount = 0;
  a.bindAttribLocation(this.handle, this.attribCount, "b");
  this.attribMapping.uv = this.attribCount++;
  a.useProgram(this.handle);
  for (var b = a.getProgramParameter(this.handle, 35718), c = 0, e = 0; e < b; ++e) {
    var f = a.getActiveUniform(this.handle, e);
    if (f) {
      var h = gka[f.name];
      if (h) {
        var k = a.getUniformLocation(this.handle, f.name)
          , f = f.type;
        35678 == f || 35680 == f ? (f = new Sampler(a, f, k, c++),
          a.uniform1i(k, f.textureX),
          this.samplerMapping[h] = f) : this.uniformMapping[h] = new Uniform(a, f, k)
      }
    }
  }
};
3
u(fY, ShaderProgram);
var gka = {};
var gY = function (a) {
  ShaderProgram.call(this, a, "precision mediump float;varying vec2 a;attribute vec2 b;void main(){a=b;gl_Position=vec4(b*2.-vec2(1),1,1);}", "precision mediump float;varying vec2 a;uniform sampler2D c,d;uniform vec4 e;void main(){vec2 f=a*2.-vec2(1);float g,h;g=smoothstep(.2,5.,dot(f,f));h=texture2D(c,a*e.xy+e.zw).w;vec3 i=texture2D(d,a).xyz;i*=1.-g;gl_FragColor.xyz=abs(i-.05*h);gl_FragColor.w=1.;}");
  this.attribCount = 0;
  a.bindAttribLocation(this.handle, this.attribCount, "b");
  this.attribMapping.uv = this.attribCount++;
  a.useProgram(this.handle);
  for (var b = a.getProgramParameter(this.handle, 35718), c = 0, e = 0; e < b; ++e) {
    var f = a.getActiveUniform(this.handle, e);
    if (f) {
      var h = hka[f.name];
      if (h) {
        var k = a.getUniformLocation(this.handle, f.name)
          , f = f.type;
        35678 == f || 35680 == f ? (f = new Sampler(a, f, k, c++),
          a.uniform1i(k, f.textureX),
          this.samplerMapping[h] = f) : this.uniformMapping[h] = new Uniform(a, f, k)
      }
    }
  }
};
u(gY, ShaderProgram);
var hka = {
  c: "grainTex",
  d: "mainTex",
  e: "grainScaleOffset"
};
var hY = function (a) {
  ShaderProgram.call(this, a, "precision mediump float;attribute vec2 a;uniform sampler2D b;uniform mat4 c;void main(){vec4 d=texture2D(b,a);gl_Position=c*vec4(d.xyz,1);gl_PointSize=1.+min(1./gl_Position.w,64.);}", "precision mediump float;uniform float d;void main(){vec2 a=2.*(gl_PointCoord-vec2(.5));float e=1.-smoothstep(0.,1.,dot(a,a));gl_FragColor=vec4(d*e);}");
  this.attribCount = 0;
  a.bindAttribLocation(this.handle, this.attribCount, "a");
  this.attribMapping.uv = this.attribCount++;
  a.useProgram(this.handle);
  for (var b = a.getProgramParameter(this.handle, 35718), c = 0, e = 0; e < b; ++e) {
    var f = a.getActiveUniform(this.handle, e);
    if (f) {
      var h = ika[f.name];
      if (h) {
        var k = a.getUniformLocation(this.handle, f.name)
          , f = f.type;
        35678 == f || 35680 == f ? (f = new Sampler(a, f, k, c++),
          a.uniform1i(k, f.textureX),
          this.samplerMapping[h] = f) : this.uniformMapping[h] = new Uniform(a, f, k)
      }
    }
  }
};
u(hY, ShaderProgram);
var ika = {
  b: "positionTex",
  c: "worldViewProj",
  d: "density"
};
var iY = function (a) {
  ShaderProgram.call(this, a, "precision mediump float;varying vec2 a;attribute vec2 b;uniform float c;void main(){a=b*vec2(1,c);gl_Position=vec4(a*2.-vec2(1),1,1);}", "precision mediump float;varying vec2 a;uniform sampler2D d,e,f;uniform vec2 g,h;uniform vec3 i,j,k,l,m,n;const float o=32.;const float p=.5/(o*(o-1.));const float q=o/(o-1.);const float r=(o-1.)/(o*o);const float s=o;const float t=1./o;vec3 F(vec3 u){float v=p+floor(u.z)*t;return texture2D(f,vec2(u.x,v+fract(u.y*q)*r)).xyz;}vec3 G(vec3 u){u.z*=o;vec3 v,w,x,A,B,C,D,E;v=u*.03-g.x*vec3(.03,.05,.07);w=F(v);x=F(v+vec3(0,0,1));A=2.*mix(w,x,fract(v.z))-vec3(1);B=u*.15+g.x*vec3(.01,.02,.03);C=F(B);D=F(B+vec3(0,0,1));E=2.*mix(C,D,fract(B.z))-vec3(1);return 8.*A+5.*E+m;}vec3 H(vec4 u,vec3 v,vec3 w){vec3 x,B;x=u.xyz-v;float A=dot(x,x);B=x/(1.+A*A);B*=1.5*max(0.,dot(x,w));return B;}vec3 I(vec4 u,vec3 v,float w){vec3 x,A;x=u.xyz-v;A=(1.-smoothstep(0.,.5,u.w))*normalize(x);return A*w;}void main(){vec4 u,w;u=texture2D(d,a);float v,B,C,D;v=texture2D(e,a+h).w;w=texture2D(e,a);vec3 x,A,E;x=i-w.w*j;A=k-w.w*l;B=n.x;C=n.y;D=n.z;if(v<C)u=vec4(x+B*w.xyz,0);u.xyz+=H(u,x,j)+H(u,A,l)+I(u,x,D);E=G(u.xyz);u.xyz+=g.y*30.*.002*E;u.w+=g.y;if(u.w>2.+4.*w.w)u.y=-1e4;gl_FragColor=u;}");
  this.attribCount = 0;
  a.bindAttribLocation(this.handle, this.attribCount, "b");
  this.attribMapping.uv = this.attribCount++;
  a.useProgram(this.handle);
  for (var b = a.getProgramParameter(this.handle, 35718), c = 0, e = 0; e < b; ++e) {
    var f = a.getActiveUniform(this.handle, e);
    if (f) {
      var h = jka[f.name];
      if (h) {
        var k = a.getUniformLocation(this.handle, f.name)
          , f = f.type;
        35678 == f || 35680 == f ? (f = new Sampler(a, f, k, c++),
          a.uniform1i(k, f.textureX),
          this.samplerMapping[h] = f) : this.uniformMapping[h] = new Uniform(a, f, k)
      }
    }
  }
};
u(iY, ShaderProgram);
var jka = {
  c: "quality",
  d: "positionTex",
  e: "randomTex",
  f: "noiseTex",
  g: "time",
  h: "randomTexOffset",
  i: "pos0",
  j: "vel0",
  k: "pos1",
  l: "vel1",
  m: "drift",
  n: "emitterSize"
};
var jY = function (a) {
  this.length = a.length || a;
  for (var b = 0; b < this.length; b++)
    this[b] = a[b] || 0
};
jY.prototype.BYTES_PER_ELEMENT = 4;
jY.prototype.set = function (a, b) {
  b = b || 0;
  for (var c = 0; c < a.length && b + c < this.length; c++)
    this[b + c] = a[c]
}
;
jY.prototype.toString = Array.prototype.join;
"undefined" == typeof Float32Array && (jY.BYTES_PER_ELEMENT = 4,
  jY.prototype.BYTES_PER_ELEMENT = jY.prototype.BYTES_PER_ELEMENT,
  jY.prototype.set = jY.prototype.set,
  jY.prototype.toString = jY.prototype.toString,
  ta("Float32Array", jY, void 0));
var kY = function (a) {
  this.length = a.length || a;
  for (var b = 0; b < this.length; b++)
    this[b] = a[b] || 0
};
kY.prototype.BYTES_PER_ELEMENT = 8;
kY.prototype.set = function (a, b) {
  b = b || 0;
  for (var c = 0; c < a.length && b + c < this.length; c++)
    this[b + c] = a[c]
}
;
kY.prototype.toString = Array.prototype.join;
if ("undefined" == typeof Float64Array) {
  try {
    kY.BYTES_PER_ELEMENT = 8
  } catch (a) {
  }
  kY.prototype.BYTES_PER_ELEMENT = kY.prototype.BYTES_PER_ELEMENT;
  kY.prototype.set = kY.prototype.set;
  kY.prototype.toString = kY.prototype.toString;
  ta("Float64Array", kY, void 0)
}
;var createVec3 = function (a, b, c) {
  var e = new Float32Array(3);
  e[0] = a;
  e[1] = b;
  e[2] = c;
  return e
}
  , vec3Add = function (a, b, c) {
    c[0] = a[0] + b[0];
    c[1] = a[1] + b[1];
    c[2] = a[2] + b[2];
    return c
  }
  , vec3Sub = function (a, b, c) {
    c[0] = a[0] - b[0];
    c[1] = a[1] - b[1];
    c[2] = a[2] - b[2];
    return c
  }
  , vec3Mul = function (a, b, c) {
    c[0] = a[0] * b;
    c[1] = a[1] * b;
    c[2] = a[2] * b;
    return c
  }
  , normalizeVector = function (a, b) {
    var c = a[0]
      , e = a[1]
      , f = a[2]
      , c = 1 / Math.sqrt(c * c + e * e + f * f);
    b[0] = a[0] * c;
    b[1] = a[1] * c;
    b[2] = a[2] * c;
    return b
  }
  , crossProduct = function (a, b, c) {
    c[0] = a[1] * b[2] - a[2] * b[1];
    c[1] = a[2] * b[0] - a[0] * b[2];
    c[2] = a[0] * b[1] - a[1] * b[0];
    return c
  };
var setMatrix4Column = function (a, b, c) {
  a[b] = c[0];
  a[b + 4] = c[1];
  a[b + 8] = c[2];
  a[b + 12] = c[3];
  return a
}
  , sY = [new Float64Array(4), new Float64Array(4), new Float64Array(4)];
/// Get audio information
var AudioInfo = function (length) {
  this.raw = new Float32Array(length);
  this.bL = new Float32Array(length);
  this.S$ = new Float32Array(length)
};
AudioInfo.prototype.applyGaussianBlur = function (a, b, c) {
  for (var e = Math.min(a.length, b.length), f = 0; f < e; ++f) {
    for (var h = 0, k = 0, m = -c; m <= c; ++m) {
      var p = f + m;
      if (!(0 > p || p >= a.length))
        var r = m / c
          , r = Math.exp(-4 * r * r)
          , h = h + r
          , k = k + r * a[p]
    }
    b[f] = k / h
  }
}
;
AudioInfo.prototype.updateAudioData = function (a) {
  for (var b = 0; b < this.S$.length; ++b)
    this.S$[b] = this.raw[b];
  a.getFloatFrequencyData(this.raw);
  for (b = 0; b < this.raw.length; ++b) {
    a = this.S$[b];
    var c = Math.max(0, 20 * Math.pow(10, .05 * this.raw[b]));
    this.raw[b] = c + (c > a ? .1 : .8) * (a - c)
  }
  this.applyGaussianBlur(this.raw, this.bL, 8);
  for (b = 0; b < this.bL.length; ++b)
    this.bL[b] = Math.max(0, 2 * this.raw[b] - this.bL[b])
}
;
/*
Entrance:

d.start = function(a, b) {
    this.Hz != b && null != this.k2(b) && this.Yjb(a, b)
}
;
d.Yjb = function(a, b) {
    this.Hz = b;
    this.lT = !1;
    this.kf = a;
    var c = dm("CANVAS")
      , e = Math.max(a.offsetHeight, 16);
    c.width = Math.max(a.offsetWidth, 16);
    c.height = e;
    (e = this.Wwa(c)) ? (this.XT = c,
    b = this.k2(b),
    null != b ? (this.LL = new MX(c,e),
    a.appendChild(this.XT),
    this.YFa = new this.Qu.wP(b,e,c,this.LL),
    this.Jx = new zU(this.Yfa,null,this),
    this.Jx.start()) : this.stop()) : this.stop()
}
;

 */
/**
 * Particles visualizer constructor
 *
 * @param analyserNode AnalyserNode {@link AnalyserNode}
 * @param gl origin {@link WebGLRenderingContext}
 * @param canvas canvas {@link HTMLCanvasElement}
 * @param glContext modified {@link WebGLRenderingContext}
 * @constructor
 */
var Particles = function (analyserNode, gl, canvas, glContext) {
  /**
   * {@link AnalyserNode}
   */
  this.analyserNode = analyserNode;
  // Canvas
  this.canvas = canvas;
  // Modified webgl context MX
  this.glContext = glContext;
  // Audio input.
  this.audioInfo = new AudioInfo(256);
  const random100 = 100 * Math.random();
  let scale = 1;
  if (320 < this.canvas.width || 320 < this.canvas.height)
    scale = 2;
  // scaled width
  this.width = Math.floor(this.canvas.width / scale);
  // scaled height
  this.height = Math.floor(this.canvas.height / scale);
  // ratio
  this.ratio = this.width / this.height;
  this.particleUpdateProgram = this.glContext.createProgram(dY);
  this.glContext.createProgram(cY);
  this.colorBlendProgram = this.glContext.createProgram(eY);
  this.renderParticleSystemProgram = this.glContext.createProgram(fY);
  this.finalRenderProgram = this.glContext.createProgram(gY);
  this.alphaMaskProgram = this.glContext.createProgram(hY);
  this.particleSimulationProgram = this.glContext.createProgram(iY);
  this.noiseTexture = this.createNoiseTexture(32); // noiseTex
  const random = new Uint8Array(16384);
  for (let i = 0; i < random.length; ++i)
    random[i] = Math.floor(255 * Math.random());
  this.grainTex = this.glContext.createTexture(128, 128, {
    filter: 9728, // NEAREST
    data: random,
    type: 5121, // UNSIGNED_BYTE
    format: 6406, // ALPHA
    wrap: 10497 // REPEAT
  });
  const colorConfig = {
    filter: 9729, // LINEAR
    wrap: 33071 // CLAMP_TO_EDGE
  };
  this.particleRenderFramebuffer = this.glContext.createFramebuffer(this.width, this.height, colorConfig, !1);
  this.colorBlendFramebuffer = this.glContext.createFramebuffer(this.width, this.height, colorConfig, !1);
  this.alphaBlendFramebuffer = this.glContext.createFramebuffer(this.width, this.height, colorConfig, !1);
  this.buffer = this.glContext.createBuffer(2, 35044 /*GL_STATIC_DRAW*/, new Float32Array([0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0]));// Create Buffer
  this.time = 60 * Math.random();
  this.previousTime = null;
  this.particleSystemCenterPosition = new Float32Array(3);
  this.cameraPosition = createVec3(0, 0, 0);
  this.timeSamples = new Float32Array(80);
  this.timeSamplesCount = 0;
  this.particleScaleFactor = .5;
  this.isParticleScaleDecreasing = !1;
  this.scaleIncreaseCount = this.scaleDecreaseCount = 0;
  const someTexture = new ParticleTexture(this.glContext, 512, 1024);
  this.particleSystems = [new ParticleSystem(this.glContext, someTexture, 0, 20, random100), new ParticleSystem(this.glContext, someTexture, 20, 200, random100 + 50 + 50 * Math.random())];
  this.glContext.colorMask(!0, !0, !0, !0);
  this.glContext.depthMask(!1);
  this.glContext.disable(2929); // DEPTH_TEST
  this.glContext.disable(2884); // CULL_FACE
  this.glContext.disable(3042); // BLEND
  this.glContext.activateProgram(this.renderParticleSystemProgram);
  this.glContext.bindAttributeBuffer("uv", this.buffer);
  for (i = 0; i < this.particleSystems.length; ++i)
    this.glContext.bindFramebuffer(this.particleSystems[i].Tt),
      this.glContext.drawArrays(4, 0, this.buffer.vertexCount),
      this.glContext.bindFramebuffer(this.particleSystems[i].gV),
      this.glContext.drawArrays(4, 0, this.buffer.vertexCount);
  this.updateCenterPoint()
};
u(Particles, Updatable); // inherit from UX. UX.prototype.update = function() {};
var kka = {
  wP: Particles,
  displayName: "Particles",
  identifier: "Particles",
  eNa: {
    iba: ["OES_texture_float", "OES_texture_float_linear"], // getExtension
    cla: { // getContext
      antialias: false,
      depth: false,
      stencil: false
    }
  }
};
// Create noise texture
Particles.prototype.createNoiseTex = function (a) {
  for (var b = new Uint8Array(a * a * a * 4), c = new Float32Array(a * a * a * 4), e = new Float32Array(a * a * a * 4), f = 0; f < b.length; f += 4)
    c[f + 0] = Math.random() - .5,
      c[f + 1] = Math.random() - .5,
      c[f + 2] = Math.random() - .5,
      c[f + 3] = 2 * Math.random() - 1;
  for (var h = 0; h < a; ++h)
    for (var k = 0; k < a - 1; ++k)
      for (f = 0; f < a; ++f) {
        var m = f + k * a + h * a * a, m = 4 * m, p;
        p = k;
        var r = h
          , A = (f + a - 1) % a
          , E = (f + 1) % a
          , G = (p + a - 2) % (a - 1)
          , J = (p + 1) % (a - 1)
          , N = (r + a - 1) % a
          , R = (r + 1) % a;
        p *= a;
        r *= a * a;
        J *= a;
        G *= a;
        R *= a * a;
        N *= a * a;
        p = [c[f + J + r + 2] - c[f + G + r + 2] - c[f + p + R + 1] + c[f + p + N + 1], c[f + p + R + 0] - c[f + p + N + 0] - c[E + p + r + 2] + c[A + p + r + 2], c[E + p + r + 1] - c[A + p + r + 1] - c[f + J + r + 0] + c[f + G + r + 0], 0];
        e[m++] = p[0];
        e[m++] = p[1];
        e[m++] = p[2];
        e[m++] = p[3]
      }
  for (f = 0; f < b.length; ++f)
    b[f] = Math.floor(Math.min(Math.max(127.5 * (e[f] + 1), 0), 255));
  c = 4 * a;
  e = a * c;
  for (h = 0; h < a; ++h)
    for (k = h * e + (a - 1) * c,
           m = h * e,
           f = 0; f < 4 * a; ++f)
      b[k + f] = b[m + f];
  return this.glContext.createTexture(a, a * a, {
    data: b
  })
}
;
var getTargetPosition = function (a, b, c) {
  var e = 2 * (Math.cos(.51 * a) + Math.sin(.29 * a))
    , f = 3 * Math.cos(a + Math.sin(.47 * a)) - 2 * Math.sin(.79 * a);
  a = .5 + .5 * (Math.sin(a + Math.cos(.31 * a)) * Math.cos(3.7 * a) - Math.sin(2.1 * a));
  a = b + a * (c - b);
  return createVec3(a * Math.cos(f) * Math.cos(e), a * Math.sin(e), a * Math.sin(f) * Math.cos(e))
};
// d = wY.prototype;
Particles.prototype.colorFromHue = function (a, b) {
  a %= 6;
  a = createVec3(Math.max(0, Math.min(1, Math.abs(a - 3) - 1)), Math.max(0, Math.min(1, 2 - Math.abs(a - 2))), Math.max(0, Math.min(1, 2 - Math.abs(a - 4))));
  a[0] = 1 - b + b * a[0];
  a[1] = 1 - b + b * a[1];
  a[2] = 1 - b + b * a[2];
  return a
}
;
Particles.prototype.update = function (a) {
  var b = 2 / 60;
  this.previousTime && (b = (a - this.previousTime) / 1E3,
    b = Math.min(.2, b));
  this.previousTime = a;
  a = this.updateTimeBasedState(b);
  this.audioInfo.updateAudioData(this.analyserNode);
  this.time += a;
  this.renderForeground(a);
  this.updateCameraPosition();
  this.renderBackground(a)
}
;
Particles.prototype.updateTimeBasedState = function (a) {
  for (var b = this.timeSamples.length - 1; 0 < b; --b)
    this.timeSamples[b] = this.timeSamples[b - 1];
  this.timeSamples[0] = 1E3 * a;
  this.timeSamplesCount = Math.min(30, this.timeSamplesCount + 1);
  for (b = a = 0; b < this.timeSamplesCount; ++b)
    a += this.timeSamples[b];
  a /= this.timeSamplesCount;
  36 < a ? (++this.scaleDecreaseCount,
    this.scaleIncreaseCount = 0) : (++this.scaleIncreaseCount,
    this.scaleDecreaseCount = 0);
  30 < this.scaleDecreaseCount && (this.isParticleScaleDecreasing = !0,
    this.scaleDecreaseCount = 0,
    this.particleScaleFactor = Math.max(.1, this.particleScaleFactor - Math.min(.1, (a - 36) / 200)));
  !this.isParticleScaleDecreasing && 30 < this.scaleIncreaseCount && (this.scaleIncreaseCount = 0,
    this.particleScaleFactor = Math.min(1, this.particleScaleFactor + .01));
  return a / 1E3
}
;
Particles.prototype.renderForeground = function (a) {
  for (var b = 0; b < this.particleSystems.length; ++b)
    this.particleSystems[b].update(a, this.audioInfo.bL);
  this.glContext.colorMask(!0, !0, !0, !0);
  this.glContext.depthMask(!1);
  this.glContext.disable(2929);
  this.glContext.disable(2884);
  this.glContext.disable(3042);
  this.glContext.activateProgram(this.particleSimulationProgram);
  this.glContext.bindTexture("noiseTex", this.noiseTexture);
  this.glContext.setUniform("time", this.time, a);
  this.glContext.setUniform("drift", 60 * Math.sin(this.time) * a, 150 * a, 120 * a);
  this.glContext.setUniform("randomTexOffset", Math.random(), Math.random());
  for (b = 0; b < this.particleSystems.length; ++b) {
    var c = this.particleSystems[b]
      , e = c.getOpacity()
      , f = 3 * e
      , h = 12 * f * f * f
      , k = c.gV;
    c.gV = c.Tt;
    c.Tt = k;
    k = Math.floor(this.particleScaleFactor * c.Tt.height) / c.Tt.height;
    this.glContext.bindFramebuffer(c.Tt);
    this.glContext.bindTexture("randomTex", c.texture);
    this.glContext.bindTexture("positionTex", c.gV.colorTexture);
    this.glContext.bindAttributeBuffer("uv", this.buffer);
    this.glContext.setUniform("emitterSize", .01 + f, h, a * e * 30);
    this.glContext.setUniform("pos0", this.particleSystems[b].position);
    this.glContext.setUniform("vel0", this.particleSystems[b].gha);
    this.glContext.setUniform("pos1", this.particleSystems[1 - b].position);
    this.glContext.setUniform("vel1", this.particleSystems[1 - b].gha);
    this.glContext.setUniform("quality", k);
    this.glContext.drawArrays(4, 0, this.buffer.vertexCount) // drawArrays
  }
}
;
Particles.prototype.setupMatrices = function () {
  var a = new Float32Array(16)
    , b = new Float32Array(16)
    , c = new Float32Array(16);
  var e = this.ratio
    , f = 70 * Math.PI / 180 / 2
    , h = Math.sin(f);
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
    b[15] = 0);
  h = this.cameraPosition;
  e = sY[0];
  vec3Sub(this.particleSystemCenterPosition, h, e);
  normalizeVector(e, e);
  e[3] = 0;
  f = sY[1];
  crossProduct(e, [0, 1, 0], f);
  normalizeVector(f, f);
  f[3] = 0;
  var k = sY[2];
  crossProduct(f, e, k);
  normalizeVector(k, k);
  k[3] = 0;
  e[0] = -e[0];
  e[1] = -e[1];
  e[2] = -e[2];
  setMatrix4Column(a, 0, f);
  setMatrix4Column(a, 1, k);
  setMatrix4Column(a, 2, e);
  a[3] = 0;
  a[7] = 0;
  a[11] = 0;
  a[15] = 1;
  var e = -h[0]
    , f = -h[1]
    , h = -h[2]
    , k = a[1] * e + a[5] * f + a[9] * h + a[13]
    , m = a[2] * e + a[6] * f + a[10] * h + a[14]
    , p = a[3] * e + a[7] * f + a[11] * h + a[15];
  a[12] = a[0] * e + a[4] * f + a[8] * h + a[12];
  a[13] = k;
  a[14] = m;
  a[15] = p;
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
    , a = a[15];
  c[0] = e * Ha + m * lb + E * tb + R * jd;
  c[1] = f * Ha + p * lb + G * tb + ba * jd;
  c[2] = h * Ha + r * lb + J * tb + la * jd;
  c[3] = k * Ha + A * lb + N * tb + b * jd;
  c[4] = e * X + m * ug + E * Ie + R * ml;
  c[5] = f * X + p * ug + G * Ie + ba * ml;
  c[6] = h * X + r * ug + J * Ie + la * ml;
  c[7] = k * X + A * ug + N * Ie + b * ml;
  c[8] = e * yb + m * nh + E * nl + R * vg;
  c[9] = f * yb + p * nh + G * nl + ba * vg;
  c[10] = h * yb + r * nh + J * nl + la * vg;
  c[11] = k * yb + A * nh + N * nl + b * vg;
  c[12] = e * wg + m * ud + E * Gf + R * a;
  c[13] = f * wg + p * ud + G * Gf + ba * a;
  c[14] = h * wg + r * ud + J * Gf + la * a;
  c[15] = k * wg + A * ud + N * Gf + b * a;
  this.glContext.bindFramebuffer(this.particleRenderFramebuffer);
  this.glContext.clearColor(0, 0, 0, 0);
  this.glContext.clear(16384);
  this.glContext.enable(3042);
  this.glContext.blendEquation(32774);
  this.glContext.blendFunc(1, 1);
  this.glContext.activateProgram(this.alphaMaskProgram);
  this.glContext.setUniform("worldViewProj", c);
  c = this.canvas.height / 450 / (256 * this.particleScaleFactor);
  c = Math.max(c, 2 / 255);
  this.glContext.setUniform("density", c);
  for (c = 0; 2 > c; ++c)
    a = this.particleSystems[c],
      this.glContext.bindTexture("positionTex", a.Tt.colorTexture),
      this.glContext.bindAttributeBuffer("uv", a.buffer),
      a = Math.floor(this.particleScaleFactor * a.Tt.height) * a.Tt.width,
      e = Math.floor(a / 2),
      0 == c ? (this.glContext.colorMask(!0, !1, !1, !1),
        this.glContext.drawArrays(0, 0, e),
        this.glContext.colorMask(!1, !0, !1, !1)) : (this.glContext.colorMask(!1, !1, !0, !1),
        this.glContext.drawArrays(0, 0, e),
        this.glContext.colorMask(!1, !1, !1, !0)),
      this.glContext.drawArrays(0, e, a - e);
  this.glContext.colorMask(!0, !0, !0, !0);
  this.glContext.disable(3042);
  this.glContext.bindFramebuffer(this.colorBlendFramebuffer);
  this.glContext.activateProgram(this.colorBlendProgram);
  this.glContext.bindTexture("tex", this.particleRenderFramebuffer.colorTexture);
  this.glContext.bindAttributeBuffer("uv", this.buffer);
  this.glContext.setUniform("color0", this.colorFromHue(.05 * this.time, .85));
  this.glContext.setUniform("color1", this.colorFromHue(.05 * this.time + 2, .85));
  this.glContext.drawArrays(4, 0, this.buffer.vertexCount)
}
;
// init component
Particles.prototype.renderBackground = function () {
  this.setupMatrices();
  this.glContext.disable(3042); // GL_BLEND
  this.glContext.bindFramebuffer(this.particleRenderFramebuffer);
  this.glContext.activateProgram(this.particleUpdateProgram);
  this.glContext.bindTexture("mainTex", this.colorBlendFramebuffer.colorTexture);
  this.glContext.bindAttributeBuffer("uv", this.buffer);
  this.glContext.setUniform("duv", 1 / this.width, 0);
  this.glContext.setUniform("alphaScaleOffset", 1, 0);
  this.glContext.drawArrays(4, 0, this.buffer.vertexCount);
  this.glContext.enable(3042);
  this.glContext.blendFunc(770, 771);
  this.glContext.bindFramebuffer(this.alphaBlendFramebuffer);
  this.glContext.bindTexture("mainTex", this.particleRenderFramebuffer.colorTexture);
  this.glContext.bindAttributeBuffer("uv", this.buffer);
  this.glContext.setUniform("duv", 0, 1 / this.height);
  this.glContext.setUniform("alphaScaleOffset", .25, .75);
  this.glContext.drawArrays(4, 0, this.buffer.vertexCount);
  this.glContext.disable(3042);
  this.glContext.bindFramebuffer(null);
  this.glContext.activateProgram(this.finalRenderProgram);
  this.glContext.bindTexture("mainTex", this.alphaBlendFramebuffer.colorTexture);
  this.glContext.bindTexture("grainTex", this.grainTex);
  this.glContext.bindAttributeBuffer("uv", this.buffer);
  this.glContext.setUniform("grainScaleOffset", this.canvas.width / this.grainTex.width, this.canvas.height / this.grainTex.height, Math.random(), Math.random());
  this.glContext.drawArrays(4, 0, this.buffer.vertexCount)
}
;
Particles.prototype.updateCenterPoint = function () {
  this.particleSystemCenterPosition = new Float32Array(3);
  vec3Add(this.particleSystems[0].position, this.particleSystems[1].position, this.particleSystemCenterPosition);
  vec3Mul(this.particleSystemCenterPosition, .5, this.particleSystemCenterPosition)
}
;
Particles.prototype.updateCameraPosition = function () {
  var a = this.particleSystems[0].position
    , b = this.particleSystems[1].position
    , c = .3 * this.time;
  this.cameraPosition = createVec3(4.4 * Math.cos(c), 0, 4.4 * Math.sin(c));
  c = new Float32Array(3);
  vec3Add(a, b, c);
  vec3Mul(c, .5, c);
  vec3Mul(c, .05, c);
  vec3Mul(this.particleSystemCenterPosition, .95, this.particleSystemCenterPosition);
  vec3Add(this.particleSystemCenterPosition, c, this.particleSystemCenterPosition)
}
;
var ParticleTexture = function (a, b, c) {
  this.width = b;
  this.height = c;
  this.size = b * c;
  this.texture = this.createRandomTexture(a);
  this.buffer = this.createGradientBuffer(a)
};
ParticleTexture.prototype.createRandomTexture = function (a) {
  for (var b = this.width, c = this.height, vector4List = new Float32Array(b * c * 4), f = Math.floor(vector4List.length / 8), h = 0; h < f;) {
    var k, m, p;
    do
      k = 2 * Math.random() - 1,
        m = 2 * Math.random() - 1,
        p = 2 * Math.random() - 1;
    while (1 < k * k + m * m + p * p);
    vector4List[h++] = k;
    vector4List[h++] = m;
    vector4List[h++] = p;
    vector4List[h++] = Math.random()
  }
  for (var r = [-1, 1, 1, 1, -1, 1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, -1, -1, -1, -1, -1], A = 0; f < vector4List.length;)
    for (k = vector4List[A++],
           m = vector4List[A++],
           p = vector4List[A++],
           A++,
           h = 0; h < r.length;)
      vector4List[f++] = k * r[h++],
        vector4List[f++] = m * r[h++],
        vector4List[f++] = p * r[h++],
        vector4List[f++] = Math.random();
  return a.createTexture(b, c, {
    filter: 9728,
    data: vector4List,
    type: 5126,
    wrap: 10497
  })
}
;
ParticleTexture.prototype.createGradientBuffer = function (a) {
  for (var b = new Float32Array(2 * this.size), c = 0, e = 0; e < this.height; ++e)
    for (var f = 0; f < this.width; ++f) {
      var h = f / this.width
        , k = e / this.height;
      b[c++] = h;
      b[c++] = k
    }
  return a.createBuffer(2, 35044, b)
}
;
/**
 *
 * @param gl
 * @param b
 * @param c
 * @param e
 * @param f
 */
var ParticleSystem = function (gl, b, c, e, f) {
  this.doa = c;
  this.tfa = this.RV = 0;
  this.MX = f;
  this.position = new Float32Array(3);
  this.gha = new Float32Array(3);
  this.TE = [new Float32Array(e - c), new Float32Array(e - c)];
  this.size = b.size;
  this.texture = b.texture;
  c = {
    type: 5126,
    filter: 9728
  };
  this.Tt = gl.createFramebuffer(b.width, b.height, c, !1);
  this.gV = gl.createFramebuffer(b.width, b.height, c, !1);
  this.buffer = b.buffer;
  this.updatePosition(0)
};
ParticleSystem.prototype.update = function (a, b) {
  this.updateTextureData(b);
  this.updatePosition(a)
}
;
ParticleSystem.prototype.updatePosition = function (a) {
  var b = this.position
    , c = getTargetPosition(this.MX + .01, 1.5, 3)
    , e = b[0] - c[0]
    , f = b[1] - c[1]
    , b = b[2] - c[2]
    , e = .01 / (.001 + Math.sqrt(e * e + f * f + b * b))
    , e = .3 * Math.log(1 + 5 * e);
  this.MX += this.tfa * a * e;
  a = getTargetPosition(this.MX, 1.5, 3);
  vec3Sub(a, this.position, this.gha);
  this.position = a
}
;
ParticleSystem.prototype.updateTextureData = function (a) {
  for (var b = this.TE[0].length, c = 0, e = 0; e < b; ++e)
       var f = a[e + this.doa] - Math.min(this.TE[0][e], this.TE[1][e])
         , f = 4 * f
         , c = Math.max(c, f);
  c = Math.min(1, c);
  this.RV = Math.max(.95 * this.RV, c);
  this.tfa = Math.max(.9 * this.tfa, 3 * this.RV);
  for (e = 0; e < b; ++e)
    this.TE[1][e] = this.TE[0][e],
      this.TE[0][e] = a[e + this.doa]
}
;
ParticleSystem.prototype.getOpacity = function () {
  return .05 * this.RV
}
;
/// END OF PARTICLE EFFECT

/// AnalyserNode
var EY = function () {
  this.createTime = Date.now()
};
EY.prototype.normalize = function (a) {
  if (0 > a || 1 < a)
    return 0;
  a = .25 > a ? a / .25 : 1 - (a - .25) / .75;
  return 3 * a * a - 2 * a * a * a
}
;
EY.prototype.getFloatFrequencyData = function (a) {
  var b = (Date.now() - this.createTime) / 1E3 * .8 % 1
    , c = 0
    , e = 0;
  .5 > b ? c = this.normalize(2 * b) : e = this.normalize(2 * (b - .5));
  for (var b = a.length / 16, f = Math.log(10), h = 0; h < a.length; ++h) {
    var k = (.2 + .5 * e + c * this.normalize(h / b)) / 1.7;
    a[h] = 0 < k ? 20 * Math.log(k) / f : -1E3
  }
}
;


