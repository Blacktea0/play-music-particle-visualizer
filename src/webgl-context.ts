export class Uniform {
  readonly type: GLenum
  readonly location: WebGLUniformLocation
  readonly isMatrix: boolean
  readonly setter: ((location: WebGLUniformLocation, x: GLfloat) => void) |
    ((location: WebGLUniformLocation, x: Float32List) => void) |
    ((location: WebGLUniformLocation, v: Int32List) => void) |
    ((location: WebGLUniformLocation, transpose: boolean, value: Float32List) => void)

  constructor (gl: WebGLRenderingContext, type: GLenum, location: WebGLUniformLocation) {
    this.type = type
    this.location = location
    this.isMatrix = false
    switch (type) {
      /* eslint-disable @typescript-eslint/unbound-method */
      case WebGLRenderingContext.FLOAT:
        this.setter = gl.uniform1f
        break
      case WebGLRenderingContext.FLOAT_VEC2:
        this.setter = gl.uniform2fv
        break
      case WebGLRenderingContext.FLOAT_VEC3:
        this.setter = gl.uniform3fv
        break
      case WebGLRenderingContext.FLOAT_VEC4:
        this.setter = gl.uniform4fv
        break
      case WebGLRenderingContext.BOOL:
      case WebGLRenderingContext.INT:
        this.setter = gl.uniform1i
        break
      case WebGLRenderingContext.BOOL_VEC2:
      case WebGLRenderingContext.INT_VEC2:
        this.setter = gl.uniform2iv
        break
      case WebGLRenderingContext.BOOL_VEC3:
      case WebGLRenderingContext.INT_VEC3:
        this.setter = gl.uniform3iv
        break
      case WebGLRenderingContext.BOOL_VEC4:
      case WebGLRenderingContext.INT_VEC4:
        this.setter = gl.uniform4iv
        break
      case WebGLRenderingContext.FLOAT_MAT2:
        this.setter = gl.uniformMatrix2fv
        this.isMatrix = true
        break
      case WebGLRenderingContext.FLOAT_MAT3:
        this.setter = gl.uniformMatrix3fv
        this.isMatrix = true
        break
      case WebGLRenderingContext.FLOAT_MAT4:
        this.setter = gl.uniformMatrix4fv
        this.isMatrix = true
        break
      case WebGLRenderingContext.SAMPLER_2D:
      case WebGLRenderingContext.SAMPLER_CUBE:
        this.setter = gl.uniform1i
        break
      default:
        throw Error('Unrecognized uniform type: ' + type)
      /* eslint-enable @typescript-eslint/unbound-method */
    }
  }
}

export class Sampler extends Uniform {
  readonly textureX: GLint

  constructor (gl: WebGLRenderingContext, type: GLenum, location: WebGLUniformLocation, textureX: number) {
    super(gl, type, location)
    this.textureX = textureX
  }
}

export class ShaderProgram {
  readonly handle: WebGLProgram
  attribCount: number = 0
  readonly attribMapping: Record<string, GLint> = {}
  readonly samplerMapping: Record<string, Sampler> = {}
  readonly uniformMapping: Record<string, Uniform> = {}

  constructor (gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
    const program = gl.createProgram()
    if (program == null) {
      throw Error('Failed to create program')
    }
    this.handle = program
    const vertexShader = gl.createShader(WebGLRenderingContext.VERTEX_SHADER)
    if (vertexShader == null) {
      throw Error('Failed to create vertex shader')
    }
    const fragmentShader = gl.createShader(WebGLRenderingContext.FRAGMENT_SHADER)
    if (fragmentShader == null) {
      throw Error('Failed to create fragment shader')
    }
    gl.shaderSource(vertexShader, vsSource)
    gl.compileShader(vertexShader)
    if (gl.getShaderParameter(vertexShader, WebGLRenderingContext.COMPILE_STATUS) == null) {
      const log = gl.getShaderInfoLog(vertexShader)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      throw Error('Error compiling program:\n' + log)
    }
    gl.shaderSource(fragmentShader, fsSource)
    gl.compileShader(fragmentShader)
    if (gl.getShaderParameter(fragmentShader, WebGLRenderingContext.COMPILE_STATUS) == null) {
      const log = gl.getShaderInfoLog(fragmentShader)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      throw Error('Error compiling program:\n' + log)
    }
    gl.attachShader(this.handle, vertexShader)
    gl.attachShader(this.handle, fragmentShader)
    gl.linkProgram(this.handle)
    if (gl.getProgramParameter(this.handle, WebGLRenderingContext.LINK_STATUS) == null) {
      throw Error('Error linking program:\n' + gl.getProgramInfoLog(this.handle))
    }
  }

