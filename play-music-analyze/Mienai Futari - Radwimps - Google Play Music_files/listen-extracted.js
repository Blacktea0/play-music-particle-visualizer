/// BEGIN OF PARTICLE EFFECT
var MX = function(a, b) {
    Ja.call(this);
    // canvas
    this.fq = a;
    // webgl context
    this.Sc = b;
    this.Nx = null;
    // buffer list
    this.PO = [];
    // texture list
    this.yQ = [];
    // shader list
    this.iV = [];
    // texture list
    this.RX = []
};
u(MX, Ja);
// on delete
MX.prototype.Oa = function() {
    for (var a = 0; a < this.PO.length; ++a)
        this.Sc.deleteBuffer(this.PO[a].handle);
    this.PO = [];
    for (a = 0; a < this.yQ.length; ++a) {
        var b = this.yQ[a];
        b.jq && this.Sc.deleteTexture(b.jq.handle);
        b.MP && this.Sc.deleteTexture(b.MP.handle);
        this.Sc.deleteFramebuffer(b.handle)
    }
    this.yQ = [];
    for (a = 0; a < this.iV.length; ++a) {
        var b = this.iV[a]
            , c = this.Sc.getAttachedShaders(b.handle);
        if (c)
            for (var e = 0; e < c.length; ++e)
                this.Sc.detachShader(b.handle, c[e]),
                    this.Sc.deleteShader(c[e]);
        this.Sc.deleteProgram(b.handle)
    }
    this.iV = [];
    for (a = 0; a < this.RX.length; ++a)
        this.Sc.deleteTexture(this.RX[a].handle);
    this.RX = []
}
;
MX.prototype.Lx = function(a) {
    if (this.Nx != a) {
        var b = this.Nx ? this.Nx.We : 0
            , c = a.We;
        if (b > c)
            for (var e = c; e < b; ++e)
                this.Sc.disableVertexAttribArray(e);
        else
            for (e = b; e < c; ++e)
                this.Sc.enableVertexAttribArray(e);
        this.Sc.useProgram(a.handle);
        this.Nx = a
    }
}
;
MX.prototype.bindTexture = function(a, b) {
    var c = this.Nx.E3a(a);
    if (void 0 != c)
        this.Sc.activeTexture(33984 + c.Fu),
            this.Sc.bindTexture(3553, b.handle);
    else
        throw Error("Texture " + a + " not found");
}
;
var $ja = function(a, b, c, e, f) {
    this.MP = this.jq = null;
    this.handle = a.createFramebuffer();
    this.width = b;
    this.height = c;
    a.bindFramebuffer(36160, this.handle);
    e && (this.jq = new NX(a,b,c,e),
        a.framebufferTexture2D(36160, 36064, 3553, this.jq.handle, 0));
    f && (this.MP = new NX(a,b,c,f),
        a.framebufferTexture2D(36160, 36096, 3553, this.MP.handle, 0));
    a.bindFramebuffer(36160, null)
};
MX.prototype.createFramebuffer = function(a, b, c, e) {
    var f = null;
    e && (f = {
        type: 5123,
        Gn: 33071,
        filter: 9728,
        format: 6402,
        data: null
    });
    a = new $ja(this.Sc,a,b,c,f);
    this.yQ.push(a);
    return a
}
;
MX.prototype.createTexture = function(a, b, c) {
    a = new NX(this.Sc,a,b,c);
    this.RX.push(a);
    return a
}
;
MX.prototype.$u = function(a, b) {
    a = this.Nx.attributes[a];
    this.Sc.bindBuffer(34962, b.handle);
    this.Sc.vertexAttribPointer(a, b.a1, 5126, !1, 0, 0)
}
;
MX.prototype.Wn = function(a, b, c) {
    this.Sc.drawArrays(a, b, c)
}
;
// Adding buffer data
MX.prototype.e0 = function(a, b, c) {//a: Dimension b: Usage, c: Buffer data
    a = new aka(this.Sc,a,b,c);
    this.PO.push(a);
    return a
}
;
MX.prototype.createProgram = function(a) {
    a = new a(this.Sc);
    this.iV.push(a);
    return a
}
;
// handle with buffer
var aka = function(a, b, c, e) { // e: Buffer data.
    this.handle = a.createBuffer();
    this.a1 = b; // Dimension
    this.Qt = e.length / b; // Vertex num
    this.usage = c; // usage
    if (0 != e.length % this.a1)
        throw Error("Number of elements is not a multiple of elementSize");
    if (e.length != this.a1 * this.Qt)
        throw Error("Unexpected number of elements");
    a.bindBuffer(34962, this.handle);
    a.bufferData(34962, e, this.usage)
}
    , NX = function(a, b, c, e) {
    this.width = b;
    this.height = c;
    this.handle = a.createTexture();
    this.type = void 0 != e.type ? e.type : a.UNSIGNED_BYTE;
    this.Gn = void 0 != e.Gn ? e.Gn : a.REPEAT;
    this.filter = void 0 != e.filter ? e.filter : a.LINEAR;
    this.format = void 0 != e.format ? e.format : a.RGBA;
    b = void 0 != e.data ? e.data : null;
    a.bindTexture(a.TEXTURE_2D, this.handle);
    a.texImage2D(a.TEXTURE_2D, 0, this.format, this.width, this.height, 0, this.format, this.type, b);
    a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, this.filter);
    a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, this.filter);
    a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, this.Gn);
    a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, this.Gn)
}
/// Attach shader source to webgl context
    , OX = function(context, vsSource, fsSource) {
    this.handle = context.createProgram();
    this.attributes = {};
    // parameter count
    this.We = 0;
    // uniform name storage
    this.Vr = {};
    // sampler name storage
    this.gu = {};
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
OX.prototype.getUniform = function(a) {
    var b = this.Vr[a];
    if (!b)
        throw Error("No uniform named: " + a);
    return b
}
;
// getSampler
OX.prototype.E3a = function(a) {
    var b = this.gu[a];
    if (!b)
        throw Error("No sampler named: " + a);
    return b
}
;
// uniform functions
var PX = function(a, b, c) {
    this.type = b;
    this.UAa = c;
    this.iT = !1;
    switch (b) {
        case 5126:
            this.um = a.uniform1f;
            break;
        case 35664:
            this.um = a.uniform2fv;
            break;
        case 35665:
            this.um = a.uniform3fv;
            break;
        case 35666:
            this.um = a.uniform4fv;
            break;
        case 35670:
        case 5124:
            this.um = a.uniform1i;
            break;
        case 35671:
        case 35667:
            this.um = a.uniform2iv;
            break;
        case 35672:
        case 35668:
            this.um = a.uniform3iv;
            break;
        case 35673:
        case 35669:
            this.um = a.uniform4iv;
            break;
        case 35674:
            this.um = a.uniformMatrix2fv;
            this.iT = !0;
            break;
        case 35675:
            this.um = a.uniformMatrix3fv;
            this.iT = !0;
            break;
        case 35676:
            this.um = a.uniformMatrix4fv;
            this.iT = !0;
            break;
        case 35678:
        case 35680:
            this.um = a.uniform1i;
            break;
        default:
            throw Error("Unrecognized uniform type: " + b);
    }
}
    , QX = function(a, b, c, e) {
    PX.call(this, a, b, c);
    this.Fu = e
};
u(QX, PX);
MX.prototype.bindFramebuffer = function(a) {
    a ? (this.Sc.bindFramebuffer(36160, a.handle),
        this.Sc.viewport(0, 0, a.width, a.height)) : (this.Sc.bindFramebuffer(36160, null),
        this.Sc.viewport(0, 0, this.fq.width, this.fq.height))
}
;
MX.prototype.blendColor = function(a, b, c, e) {
    this.Sc.blendColor(a, b, c, e)
}
;
MX.prototype.blendEquation = function(a) {
    this.Sc.blendEquation(a)
}
;
MX.prototype.blendEquationSeparate = function(a, b) {
    this.Sc.blendEquationSeparate(a, b)
}
;
MX.prototype.blendFunc = function(a, b) {
    this.Sc.blendFunc(a, b)
}
;
MX.prototype.blendFuncSeparate = function(a, b, c, e) {
    this.Sc.blendFuncSeparate(a, b, c, e)
}
;
MX.prototype.clear = function(a) {
    this.Sc.clear(a)
}
;
MX.prototype.clearColor = function(a, b, c, e) {
    this.Sc.clearColor(a, b, c, e)
}
;
MX.prototype.colorMask = function(a, b, c, e) {
    this.Sc.colorMask(a, b, c, e)
}
;
MX.prototype.depthMask = function(a) {
    this.Sc.depthMask(a)
}
;
MX.prototype.disable = function(a) {
    this.Sc.disable(a)
}
;
MX.prototype.enable = function(a) {
    this.Sc.enable(a)
}
;
MX.prototype.viewport = function(a, b, c, e) {
    this.Sc.viewport(a, b, c, e)
}
;
MX.prototype.getExtension = function(a) {
    return this.Sc.getExtension(a)
}
;
MX.prototype.getSupportedExtensions = function() {
    return this.Sc.getSupportedExtensions()
}
;
MX.prototype.Dg = function(a, b) {
    var c = this.Nx.Vr[a];
    if (!c)
        throw Error('No uniform named "' + a + '"');
    var e = this.Sc, f;
    f = 2 == arguments.length ? b : Array.prototype.slice.call(arguments, 1);
    c.iT ? c.um.call(e, c.UAa, !1, f) : c.um.call(e, c.UAa, f)
}
;
var RX = function(a) {
    OX.call(this, a,
        "precision mediump float;varying vec2 a;attribute vec2 b;void main(){gl_Position=vec4(b,0,1);a=b;}",
        "precision mediump float;varying vec2 a;\n#define pi 3.1415926535897932384626433832795\n#define c_m1 8.176\n#define maxFreq 22050.0\nuniform sampler2D c;uniform float d,e;uniform vec2 f;float u(float g){return 1.-1./(1.+exp(6.-g/(2.*pi)));}float v(float g){return 2.*pi*(log(1./g-1.)+6.);}float w(float g,float h){return floor((v(g)-h)/(2.*pi)+.5)*2.*pi+h;}vec2 x(vec2 g){return vec2(length(g),atan(g.y,g.x));}vec3 A(vec3 g){g=clamp(g,0.,1.);vec3 h=vec3(1)-g.yyy+g.y*clamp(vec3(-1.,2,2)+vec3(1,-1.,-1.)*abs(6.*g.xxx-vec3(3,2,4)),0.,1.);return h*g.z;}float B(float g){return (e/2.+c_m1*exp2(g/(2.*pi)))/maxFreq;}float C(vec2 b){vec2 g=x(b);float h,i,j,k,l,m,n,o,p;h=g.x;i=g.y;j=w(h,i);k=u(j);l=B(j);m=j-sign(h-k)*pi;n=u(m);o=texture2D(c,vec2(l,.5)).r;p=(h-k)/(n-k);return o-p;}void main(){float g,k,l,m,n,o,p,r,s,t;g=f.x/f.y;vec2 h,b,i,j,q;h=vec2(max(1.,g),max(1.,1./g));b=h*a;i=h/f;j=x(b);k=j.x;l=j.y;m=C(b);n=C(b+.5*vec2(i.x,0));o=C(b+.5*vec2(0,i.y));p=C(b+.5*i);q=abs(vec2(n-m,o-m));r=4.*max(q.x,q.y);s=.25*(smoothstep(0.,r,m)+smoothstep(0.,r,n)+smoothstep(0.,r,o)+smoothstep(0.,r,p));s*=smoothstep(1.,.97,k);t=mod(l/(2.*pi),1.);gl_FragColor=vec4(A(vec3(t,sqrt(k),s*d)),1);gl_FragColor.xyz=pow(gl_FragColor.xyz,vec3(1./2.2));}");
    this.We = 0;
    a.bindAttribLocation(this.handle, this.We, "b");
    this.attributes.uv = this.We++;
    a.useProgram(this.handle);
    for (var b = a.getProgramParameter(this.handle, a.ACTIVE_UNIFORMS), c = 0, e = 0; e < b; ++e) {
        var f = a.getActiveUniform(this.handle, e);
        if (f) {
            var h = bka[f.name];
            if (h) {
                var k = a.getUniformLocation(this.handle, f.name)
                    , f = f.type;
                35678 == f || 35680 == f ? (f = new QX(a,f,k,c++),
                    a.uniform1i(k, f.Fu),
                    this.gu[h] = f) : this.Vr[h] = new PX(a,f,k)
            }
        }
    }
};
u(RX, OX);
var bka = {
    c: "spectrum",
    d: "loudness",
    e: "bucketWidth",
    f: "resolution"
};
var SX = function() {};
SX.prototype.Iia = function(a, b) {
    if (a != b)
        for (var c = 0; c < a.length; c++)
            a[c] = b[c]
}
;
var TX = function(a, b) {
    this.ACa = new Float32Array(a);
    for (var c = 0; c < a; c++)
        this.ACa[c] = this.xNa(b * c / (2 * a))
};
u(TX, SX);
TX.prototype.xNa = function(a) {
    return 2 + 20 * Math.log(this.VOa(a)) / Math.log(10)
}
;
TX.prototype.VOa = function(a) {
    a *= a;
    return 14884E4 * a * a / ((a + 424.36) * (a + 14884E4) * Math.sqrt((a + 11599.29) * (a + 544496.41)))
}
;
TX.prototype.Iia = function(a, b) {
    for (var c = 0; c < a.length; c++)
        a[c] = b[c] + this.ACa[c]
}
;
var Updatable = function() {};
Updatable.prototype.update = function() {}
;
var Gyre = function(a, b, c, e) {
    this.$h = a;
    this.Tn = b;
    this.Ha = e;
    this.Hpb(a, Math.min(4096, 2 * b.getParameter(3379)));
    var f = a.fftSize / 2;
    b = 44100 / (2 * f);
    a.smoothingTimeConstant = .5;
    this.Ji = e.e0(2, 35044, new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]));
    this.jE = 0;
    this.Rja = new Uint8Array(f);
    this.Ei = new Float32Array(f);
    this.gG = e.createTexture(f, 1, {
        filter: 9729,
        type: 5121,
        format: 6409,
        Gn: 33071
    });
    this.nQa = new TX(f,44100);
    a = e.createProgram(RX);
    e.colorMask(!0, !0, !0, !0);
    e.depthMask(!1);
    e.disable(2929);
    e.disable(2884);
    e.disable(3042);
    e.Lx(a);
    e.Dg("bucketWidth", b);
    e.Dg("resolution", c.width, c.height)
};
u(Gyre, Updatable);
var cka = {
    wP: Gyre,
    displayName: "Gyre",
    identifier: "Gyre",
    eNa: {
        iba: [],
        cla: {
            antialias: !1,
            depth: !1,
            stencil: !1
        }
    }
};
Gyre.prototype.Hpb = function(a, b) {
    a.fftSize = 2048;
    try {
        for (; a.fftSize < b; )
            a.fftSize *= 2
    } catch (c) {}
}
;
Gyre.prototype.oUa = function() {
    this.$h.getFloatFrequencyData(this.Ei); // AnalyserNode component
    this.nQa.Iia(this.Ei, this.Ei);
    for (var a = 0, b = this.jE = 0; b < this.Ei.length; b++)
        this.Ei[b] = Math.pow(10, .05 * this.Ei[b]),
            this.jE += Math.pow(this.Ei[b], 2),
            a += this.Ei[b];
    this.jE = Math.sqrt(this.jE);
    for (var a = a / this.Ei.length, c = 0, b = 0; b < this.Ei.length; b++)
         var e = this.Ei[b] - a
             , c = c + e * e;
    c = Math.sqrt(c / this.Ei.length);
    for (b = 0; b < this.Ei.length; b++)
        this.Ei[b] = (this.Ei[b] - a) / (10 * c);
    for (b = 0; b < this.Ei.length; b++)
        this.Rja[b] = 255 * Math.max(0, Math.min(1, this.Ei[b]))
}
;
Gyre.prototype.update = function() {
    this.oUa();
    this.Ha.bindTexture("spectrum", this.gG);
    this.Tn.texImage2D(3553, 0, this.gG.format, this.gG.width, this.gG.height, 0, this.gG.format, this.gG.type, this.Rja);
    this.Ha.Dg("loudness", 4 * Math.sqrt(this.jE));
    this.Ha.$u("uv", this.Ji);
    this.Ha.Wn(4, 0, this.Ji.Qt)
}
;
var WX = function() {
    EU.call(this);
    this.queue = []
};
u(WX, EU);
WX.prototype.add = function(a) {
    Sb(this.queue, a) || (this.queue.push(a),
        v(a, "finish", this.J9, !1, this))
}
;
WX.prototype.remove = function(a) {
    Zb(this.queue, a) && zd(a, "finish", this.J9, !1, this)
}
;
WX.prototype.Oa = function() {
    Jb(this.queue, function(a) {
        a.qb()
    });
    this.queue.length = 0;
    WX.Aa.Oa.call(this)
}
;
var XX = function() {
    WX.call(this);
    this.N1 = 0
};
u(XX, WX);
XX.prototype.play = function(a) {
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
    Jb(this.queue, function(c) {
        b && !c.kw() || c.play(a)
    });
    return !0
}
;
XX.prototype.pause = function() {
    this.hf() && (Jb(this.queue, function(a) {
        a.hf() && a.pause()
    }),
        this.oea(),
        this.O9())
}
;
XX.prototype.stop = function(a) {
    Jb(this.queue, function(b) {
        b.Uq() || b.stop(a)
    });
    this.QA();
    this.endTime = t();
    this.onStop();
    this.fp()
}
;
XX.prototype.J9 = function() {
    this.N1++;
    this.N1 == this.queue.length && (this.endTime = t(),
        this.QA(),
        this.zU(),
        this.fp())
}
;
var YX = function() {
    WX.call(this);
    this.Ni = 0
};
u(YX, WX);
YX.prototype.play = function(a) {
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
YX.prototype.pause = function() {
    this.hf() && (this.queue[this.Ni].pause(),
        this.oea(),
        this.O9())
}
;
YX.prototype.stop = function(a) {
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
YX.prototype.J9 = function() {
    this.hf() && (this.Ni++,
        this.Ni < this.queue.length ? this.queue[this.Ni].play() : (this.endTime = t(),
            this.QA(),
            this.zU(),
            this.fp()))
}
;
var ZX = function(a, b) {
    Q.call(this);
    this.Ve = a;
    this.yya = b
};
u(ZX, Q);
d = ZX.prototype;
d.getName = function() {
    return this.Ve
}
;
d.kZ = function() {}
;
d.start = function() {}
;
d.stop = function() {}
;
d.c8 = function() {
    return !1
}
;
var $X = function(a, b, c, e, f) {
    HU.apply(this, arguments)
};
u($X, HU);
$X.prototype.qB = function() {
    var a = this.sB && this.Ft() ? "right" : "left";
    this.element.style[a] = this.coords[0] + "px";
    this.element.style.top = this.coords[1] + "px";
    this.element.style.width = this.coords[2] + "px";
    this.element.style.height = this.coords[3] + "px"
}
;
var bY = function(a, b) {
    ZX.call(this, "Album art", "Album art");
    this.ta = a;
    this.Da = b;
    this.MK = this.lw = !1;
    this.wb = 0;
    this.Qz = this.kf = this.oj = null;
    this.Hm = new aY;
    this.pr = new aY;
    this.Gg = new Kl(-1,-1);
    this.$j = -1;
    this.Th = new Hl(-1,-1);
    this.Tk = new Hl(-1,-1);
    this.Lr = new Hl(-1,-1);
    this.Cw = this.mDa = -1;
    this.GE = new Hl(-1,-1);
    this.rA = this.xba = -1;
    this.bW = new Hl(-1,-1);
    this.Tw = new Hl(-1,-1);
    this.ra = new Lo(this)
};
u(bY, ZX);
var aY = function() {
    this.FZ = this.fl = this.he = null
};
d = bY.prototype;
d.Ntb = function(a, b) {
    var c = dm("DIV", "panning-background")
        , e = dm("DIV", "panning-overlay")
        , f = dm("IMG", "panning-img");
    f.src = tr(b.Qc() || "", 160) || sr();
    c.appendChild(f);
    a.appendChild(c);
    a.appendChild(e)
}
;
d.kZ = function(a) {
    this.HZ(q(this.Ntb, this, a))
}
;
d.start = function(a) {
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
d.stop = function() {
    this.lw && (this.lw = !1,
        this.ra.removeAll(),
        hm(this.Qz),
        this.pea(0))
}
;
d.c8 = function() {
    return !0
}
;
d.Yya = function(a) {
    a.he = null;
    a.fl = dm("DIV", "art-container");
    this.Qz.appendChild(a.fl);
    a.FZ = dm("IMG", "art-image");
    a.fl.appendChild(a.FZ)
}
;
d.y$ = function() {
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
d.pea = function(a) {
    this.wb = this.lw ? a : 0;
    this.oj && this.oj.qb();
    return this.lw
}
;
d.HZ = function(a) {
    var b = this.Da.Ts();
    b ? a(b) : Oo(q(this.HZ, this, a), 500)
}
;
d.ZXa = function(a) {
    this.MK = !1;
    a != this.Hm.he && (this.kib(),
        this.tyb(a))
}
;
d.E1 = function() {
    this.lw && this.MK && this.HZ(q(this.ZXa, this))
}
;
d.kib = function() {
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
d.tyb = function(a) {
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
d.Sxb = function() {
    var a = new XX, b;
    b = this.pr.fl;
    b = new Hl(b.offsetLeft,b.offsetTop);
    var c = xp(this.pr.fl);
    a.add(new $X(this.pr.fl,[b.x, b.y, c.width, c.height],[this.Th.x, this.Th.y, this.$j, this.$j],2E3,Wia));
    a.add(new IU(this.Hm.fl,[this.Tk.x, this.Tk.y],[this.Tk.x, this.Tk.y],2E3));
    return a
}
;
d.oyb = function() {
    var a = new XX;
    a.add(new IU(this.pr.fl,[this.Th.x, this.Th.y],[this.Lr.x, this.Lr.y],2E3));
    a.add(new KU(this.pr.fl,1,.3,2E3));
    return a
}
;
d.nyb = function() {
    var a = new XX;
    a.add(new $X(this.Hm.fl,[this.Tk.x, this.Tk.y, this.$j, this.$j],[this.Th.x, this.Th.y, this.$j, this.$j],2E3));
    a.add(new KU(this.Hm.fl,.3,1,2E3));
    return a
}
;
d.GXa = function() {
    var a = new XX;
    a.add(new $X(this.Hm.fl,[this.Th.x, this.Th.y, this.$j, this.$j],[this.GE.x, this.GE.y, this.Cw, this.Cw],2E3,LU));
    return a
}
;
d.lDa = function() {
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
            this.oj.add(new $X(this.Hm.fl,[this.bW.x, this.bW.y, this.xba, this.xba],[this.Tw.x, this.Tw.y, this.rA, this.rA],a,Xia));
            v(this.oj, "end", q(this.lDa, this));
            this.oj.play()
        }
}
;
var cY = function(a) {
    OX.call(this, a, "precision mediump float;varying vec2 a;attribute vec2 b;uniform vec4 c;void main(){a=b;vec2 d=b*c.xy+c.zw;gl_Position=vec4(d*2.-vec2(1),1,1);}", "precision mediump float;varying vec2 a;uniform sampler2D d;void main(){vec4 e=texture2D(d,a);gl_FragColor=e;}");
    this.We = 0;
    a.bindAttribLocation(this.handle, this.We, "b");
    this.attributes.uv = this.We++;
    a.useProgram(this.handle);
    // traverse all uniform
    for (var b = a.getProgramParameter(this.handle, 35718), c = 0, e = 0; e < b; ++e) {
        var f = a.getActiveUniform(this.handle, e);
        if (f) {
            var name = dka[f.name];
            if (name) {
                var location = a.getUniformLocation(this.handle, f.name)
                    , f = f.type;
                var type = f.type;
                // if type == SAMPLER_2D or SAMPLER_CUBE
                if (35678 == type || 35680 == type) {
                    var qx = new QX(a,type,location,c++);
                    a.uniform1i(location, qx.Fu);
                    this.gu[name] = qx;
                } else {
                    this.Vr[name] = new PX(a,f,location);
                }
                // 35678 == f || 35680 == f ? (f = new QX(a,f,k,c++),
                // a.uniform1i(k, f.Fu),
                // this.gu[h] = f) : this.Vr[h] = new PX(a,f,k)
            }
        }
    }
};
u(cY, OX);
var dka = {
    c: "scaleOffset",
    d: "tex"
};
var dY = function(a) {
    OX.call(this, a, "precision mediump float;varying vec2 a;attribute vec2 b;void main(){a=b;gl_Position=vec4(b*2.-vec2(1),1,1);}", "precision mediump float;varying vec2 a;uniform sampler2D c;uniform vec2 d,e;void main(){vec4 f,g,h,i,j,k,l,m,n,o,p,q,r,s,t;f=texture2D(c,a);g=texture2D(c,a-d);h=texture2D(c,a+d);i=texture2D(c,a-2.*d);j=texture2D(c,a+2.*d);k=texture2D(c,a-3.*d);l=texture2D(c,a+3.*d);m=vec4(0);n=vec4(1);o=.8521*max(m,n-.7*abs(g-f));p=.8521*max(m,n-.7*abs(h-f));q=.5273*max(m,n-2.*abs(i-f));r=.5273*max(m,n-2.*abs(j-f));s=.2369*max(m,n-2.*abs(k-f));t=.2369*max(m,n-2.*abs(l-f));f+=o*g+p*h+q*i+r*j+s*k+t*l;gl_FragColor=f/(o+p+q+r+s+t+1.);gl_FragColor.a=e.x*gl_FragColor.a+e.y;}");
    this.We = 0;
    a.bindAttribLocation(this.handle, this.We, "b");
    this.attributes.uv = this.We++;
    a.useProgram(this.handle);
    for (var b = a.getProgramParameter(this.handle, 35718), c = 0, e = 0; e < b; ++e) {
        var f = a.getActiveUniform(this.handle, e);
        if (f) {
            var h = eka[f.name];
            if (h) {
                var k = a.getUniformLocation(this.handle, f.name)
                    , f = f.type;
                35678 == f || 35680 == f ? (f = new QX(a,f,k,c++),
                    a.uniform1i(k, f.Fu),
                    this.gu[h] = f) : this.Vr[h] = new PX(a,f,k)
            }
        }
    }
};
u(dY, OX);
var eka = {
    c: "mainTex",
    d: "duv",
    e: "alphaScaleOffset"
};
var eY = function(a) {
    OX.call(this, a, "precision mediump float;varying vec2 a;attribute vec2 b;void main(){a=b;gl_Position=vec4(b*2.-vec2(1),1,1);}", "precision mediump float;varying vec2 a;uniform sampler2D c;uniform vec3 d,e;void main(){vec4 f,i;f=texture2D(c,a);float g,h;g=.5*(f.x+f.y);h=.5*(f.z+f.w);i=vec4(d*g+e*h,g+h);gl_FragColor=2.*sqrt(i);gl_FragColor.xyz=vec3(1)-gl_FragColor.xyz;}");
    this.We = 0;
    a.bindAttribLocation(this.handle, this.We, "b");
    this.attributes.uv = this.We++;
    a.useProgram(this.handle);
    for (var b = a.getProgramParameter(this.handle, 35718), c = 0, e = 0; e < b; ++e) {
        var f = a.getActiveUniform(this.handle, e);
        if (f) {
            var h = fka[f.name];
            if (h) {
                var k = a.getUniformLocation(this.handle, f.name)
                    , f = f.type;
                35678 == f || 35680 == f ? (f = new QX(a,f,k,c++),
                    a.uniform1i(k, f.Fu),
                    this.gu[h] = f) : this.Vr[h] = new PX(a,f,k)
            }
        }
    }
};
u(eY, OX);
var fka = {
    c: "tex",
    d: "color0",
    e: "color1"
};
var fY = function(a) {
    OX.call(this, a, "precision mediump float;varying vec2 a;attribute vec2 b;void main(){a=b;gl_Position=vec4(b*2.-vec2(1),1,1);}", "precision mediump float;varying vec2 a;void main(){gl_FragColor=vec4(0,-10000,0,0);}");
    this.We = 0;
    a.bindAttribLocation(this.handle, this.We, "b");
    this.attributes.uv = this.We++;
    a.useProgram(this.handle);
    for (var b = a.getProgramParameter(this.handle, 35718), c = 0, e = 0; e < b; ++e) {
        var f = a.getActiveUniform(this.handle, e);
        if (f) {
            var h = gka[f.name];
            if (h) {
                var k = a.getUniformLocation(this.handle, f.name)
                    , f = f.type;
                35678 == f || 35680 == f ? (f = new QX(a,f,k,c++),
                    a.uniform1i(k, f.Fu),
                    this.gu[h] = f) : this.Vr[h] = new PX(a,f,k)
            }
        }
    }
};3
u(fY, OX);
var gka = {};
var gY = function(a) {
    OX.call(this, a, "precision mediump float;varying vec2 a;attribute vec2 b;void main(){a=b;gl_Position=vec4(b*2.-vec2(1),1,1);}", "precision mediump float;varying vec2 a;uniform sampler2D c,d;uniform vec4 e;void main(){vec2 f=a*2.-vec2(1);float g,h;g=smoothstep(.2,5.,dot(f,f));h=texture2D(c,a*e.xy+e.zw).w;vec3 i=texture2D(d,a).xyz;i*=1.-g;gl_FragColor.xyz=abs(i-.05*h);gl_FragColor.w=1.;}");
    this.We = 0;
    a.bindAttribLocation(this.handle, this.We, "b");
    this.attributes.uv = this.We++;
    a.useProgram(this.handle);
    for (var b = a.getProgramParameter(this.handle, 35718), c = 0, e = 0; e < b; ++e) {
        var f = a.getActiveUniform(this.handle, e);
        if (f) {
            var h = hka[f.name];
            if (h) {
                var k = a.getUniformLocation(this.handle, f.name)
                    , f = f.type;
                35678 == f || 35680 == f ? (f = new QX(a,f,k,c++),
                    a.uniform1i(k, f.Fu),
                    this.gu[h] = f) : this.Vr[h] = new PX(a,f,k)
            }
        }
    }
};
u(gY, OX);
var hka = {
    c: "grainTex",
    d: "mainTex",
    e: "grainScaleOffset"
};
var hY = function(a) {
    OX.call(this, a, "precision mediump float;attribute vec2 a;uniform sampler2D b;uniform mat4 c;void main(){vec4 d=texture2D(b,a);gl_Position=c*vec4(d.xyz,1);gl_PointSize=1.+min(1./gl_Position.w,64.);}", "precision mediump float;uniform float d;void main(){vec2 a=2.*(gl_PointCoord-vec2(.5));float e=1.-smoothstep(0.,1.,dot(a,a));gl_FragColor=vec4(d*e);}");
    this.We = 0;
    a.bindAttribLocation(this.handle, this.We, "a");
    this.attributes.uv = this.We++;
    a.useProgram(this.handle);
    for (var b = a.getProgramParameter(this.handle, 35718), c = 0, e = 0; e < b; ++e) {
        var f = a.getActiveUniform(this.handle, e);
        if (f) {
            var h = ika[f.name];
            if (h) {
                var k = a.getUniformLocation(this.handle, f.name)
                    , f = f.type;
                35678 == f || 35680 == f ? (f = new QX(a,f,k,c++),
                    a.uniform1i(k, f.Fu),
                    this.gu[h] = f) : this.Vr[h] = new PX(a,f,k)
            }
        }
    }
};
u(hY, OX);
var ika = {
    b: "positionTex",
    c: "worldViewProj",
    d: "density"
};
var iY = function(a) {
    OX.call(this, a, "precision mediump float;varying vec2 a;attribute vec2 b;uniform float c;void main(){a=b*vec2(1,c);gl_Position=vec4(a*2.-vec2(1),1,1);}", "precision mediump float;varying vec2 a;uniform sampler2D d,e,f;uniform vec2 g,h;uniform vec3 i,j,k,l,m,n;const float o=32.;const float p=.5/(o*(o-1.));const float q=o/(o-1.);const float r=(o-1.)/(o*o);const float s=o;const float t=1./o;vec3 F(vec3 u){float v=p+floor(u.z)*t;return texture2D(f,vec2(u.x,v+fract(u.y*q)*r)).xyz;}vec3 G(vec3 u){u.z*=o;vec3 v,w,x,A,B,C,D,E;v=u*.03-g.x*vec3(.03,.05,.07);w=F(v);x=F(v+vec3(0,0,1));A=2.*mix(w,x,fract(v.z))-vec3(1);B=u*.15+g.x*vec3(.01,.02,.03);C=F(B);D=F(B+vec3(0,0,1));E=2.*mix(C,D,fract(B.z))-vec3(1);return 8.*A+5.*E+m;}vec3 H(vec4 u,vec3 v,vec3 w){vec3 x,B;x=u.xyz-v;float A=dot(x,x);B=x/(1.+A*A);B*=1.5*max(0.,dot(x,w));return B;}vec3 I(vec4 u,vec3 v,float w){vec3 x,A;x=u.xyz-v;A=(1.-smoothstep(0.,.5,u.w))*normalize(x);return A*w;}void main(){vec4 u,w;u=texture2D(d,a);float v,B,C,D;v=texture2D(e,a+h).w;w=texture2D(e,a);vec3 x,A,E;x=i-w.w*j;A=k-w.w*l;B=n.x;C=n.y;D=n.z;if(v<C)u=vec4(x+B*w.xyz,0);u.xyz+=H(u,x,j)+H(u,A,l)+I(u,x,D);E=G(u.xyz);u.xyz+=g.y*30.*.002*E;u.w+=g.y;if(u.w>2.+4.*w.w)u.y=-1e4;gl_FragColor=u;}");
    this.We = 0;
    a.bindAttribLocation(this.handle, this.We, "b");
    this.attributes.uv = this.We++;
    a.useProgram(this.handle);
    for (var b = a.getProgramParameter(this.handle, 35718), c = 0, e = 0; e < b; ++e) {
        var f = a.getActiveUniform(this.handle, e);
        if (f) {
            var h = jka[f.name];
            if (h) {
                var k = a.getUniformLocation(this.handle, f.name)
                    , f = f.type;
                35678 == f || 35680 == f ? (f = new QX(a,f,k,c++),
                    a.uniform1i(k, f.Fu),
                    this.gu[h] = f) : this.Vr[h] = new PX(a,f,k)
            }
        }
    }
};
u(iY, OX);
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
var jY = function(a) {
    this.length = a.length || a;
    for (var b = 0; b < this.length; b++)
        this[b] = a[b] || 0
};
jY.prototype.BYTES_PER_ELEMENT = 4;
jY.prototype.set = function(a, b) {
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
var kY = function(a) {
    this.length = a.length || a;
    for (var b = 0; b < this.length; b++)
        this[b] = a[b] || 0
};
kY.prototype.BYTES_PER_ELEMENT = 8;
kY.prototype.set = function(a, b) {
    b = b || 0;
    for (var c = 0; c < a.length && b + c < this.length; c++)
        this[b + c] = a[c]
}
;
kY.prototype.toString = Array.prototype.join;
if ("undefined" == typeof Float64Array) {
    try {
        kY.BYTES_PER_ELEMENT = 8
    } catch (a) {}
    kY.prototype.BYTES_PER_ELEMENT = kY.prototype.BYTES_PER_ELEMENT;
    kY.prototype.set = kY.prototype.set;
    kY.prototype.toString = kY.prototype.toString;
    ta("Float64Array", kY, void 0)
}
;var createVec3 = function(a, b, c) {
    var e = new Float32Array(3);
    e[0] = a;
    e[1] = b;
    e[2] = c;
    return e
}
    , vec3Add = function(a, b, c) {
        c[0] = a[0] + b[0];
        c[1] = a[1] + b[1];
        c[2] = a[2] + b[2];
        return c
    }
    , vec3Sub = function(a, b, c) {
        c[0] = a[0] - b[0];
        c[1] = a[1] - b[1];
        c[2] = a[2] - b[2];
        return c
    }
    , vec3Mul = function(a, b, c) {
        c[0] = a[0] * b;
        c[1] = a[1] * b;
        c[2] = a[2] * b;
        return c
    }
    , vec3Div = function(a, b) {
        var c = a[0]
            , e = a[1]
            , f = a[2]
            , c = 1 / Math.sqrt(c * c + e * e + f * f);
        b[0] = a[0] * c;
        b[1] = a[1] * c;
        b[2] = a[2] * c;
        return b
    }
    , qY = function(a, b, c) {
        var e = a[0]
            , f = a[1];
        a = a[2];
        var h = b[0]
            , k = b[1];
        b = b[2];
        c[0] = f * b - a * k;
        c[1] = a * h - e * b;
        c[2] = e * k - f * h;
        return c
    };
var rY = function(a, b, c) {
    a[b] = c[0];
    a[b + 4] = c[1];
    a[b + 8] = c[2];
    a[b + 12] = c[3];
    return a
}
    , sY = [new Float64Array(4), new Float64Array(4), new Float64Array(4)];
/// Get audio infomation
var AudioInfo = function(length) {
    this.raw = new Float32Array(length);
    this.bL = new Float32Array(length);
    this.S$ = new Float32Array(length)
};
AudioInfo.prototype.syb = function(a, b, c) {
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
AudioInfo.prototype.UAb = function(a) {
    for (var b = 0; b < this.S$.length; ++b)
        this.S$[b] = this.raw[b];
    a.getFloatFrequencyData(this.raw);
    for (b = 0; b < this.raw.length; ++b) {
        a = this.S$[b];
        var c = Math.max(0, 20 * Math.pow(10, .05 * this.raw[b]));
        this.raw[b] = c + (c > a ? .1 : .8) * (a - c)
    }
    this.syb(this.raw, this.bL, 8);
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
 * @param a AnalyserNode {@link AnalyserNode}
 * @param b origin {@link WebGLRenderingContext}
 * @param c canvas {@link HTMLCanvasElement}
 * @param e modified {@link WebGLRenderingContext}
 * @constructor
 */
var Particles = function(a, b, c, e) {
    /**
     * {@link AnalyserNode}
     */
    this.analyserNode = a;
    // Canvas
    this.canvas = c;
    // Modified webgl context MX
    this.glContext = e;
    // Audio input.
    this.audioInfo = new AudioInfo(256);
    a = 100 * Math.random();
    b = 1;
    if (320 < this.canvas.width || 320 < this.canvas.height)
        b = 2;
    // scaled width
    this.width = Math.floor(this.canvas.width / b);
    // scaled height
    this.height = Math.floor(this.canvas.height / b);
    // ratio
    this.ratio = this.width / this.height;
    this.ISa = this.glContext.createProgram(dY);
    this.glContext.createProgram(cY);
    this.KUa = this.glContext.createProgram(eY);
    this.Kab = this.glContext.createProgram(fY);
    this.Oib = this.glContext.createProgram(gY);
    this.Ulb = this.glContext.createProgram(hY);
    this.rBb = this.glContext.createProgram(iY);
    this.qCb = this.vVa(32); // noiseTex
    b = new Uint8Array(16384);
    for (c = 0; c < b.length; ++c)
        b[c] = Math.floor(255 * Math.random());
    // texture
    this.m6 = this.glContext.createTexture(128, 128, {
        filter: 9728, // NEAREST
        data: b,
        type: 5121, // UNSIGNED_BYTE
        format: 6406, // ALPHA
        Gn: 10497 // REPEAT
    });
    b = {
        filter: 9729, // LINEAR
        Gn: 33071 // CLAMP_TO_EDGE
    };
    this.ZT = this.glContext.createFramebuffer(this.width, this.height, b, !1);
    this.Lja = this.glContext.createFramebuffer(this.width, this.height, b, !1);
    this.dia = this.glContext.createFramebuffer(this.width, this.height, b, !1);
    this.Ji = this.glContext.e0(2, 35044, new Float32Array([0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0]));// Create Buffer
    this.jB = 60 * Math.random();
    this.UY = null;
    this.Jt = new Float32Array(3);
    this.pna = createVec3(0, 0, 0);
    this.dI = new Float32Array(80);
    this.xQ = 0;
    this.eA = .5;
    this.iBa = !1;
    this.sU = this.tU = 0;
    b = new uY(this.glContext,512,1024);
    this.Si = [new vY(this.glContext,b,0,20,a), new vY(this.glContext,b,20,200,a + 50 + 50 * Math.random())];
    this.glContext.colorMask(!0, !0, !0, !0);
    this.glContext.depthMask(!1);
    this.glContext.disable(2929); // DEPTH_TEST
    this.glContext.disable(2884); // CULL_FACE
    this.glContext.disable(3042); // BLEND
    this.glContext.Lx(this.Kab);
    this.glContext.$u("uv", this.Ji);
    for (c = 0; c < this.Si.length; ++c)
        this.glContext.bindFramebuffer(this.Si[c].Tt),
            this.glContext.Wn(4, 0, this.Ji.Qt),
            this.glContext.bindFramebuffer(this.Si[c].gV),
            this.glContext.Wn(4, 0, this.Ji.Qt);
    this.Wab()
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
Particles.prototype.vVa = function(a) {
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
var xY = function(a, b, c) {
    var e = 2 * (Math.cos(.51 * a) + Math.sin(.29 * a))
        , f = 3 * Math.cos(a + Math.sin(.47 * a)) - 2 * Math.sin(.79 * a);
    a = .5 + .5 * (Math.sin(a + Math.cos(.31 * a)) * Math.cos(3.7 * a) - Math.sin(2.1 * a));
    a = b + a * (c - b);
    return createVec3(a * Math.cos(f) * Math.cos(e), a * Math.sin(e), a * Math.sin(f) * Math.cos(e))
};
// d = wY.prototype;
Particles.prototype.Nma = function(a, b) {
    a %= 6;
    a = createVec3(Math.max(0, Math.min(1, Math.abs(a - 3) - 1)), Math.max(0, Math.min(1, 2 - Math.abs(a - 2))), Math.max(0, Math.min(1, 2 - Math.abs(a - 4))));
    a[0] = 1 - b + b * a[0];
    a[1] = 1 - b + b * a[1];
    a[2] = 1 - b + b * a[2];
    return a
}
;
Particles.prototype.update = function(a) {
    var b = 2 / 60;
    this.UY && (b = (a - this.UY) / 1E3,
        b = Math.min(.2, b));
    this.UY = a;
    a = this.sBb(b);
    this.audioInfo.UAb(this.analyserNode);
    this.jB += a;
    this.lBb(a);
    this.HAb();
    this.tc(a)
}
;
Particles.prototype.sBb = function(a) {
    for (var b = this.dI.length - 1; 0 < b; --b)
        this.dI[b] = this.dI[b - 1];
    this.dI[0] = 1E3 * a;
    this.xQ = Math.min(30, this.xQ + 1);
    for (b = a = 0; b < this.xQ; ++b)
        a += this.dI[b];
    a /= this.xQ;
    36 < a ? (++this.tU,
        this.sU = 0) : (++this.sU,
        this.tU = 0);
    30 < this.tU && (this.iBa = !0,
        this.tU = 0,
        this.eA = Math.max(.1, this.eA - Math.min(.1, (a - 36) / 200)));
    !this.iBa && 30 < this.sU && (this.sU = 0,
        this.eA = Math.min(1, this.eA + .01));
    return a / 1E3
}
;
Particles.prototype.lBb = function(a) {
    for (var b = 0; b < this.Si.length; ++b)
        this.Si[b].update(a, this.audioInfo.bL);
    this.glContext.colorMask(!0, !0, !0, !0);
    this.glContext.depthMask(!1);
    this.glContext.disable(2929);
    this.glContext.disable(2884);
    this.glContext.disable(3042);
    this.glContext.Lx(this.rBb);
    this.glContext.bindTexture("noiseTex", this.qCb);
    this.glContext.Dg("time", this.jB, a);
    this.glContext.Dg("drift", 60 * Math.sin(this.jB) * a, 150 * a, 120 * a);
    this.glContext.Dg("randomTexOffset", Math.random(), Math.random());
    for (b = 0; b < this.Si.length; ++b) {
        var c = this.Si[b]
            , e = c.czb()
            , f = 3 * e
            , h = 12 * f * f * f
            , k = c.gV;
        c.gV = c.Tt;
        c.Tt = k;
        k = Math.floor(this.eA * c.Tt.height) / c.Tt.height;
        this.glContext.bindFramebuffer(c.Tt);
        this.glContext.bindTexture("randomTex", c.maa);
        this.glContext.bindTexture("positionTex", c.gV.jq);
        this.glContext.$u("uv", this.Ji);
        this.glContext.Dg("emitterSize", .01 + f, h, a * e * 30);
        this.glContext.Dg("pos0", this.Si[b].position);
        this.glContext.Dg("vel0", this.Si[b].gha);
        this.glContext.Dg("pos1", this.Si[1 - b].position);
        this.glContext.Dg("vel1", this.Si[1 - b].gha);
        this.glContext.Dg("quality", k);
        this.glContext.Wn(4, 0, this.Ji.Qt) // drawArrays
    }
}
;
Particles.prototype.Tlb = function() {
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
    h = this.pna;
    e = sY[0];
    vec3Sub(this.Jt, h, e);
    vec3Div(e, e);
    e[3] = 0;
    f = sY[1];
    qY(e, [0, 1, 0], f);
    vec3Div(f, f);
    f[3] = 0;
    var k = sY[2];
    qY(f, e, k);
    vec3Div(k, k);
    k[3] = 0;
    e[0] = -e[0];
    e[1] = -e[1];
    e[2] = -e[2];
    rY(a, 0, f);
    rY(a, 1, k);
    rY(a, 2, e);
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
    this.glContext.bindFramebuffer(this.ZT);
    this.glContext.clearColor(0, 0, 0, 0);
    this.glContext.clear(16384);
    this.glContext.enable(3042);
    this.glContext.blendEquation(32774);
    this.glContext.blendFunc(1, 1);
    this.glContext.Lx(this.Ulb);
    this.glContext.Dg("worldViewProj", c);
    c = this.canvas.height / 450 / (256 * this.eA);
    c = Math.max(c, 2 / 255);
    this.glContext.Dg("density", c);
    for (c = 0; 2 > c; ++c)
        a = this.Si[c],
            this.glContext.bindTexture("positionTex", a.Tt.jq),
            this.glContext.$u("uv", a.hha),
            a = Math.floor(this.eA * a.Tt.height) * a.Tt.width,
            e = Math.floor(a / 2),
            0 == c ? (this.glContext.colorMask(!0, !1, !1, !1),
                this.glContext.Wn(0, 0, e),
                this.glContext.colorMask(!1, !0, !1, !1)) : (this.glContext.colorMask(!1, !1, !0, !1),
                this.glContext.Wn(0, 0, e),
                this.glContext.colorMask(!1, !1, !1, !0)),
            this.glContext.Wn(0, e, a - e);
    this.glContext.colorMask(!0, !0, !0, !0);
    this.glContext.disable(3042);
    this.glContext.bindFramebuffer(this.Lja);
    this.glContext.Lx(this.KUa);
    this.glContext.bindTexture("tex", this.ZT.jq);
    this.glContext.$u("uv", this.Ji);
    this.glContext.Dg("color0", this.Nma(.05 * this.jB, .85));
    this.glContext.Dg("color1", this.Nma(.05 * this.jB + 2, .85));
    this.glContext.Wn(4, 0, this.Ji.Qt)
}
;
// init component
Particles.prototype.tc = function() {
    this.Tlb();
    this.glContext.disable(3042); // GL_BLEND
    this.glContext.bindFramebuffer(this.ZT);
    this.glContext.Lx(this.ISa);
    this.glContext.bindTexture("mainTex", this.Lja.jq);
    this.glContext.$u("uv", this.Ji);
    this.glContext.Dg("duv", 1 / this.width, 0);
    this.glContext.Dg("alphaScaleOffset", 1, 0);
    this.glContext.Wn(4, 0, this.Ji.Qt);
    this.glContext.enable(3042);
    this.glContext.blendFunc(770, 771);
    this.glContext.bindFramebuffer(this.dia);
    this.glContext.bindTexture("mainTex", this.ZT.jq);
    this.glContext.$u("uv", this.Ji);
    this.glContext.Dg("duv", 0, 1 / this.height);
    this.glContext.Dg("alphaScaleOffset", .25, .75);
    this.glContext.Wn(4, 0, this.Ji.Qt);
    this.glContext.disable(3042);
    this.glContext.bindFramebuffer(null);
    this.glContext.Lx(this.Oib);
    this.glContext.bindTexture("mainTex", this.dia.jq);
    this.glContext.bindTexture("grainTex", this.m6);
    this.glContext.$u("uv", this.Ji);
    this.glContext.Dg("grainScaleOffset", this.canvas.width / this.m6.width, this.canvas.height / this.m6.height, Math.random(), Math.random());
    this.glContext.Wn(4, 0, this.Ji.Qt)
}
;
Particles.prototype.Wab = function() {
    this.Jt = new Float32Array(3);
    vec3Add(this.Si[0].position, this.Si[1].position, this.Jt);
    vec3Mul(this.Jt, .5, this.Jt)
}
;
Particles.prototype.HAb = function() {
    var a = this.Si[0].position
        , b = this.Si[1].position
        , c = .3 * this.jB;
    this.pna = createVec3(4.4 * Math.cos(c), 0, 4.4 * Math.sin(c));
    c = new Float32Array(3);
    vec3Add(a, b, c);
    vec3Mul(c, .5, c);
    vec3Mul(c, .05, c);
    vec3Mul(this.Jt, .95, this.Jt);
    vec3Add(this.Jt, c, this.Jt)
}
;
var uY = function(a, b, c) {
    this.mN = b;
    this.kN = c;
    this.y9 = b * c;
    this.maa = this.jVa(a);
    this.hha = this.tVa(a)
};
uY.prototype.jVa = function(a) {
    for (var b = this.mN, c = this.kN, e = new Float32Array(b * c * 4), f = Math.floor(e.length / 8), h = 0; h < f; ) {
        var k, m, p;
        do
            k = 2 * Math.random() - 1,
                m = 2 * Math.random() - 1,
                p = 2 * Math.random() - 1;
        while (1 < k * k + m * m + p * p);e[h++] = k;
        e[h++] = m;
        e[h++] = p;
        e[h++] = Math.random()
    }
    for (var r = [-1, 1, 1, 1, -1, 1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, -1, -1, -1, -1, -1], A = 0; f < e.length; )
        for (k = e[A++],
                 m = e[A++],
                 p = e[A++],
                 A++,
                 h = 0; h < r.length; )
            e[f++] = k * r[h++],
                e[f++] = m * r[h++],
                e[f++] = p * r[h++],
                e[f++] = Math.random();
    return a.createTexture(b, c, {
        filter: 9728,
        data: e,
        type: 5126,
        Gn: 10497
    })
}
;
uY.prototype.tVa = function(a) {
    for (var b = new Float32Array(2 * this.y9), c = 0, e = 0; e < this.kN; ++e)
        for (var f = 0; f < this.mN; ++f) {
            var h = f / this.mN
                , k = e / this.kN;
            b[c++] = h;
            b[c++] = k
        }
    return a.e0(2, 35044, b)
}
;
var vY = function(a, b, c, e, f) {
    this.doa = c;
    this.tfa = this.RV = 0;
    this.MX = f;
    this.position = new Float32Array(3);
    this.gha = new Float32Array(3);
    this.TE = [new Float32Array(e - c), new Float32Array(e - c)];
    this.y9 = b.y9;
    this.maa = b.maa;
    c = {
        type: 5126,
        filter: 9728
    };
    this.Tt = a.createFramebuffer(b.mN, b.kN, c, !1);
    this.gV = a.createFramebuffer(b.mN, b.kN, c, !1);
    this.hha = b.hha;
    this.sMa(0)
};
vY.prototype.update = function(a, b) {
    this.xBb(b);
    this.sMa(a)
}
;
vY.prototype.sMa = function(a) {
    var b = this.position
        , c = xY(this.MX + .01, 1.5, 3)
        , e = b[0] - c[0]
        , f = b[1] - c[1]
        , b = b[2] - c[2]
        , e = .01 / (.001 + Math.sqrt(e * e + f * f + b * b))
        , e = .3 * Math.log(1 + 5 * e);
    this.MX += this.tfa * a * e;
    a = xY(this.MX, 1.5, 3);
    vec3Sub(a, this.position, this.gha);
    this.position = a
}
;
vY.prototype.xBb = function(a) {
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
vY.prototype.czb = function() {
    return .05 * this.RV
}
;
/// END OF PARTICLE EFFECT

/// AnalyserNode
var EY = function() {
    this.Azb = Date.now()
};
EY.prototype.jaa = function(a) {
    if (0 > a || 1 < a)
        return 0;
    a = .25 > a ? a / .25 : 1 - (a - .25) / .75;
    return 3 * a * a - 2 * a * a * a
}
;
EY.prototype.getFloatFrequencyData = function(a) {
    var b = (Date.now() - this.Azb) / 1E3 * .8 % 1
        , c = 0
        , e = 0;
    .5 > b ? c = this.jaa(2 * b) : e = this.jaa(2 * (b - .5));
    for (var b = a.length / 16, f = Math.log(10), h = 0; h < a.length; ++h) {
        var k = (.2 + .5 * e + c * this.jaa(h / b)) / 1.7;
        a[h] = 0 < k ? 20 * Math.log(k) / f : -1E3
    }
}
;