  protected initVariableMapping (gl: WebGLRenderingContext, reverseRenaming: {[k in string]: string}) {
    gl.useProgram(this.handle)
    const activeAttributes = gl.getProgramParameter(this.handle, WebGLRenderingContext.ACTIVE_ATTRIBUTES)
    for (let i = 0; i < activeAttributes; i++) {
      const attrib = gl.getActiveAttrib(this.handle, i)
      if (attrib == null) {
        throw Error('Failed to get active attribute')
      }
      gl.bindAttribLocation(this.handle, i, attrib.name)
      this.attribMapping[reverseRenaming[attrib.name]] = this.attribCount++
    }
    const activeUniforms = gl.getProgramParameter(this.handle, WebGLRenderingContext.ACTIVE_UNIFORMS)
    for (let i = 0; i < activeUniforms; i++) {
      const uniform = gl.getActiveUniform(this.handle, i)
      if (uniform == null) {
        throw Error('Failed to get active uniform')
      }
      gl.getUniformLocation(this.handle, uniform.name)
      const type = uniform.type
      const name = reverseRenaming[uniform.name]
      let samplerCount = 0;
      if (type === WebGLRenderingContext.SAMPLER_2D || type === WebGLRenderingContext.SAMPLER_CUBE) {
        const sampler = new Sampler(gl, type, location, samplerCount++)
        gl.uniform1i(location, sampler.textureX)
        this.samplerMapping[name] = sampler
      } else {
        this.uniformMapping[name] = new Uniform(gl, type, location)
      }
    }
  }

  getUniform (name: string): Uniform {
    const uniform = this.uniformMapping[name]
    if (uniform == null) {
      throw Error('No uniform named: ' + name)
    }
    return uniform
  }

  getSampler (name: string): Sampler {
    const sampler = this.samplerMapping[name]
    if (sampler == null) {
      throw Error('No sampler named: ' + name)
    }
    return sampler
  }
}

export type ShaderProgramConstructor = new (gl: WebGLRenderingContext) => ShaderProgram

export class Texture {
  readonly gl: WebGLRenderingContext
  readonly width: number
  readonly height: number
  readonly config: TextureOptions
  readonly handle: WebGLTexture
  private readonly type: number
  private readonly wrap: number
  private readonly filter: number
  private readonly format: number

  constructor (gl: WebGLRenderingContext, width: number, height: number, config: TextureOptions) {
    this.gl = gl
    this.width = width
    this.height = height
    this.config = config
    const texture = gl.createTexture()
    if (texture == null) {
      throw Error('Failed to create texture')
    }
    this.handle = texture
    this.type = config.type ?? WebGLRenderingContext.UNSIGNED_BYTE
    this.wrap = config.wrap ?? WebGLRenderingContext.REPEAT
    this.filter = config.filter ?? WebGLRenderingContext.LINEAR
    this.format = config.format ?? WebGLRenderingContext.RGBA
    const data = config.data ?? null
    gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.handle)
    gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, this.format,
      width, height, 0, this.format, this.type, data)
    gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, this.filter)
    gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, this.filter)
    gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_S, this.wrap)
    gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_T, this.wrap)
  }
}

export class TextureOptions {
  readonly type: GLenum | null = null
  readonly wrap: GLenum | null = null
  readonly filter: GLenum | null = null
  readonly format: GLenum | null = null
  readonly data: Uint8Array | null = null

  constructor (data: Uint8Array) {
    this.data = data
  }
}

export class Framebuffer {
  readonly depthTexture: Texture | null = null
  readonly colorTexture: Texture | null = null
  readonly handle: WebGLFramebuffer
  readonly width: number
  readonly height: number

  constructor (gl: WebGLRenderingContext, width: number, height: number,
    colorConfig: TextureOptions | null, depthConfig: TextureOptions | null) {
    const framebuffer = gl.createFramebuffer()
    if (framebuffer == null) {
      throw Error('Failed to framebuffer')
    }
    this.handle = framebuffer
    this.width = width
    this.height = height
    gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, this.handle)
    if (colorConfig != null) {
      this.colorTexture = new Texture(gl, width, height, colorConfig)
      gl.framebufferTexture2D(WebGLRenderingContext.FRAMEBUFFER,
        WebGLRenderingContext.COLOR_ATTACHMENT0,
        WebGLRenderingContext.TEXTURE_2D,
        this.colorTexture.handle, 0)
    }
    if (depthConfig != null) {
      this.depthTexture = new Texture(gl, width, height, depthConfig)
      gl.framebufferTexture2D(WebGLRenderingContext.FRAMEBUFFER,
        WebGLRenderingContext.DEPTH_ATTACHMENT,
        WebGLRenderingContext.TEXTURE_2D,
        this.depthTexture.handle, 0)
    }
    gl.bindFramebuffer(36160, null)
  }
}

export class Buffer {
  handle: WebGLBuffer
  dimension: number
  vertexCount: number
  usage: GLenum

  constructor (gl: WebGLRenderingContext, dimension: number, usage: GLenum, data: Float32Array) {
    const buffer = gl.createBuffer()
    if (buffer == null) {
      throw Error('Failed to create buffer')
    }
    this.handle = buffer
    this.dimension = dimension // Dimension
    this.vertexCount = data.length / dimension // Vertex num
    this.usage = usage // usage
    if (data.length % this.dimension !== 0) {
      throw Error('Number of elements is not a multiple of elementSize')
    }
    if (data.length !== this.dimension * this.vertexCount) {
      throw Error('Unexpected number of elements')
    }
    gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, this.handle)
    gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, data, this.usage)
  }
}

export class WebGLContext {
  canvas: HTMLCanvasElement
  gl: WebGLRenderingContext
  usingProgram: ShaderProgram | null
  bufferList: Buffer[]
  framebufferList: Framebuffer[]
  programList: ShaderProgram[]
  textureList: Texture[]

  constructor (canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
    this.canvas = canvas
    this.gl = gl
    this.usingProgram = null
    this.bufferList = []
    this.framebufferList = []
    this.programList = []
    this.textureList = []
  }

  close (): void {
    for (let i = 0; i < this.bufferList.length; ++i) {
      this.gl.deleteBuffer(this.bufferList[i].handle)
    }
    this.bufferList = []
    for (let i = 0; i < this.framebufferList.length; ++i) {
      const framebuffer = this.framebufferList[i]
      if (framebuffer.colorTexture != null) {
        this.gl.deleteTexture(framebuffer.colorTexture.handle)
      }
      if (framebuffer.depthTexture != null) {
        this.gl.deleteTexture(framebuffer.depthTexture.handle)
      }
      this.gl.deleteFramebuffer(framebuffer.handle)
    }
    this.framebufferList = []
    for (let i = 0; i < this.programList.length; ++i) {
      const shaderProgram = this.programList[i]
      const glShaders = this.gl.getAttachedShaders(shaderProgram.handle)
      if (glShaders != null) {
        for (let j = 0; j < glShaders.length; ++j) {
          this.gl.detachShader(shaderProgram.handle, glShaders[j])
          this.gl.deleteShader(glShaders[j])
        }
      }
      this.gl.deleteProgram(shaderProgram.handle)
    }
    this.programList = []
    for (let i = 0; i < this.textureList.length; ++i) {
      this.gl.deleteTexture(this.textureList[i].handle)
    }
    this.textureList = []
  }

  activateProgram (program: ShaderProgram): void {
    if (this.usingProgram !== program) {
      const oldAttribCount = this.usingProgram != null ? this.usingProgram.attribCount : 0
      const newAttribCount = program.attribCount
      if (oldAttribCount > newAttribCount) {
        for (let i = newAttribCount; i < oldAttribCount; ++i) {
          this.gl.disableVertexAttribArray(i)
        }
      } else {
        for (let i = oldAttribCount; i < newAttribCount; ++i) {
          this.gl.enableVertexAttribArray(i)
        }
      }
      this.gl.useProgram(program.handle)
      this.usingProgram = program
    }
  }

  bindTexture (name: string, texture: Texture): void {
    const sampler = this.usingProgram?.getSampler(name)
    if (sampler != null) {
      this.gl.activeTexture(WebGLRenderingContext.TEXTURE0 + sampler.textureX)
      this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, texture.handle)
    } else {
      throw Error('Texture ' + name + ' not found')
    }
  }

  createFramebuffer (width: number, height: number, colorConfig: TextureOptions, useDefault: boolean): Framebuffer {
    let depthConfig = null
    if (useDefault) {
      depthConfig = {
        type: WebGLRenderingContext.UNSIGNED_SHORT,
        wrap: WebGLRenderingContext.CLAMP_TO_EDGE,
        filter: WebGLRenderingContext.NEAREST,
        format: WebGLRenderingContext.DEPTH_COMPONENT,
        data: null
      }
    }
    const framebuffer = new Framebuffer(this.gl, width, height, colorConfig, depthConfig)
    this.framebufferList.push(framebuffer)
    return framebuffer
  }

  createTexture (width: number, height: number, config: TextureOptions): Texture {
    const texture = new Texture(this.gl, width, height, config)
    this.textureList.push(texture)
    return texture
  }

  bindAttributeBuffer (name: string, buffer: Buffer): void {
    const location = this.usingProgram?.attribMapping[name]
    if (location == null) {
      throw Error('No using program')
    }
    this.gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, buffer.handle)
    this.gl.vertexAttribPointer(location, buffer.dimension, WebGLRenderingContext.FLOAT, false, 0, 0)
  }

  drawArrays (mode: GLenum, first: GLint, count: GLsizei): void {
    this.gl.drawArrays(mode, first, count)
  }

  createBuffer (dimension: number, usage: GLenum, data: Float32Array): Buffer {
    const buffer = new Buffer(this.gl, dimension, usage, data)
    this.bufferList.push(buffer)
    return buffer
  }

  createProgram (constructor: ShaderProgramConstructor): ShaderProgram {
    const program = new constructor(this.gl)
    this.programList.push(program)
    return program
  }

  bindFramebuffer (framebuffer: Framebuffer): void {
    if (framebuffer != null) {
      this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, framebuffer.handle)
      this.gl.viewport(0, 0, framebuffer.width, framebuffer.height)
    } else {
      this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null)
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  blendColor (red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf): void {
    this.gl.blendColor(red, green, blue, alpha)
  }

  blendEquation (mode: GLenum): void {
    this.gl.blendEquation(mode)
  }

  blendEquationSeparate (modeRGB: GLenum, modeAlpha: GLenum): void {
    this.gl.blendEquationSeparate(modeRGB, modeAlpha)
  }

  blendFunc (sFactor: GLenum, dFactor: GLenum): void {
    this.gl.blendFunc(sFactor, dFactor)
  }

  blendFuncSeparate (srcRGB: GLenum, dstRGB: GLenum, srcAlpha: GLenum, dstAlpha: GLenum): void {
    this.gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha)
  }

  clear (mask: GLbitfield): void {
    this.gl.clear(mask)
  }

  clearColor (red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf): void {
    this.gl.clearColor(red, green, blue, alpha)
  }

  colorMask (red: boolean, green: boolean, blue: boolean, alpha: boolean): void {
    this.gl.colorMask(red, green, blue, alpha)
  }

  depthMask (flag: GLboolean): void {
    this.gl.depthMask(flag)
  }

  disable (cap: GLenum): void {
    this.gl.disable(cap)
  }

  enable (cap: GLenum): void {
    this.gl.enable(cap)
  }

  viewport (x: GLint, y: GLint, width: GLsizei, height: GLsizei): void {
    this.gl.viewport(x, y, width, height)
  }

  getExtension (name: string): any {
    return this.gl.getExtension(name)
  }

  getSupportedExtensions (): string[] | null {
    return this.gl.getSupportedExtensions()
  }

  setUniform (name: string | number, ...values: number[]): void {
    const uniform = this.usingProgram?.uniformMapping[name]
    if (uniform == null) {
      throw new Error(`No uniform named "${name}"`)
    }
    const gl = this.gl
    if (uniform.isMatrix) {
      uniform.setter.call(gl, uniform.location, false, values)
    } else {
      uniform.setter.call(gl, uniform.location, ...values)
    }
  }
}
