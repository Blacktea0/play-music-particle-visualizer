import {
  type Buffer,
  type Framebuffer,
  type ShaderProgram,
  type Texture,
  TextureOptions,
  type WebGLContext
} from './webgl-context'
import { AudioInfo } from './audio-info'
import { ParticleSystem } from './particle-system'
import { Cy, Dy, Ey, Fy, Gy, Hy, Iy } from './shader/shader-programs'
import { createVec3, vec3Mul, vec3Add, vec3Sub, normalizeVector, crossProduct, setMatrix4Column } from './utils'
import { ParticleTexture } from './particle-texture'
import { type FloatFrequencyDatasource } from './fadeout-datasource'

export class Particles {
  private readonly analyserNode: FloatFrequencyDatasource
  private readonly canvas: HTMLCanvasElement
  private readonly glContext: WebGLContext
  private readonly audioInfo: AudioInfo
  private readonly width: number
  private readonly height: number
  private readonly ratio: number
  private readonly particleUpdateProgram: ShaderProgram
  private readonly colorBlendProgram: ShaderProgram
  private readonly renderParticleSystemProgram: ShaderProgram
  private readonly finalRenderProgram: ShaderProgram
  private readonly alphaMaskProgram: ShaderProgram
  private readonly particleSimulationProgram: ShaderProgram
  private readonly noiseTexture: Texture
  private readonly grainTex: Texture
  private readonly particleRenderFramebuffer: Framebuffer
  private readonly colorBlendFramebuffer: Framebuffer
  private readonly alphaBlendFramebuffer: Framebuffer
  private readonly vertexBuffer: Buffer
  private time: number
  private previousTime: number | null
  private particleSystemCenterPosition: Float32Array
  private cameraPosition: Float32Array
  private readonly timeSamples: Float32Array
  private timeSamplesCount: number
  private particleScaleFactor: number
  private isParticleScaleDecreasing: boolean
  private scaleIncreaseCount: number
  private scaleDecreaseCount: number
  private readonly particleSystems: ParticleSystem[]

  constructor (analyserNode: FloatFrequencyDatasource, gl: WebGLRenderingContext, canvas: HTMLCanvasElement, glContext: WebGLContext) {
    this.analyserNode = analyserNode
    this.canvas = canvas
    this.glContext = glContext
    this.audioInfo = new AudioInfo(256)

    const random100 = 100 * Math.random()
    let scale = 1
    if (this.canvas.width > 320 || this.canvas.height > 320) scale = 2

    this.width = Math.floor(this.canvas.width / scale)
    this.height = Math.floor(this.canvas.height / scale)
    this.ratio = this.width / this.height

    this.particleUpdateProgram = this.glContext.createProgram(Dy)
    this.glContext.createProgram(Cy)
    this.colorBlendProgram = this.glContext.createProgram(Ey)
    this.renderParticleSystemProgram = this.glContext.createProgram(Fy)
    this.finalRenderProgram = this.glContext.createProgram(Gy)
    this.alphaMaskProgram = this.glContext.createProgram(Hy)
    this.particleSimulationProgram = this.glContext.createProgram(Iy)
    this.noiseTexture = this.createNoiseTexture(32)

    const random = new Uint8Array(16384)
    for (let i = 0; i < random.length; ++i) {
      random[i] = Math.floor(255 * Math.random())
    }

    this.grainTex = this.glContext.createTexture(128, 128, {
      filter: WebGLRenderingContext.NEAREST,
      type: WebGLRenderingContext.UNSIGNED_BYTE,
      format: WebGLRenderingContext.ALPHA,
      wrap: WebGLRenderingContext.REPEAT,
      data: random
    })

    const colorConfig: TextureOptions = {
      filter: WebGLRenderingContext.LINEAR,
      wrap: WebGLRenderingContext.CLAMP_TO_EDGE,
      type: null,
      format: null,
      data: null
    }

    this.particleRenderFramebuffer = this.glContext.createFramebuffer(this.width, this.height, colorConfig, false)
    this.colorBlendFramebuffer = this.glContext.createFramebuffer(this.width, this.height, colorConfig, false)
    this.alphaBlendFramebuffer = this.glContext.createFramebuffer(this.width, this.height, colorConfig, false)

    const float32Array = new Float32Array([0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0])
    this.vertexBuffer = this.glContext.createBuffer(2, WebGLRenderingContext.STATIC_DRAW, float32Array)

    this.time = 60 * Math.random()
    this.previousTime = null
    this.particleSystemCenterPosition = new Float32Array(3)
    this.cameraPosition = createVec3(0, 0, 0)
    this.timeSamples = new Float32Array(80)
    this.timeSamplesCount = 0
    this.particleScaleFactor = 0.5
    this.isParticleScaleDecreasing = false
    this.scaleIncreaseCount = this.scaleDecreaseCount = 0

    const particleTexture = new ParticleTexture(this.glContext, 512, 1024)
    this.particleSystems = [
      new ParticleSystem(this.glContext, particleTexture, 0, 20, random100),
      new ParticleSystem(this.glContext, particleTexture, 20, 200, random100 + 50 + 50 * Math.random())
    ]

    this.glContext.colorMask(true, true, true, true)
    this.glContext.depthMask(false)
    this.glContext.disable(WebGLRenderingContext.DEPTH_TEST)
    this.glContext.disable(WebGLRenderingContext.CULL_FACE)
    this.glContext.disable(WebGLRenderingContext.BLEND)

    this.glContext.activateProgram(this.renderParticleSystemProgram)
    this.glContext.bindAttributeBuffer('uv', this.vertexBuffer)

    for (let i = 0; i < this.particleSystems.length; ++i) {
      this.glContext.bindFramebuffer(this.particleSystems[i].framebuffer0)
      this.glContext.drawArrays(WebGLRenderingContext.TRIANGLE_STRIP, 0, this.vertexBuffer.vertexCount)
      this.glContext.bindFramebuffer(this.particleSystems[i].framebuffer1)
      this.glContext.drawArrays(WebGLRenderingContext.TRIANGLE_STRIP, 0, this.vertexBuffer.vertexCount)
    }

    this.updateCenterPoint()
  }

  createNoiseTexture (size: number): Texture {
    const byteArrayData = new Uint8Array(size * size * size * 4)
    const randomValueArray = new Float32Array(size * size * size * 4)
    const gradientArray = new Float32Array(size * size * size * 4)

    for (let i = 0; i < randomValueArray.length; i += 4) {
      randomValueArray[i] = Math.random() - 0.5
      randomValueArray[i + 1] = Math.random() - 0.5
      randomValueArray[i + 2] = Math.random() - 0.5
      randomValueArray[i + 3] = 2 * Math.random() - 1
    }

    for (let z = 0; z < size; ++z) {
      for (let y = 0; y < size - 1; ++y) {
        for (let x = 0; x < size; ++x) {
          const index = x + y * size + z * size * size
          const indexTimes4 = 4 * index

          const yOffset = y
          const zOffset = z
          const xPrev = (x + size - 1) % size
          const xNext = (x + 1) % size
          const yPrev = (yOffset + size - 2) % (size - 1)
          const yNext = (yOffset + 1) % (size - 1)
          const zPrev = (zOffset + size - 1) % size
          const zNext = (zOffset + 1) % size

          const yOffsetTimesSize = yOffset * size
          const zOffsetTimesSizeSquared = zOffset * size * size
          const yNextTimesSize = yNext * size
          const yPrevTimesSize = yPrev * size
          const zNextTimesSizeSquared = zNext * size * size
          const zPrevTimesSizeSquared = zPrev * size * size

          const gradient = [
            randomValueArray[x + yNextTimesSize + zOffsetTimesSizeSquared + 2] -
            randomValueArray[x + yPrevTimesSize + zOffsetTimesSizeSquared + 2] -
            randomValueArray[x + yOffsetTimesSize + zNextTimesSizeSquared + 1] +
            randomValueArray[x + yOffsetTimesSize + zPrevTimesSizeSquared + 1],
            randomValueArray[x + yOffsetTimesSize + zNextTimesSizeSquared] -
            randomValueArray[x + yOffsetTimesSize + zPrevTimesSizeSquared] -
            randomValueArray[xNext + yOffsetTimesSize + zOffsetTimesSizeSquared + 2] +
            randomValueArray[xPrev + yOffsetTimesSize + zOffsetTimesSizeSquared + 2],
            randomValueArray[xNext + yOffsetTimesSize + zOffsetTimesSizeSquared + 1] -
            randomValueArray[xPrev + yOffsetTimesSize + zOffsetTimesSizeSquared + 1] -
            randomValueArray[x + yNextTimesSize + zOffsetTimesSizeSquared] +
            randomValueArray[x + yPrevTimesSize + zOffsetTimesSizeSquared],
            0
          ]

          gradientArray[indexTimes4] = gradient[0]
          gradientArray[indexTimes4 + 1] = gradient[1]
          gradientArray[indexTimes4 + 2] = gradient[2]
          gradientArray[indexTimes4 + 3] = gradient[3]
        }
      }
    }

    for (let i = 0; i < byteArrayData.length; ++i) {
      byteArrayData[i] = Math.floor(Math.min(Math.max(127.5 * (gradientArray[i] + 1), 0), 255))
    }

    for (let z = 0; z < size; ++z) {
      const srcIndex = z * size * size * size + (size - 1) * size * size * 4
      const dstIndex = z * size * size * size
      let i = 0
      for (; i < size * size * 4; ++i) {
        byteArrayData[srcIndex + i] = byteArrayData[dstIndex + i]
      }
    }

    return this.glContext.createTexture(size, size * size, new TextureOptions(byteArrayData))
  }

  static colorFromHue (hue: number, saturation: number): Float32Array {
    hue %= 6
    const rgb = createVec3(
      Math.max(0, Math.min(1, Math.abs(hue - 3) - 1)),
      Math.max(0, Math.min(1, 2 - Math.abs(hue - 2))),
      Math.max(0, Math.min(1, 2 - Math.abs(hue - 4)))
    )

    rgb[0] = 1 - saturation + saturation * rgb[0]
    rgb[1] = 1 - saturation + saturation * rgb[1]
    rgb[2] = 1 - saturation + saturation * rgb[2]

    return rgb
  }

  update (currentTime: number): void {
    let dt = 2 / 60
    if (this.previousTime !== null) {
      dt = (currentTime - this.previousTime) / 1000
      dt = Math.min(0.2, dt)
    }
    this.previousTime = currentTime

    const simulationDeltaTime = this.updateTimeBasedState(dt)
    this.audioInfo.updateAudioData(this.analyserNode)
    this.time += simulationDeltaTime
    this.renderForeground(simulationDeltaTime)
    this.updateCameraPosition()
    this.renderBackground()
  }

  updateTimeBasedState (deltaTime: number): number {
    for (let i = this.timeSamples.length - 1; i > 0; --i) {
      this.timeSamples[i] = this.timeSamples[i - 1]
    }

    this.timeSamples[0] = 1000 * deltaTime
    this.timeSamplesCount = Math.min(30, this.timeSamplesCount + 1)

    let sum = 0
    for (let i = 0; i < this.timeSamplesCount; ++i) {
      sum += this.timeSamples[i]
    }

    sum /= this.timeSamplesCount

    if (sum > 36) {
      ++this.scaleDecreaseCount
      this.scaleIncreaseCount = 0
    } else {
      ++this.scaleIncreaseCount
      this.scaleDecreaseCount = 0
    }

    if (this.scaleDecreaseCount > 30) {
      this.isParticleScaleDecreasing = true
      this.scaleDecreaseCount = 0
      this.particleScaleFactor = Math.max(0.1, this.particleScaleFactor - Math.min(0.1, (sum - 36) / 200))
    }

    if (!this.isParticleScaleDecreasing && this.scaleIncreaseCount > 30) {
      this.scaleIncreaseCount = 0
      this.particleScaleFactor = Math.min(1, this.particleScaleFactor + 0.01)
    }

    return sum / 1000
  }

  // lBb
  renderForeground (deltaTime: number): void {
    for (let i = 0; i < this.particleSystems.length; ++i) {
      this.particleSystems[i].update(deltaTime, this.audioInfo.smoothedData)
    }

    this.glContext.colorMask(true, true, true, true)
    this.glContext.depthMask(false)
    this.glContext.disable(WebGLRenderingContext.DEPTH_TEST)
    this.glContext.disable(WebGLRenderingContext.CULL_FACE)
    this.glContext.disable(WebGLRenderingContext.BLEND)
    this.glContext.activateProgram(this.particleSimulationProgram)
    this.glContext.bindTexture('noiseTex', this.noiseTexture)
    this.glContext.setUniform('time', this.time, deltaTime)
    this.glContext.setUniform('drift', 60 * Math.sin(this.time) * deltaTime, 150 * deltaTime, 120 * deltaTime)
    this.glContext.setUniform('randomTexOffset', Math.random(), Math.random())

    for (let i = 0; i < this.particleSystems.length; ++i) {
      const particleSystem = this.particleSystems[i]
      const opacity = particleSystem.getOpacity()
      const emitterSize = 3 * opacity
      const particleSize = 12 * emitterSize * emitterSize * emitterSize
      const tempFramebuffer = particleSystem.framebuffer1
      particleSystem.framebuffer1 = particleSystem.framebuffer0
      particleSystem.framebuffer0 = tempFramebuffer
      const quality = Math.floor(this.particleScaleFactor * particleSystem.framebuffer0.height) / particleSystem.framebuffer0.height

      this.glContext.bindFramebuffer(particleSystem.framebuffer0)
      this.glContext.bindTexture('randomTex', particleSystem.texture)
      this.glContext.bindTexture('positionTex', particleSystem.framebuffer1.colorTexture)
      this.glContext.bindAttributeBuffer('uv', this.vertexBuffer)
      this.glContext.setUniform('emitterSize', 0.01 + emitterSize, particleSize, deltaTime * opacity * 30)
      this.glContext.setUniform('pos0', this.particleSystems[i].position)
      this.glContext.setUniform('vel0', this.particleSystems[i].velocity)
      this.glContext.setUniform('pos1', this.particleSystems[1 - i].position)
      this.glContext.setUniform('vel1', this.particleSystems[1 - i].velocity)
      this.glContext.setUniform('quality', quality)
      this.glContext.drawArrays(WebGLRenderingContext.TRIANGLE_STRIP, 0, this.vertexBuffer.vertexCount)
    }
  }

  setupMatrices (): void {
    const viewMatrix = new Float32Array(16)
    const projectionMatrix = new Float32Array(16)
    const viewProjectionMatrix = new Float32Array(16)

    const aspectRatio = this.ratio
    const fovY = (70 * Math.PI) / 180 / 2
    const sinFovY = Math.sin(fovY)

    if (sinFovY !== 0 && aspectRatio !== 0) {
      const cotan = Math.cos(fovY) / sinFovY
      projectionMatrix[0] = cotan / aspectRatio
      projectionMatrix[1] = 0
      projectionMatrix[2] = 0
      projectionMatrix[3] = 0
      projectionMatrix[4] = 0
      projectionMatrix[5] = cotan
      projectionMatrix[6] = 0
      projectionMatrix[7] = 0
      projectionMatrix[8] = 0
      projectionMatrix[9] = 0
      projectionMatrix[10] = -1000.01 / 999.99
      projectionMatrix[11] = -1
      projectionMatrix[12] = 0
      projectionMatrix[13] = 0
      projectionMatrix[14] = -20 / 999.99
      projectionMatrix[15] = 0
    }

    const cameraPos = this.cameraPosition
    const zAxis = new Float64Array(4)
    vec3Sub(this.particleSystemCenterPosition, cameraPos, zAxis)
    normalizeVector(zAxis, zAxis)
    zAxis[3] = 0

    const xAxis = new Float64Array(4)
    crossProduct(zAxis, Float32Array.from([0, 1, 0]), xAxis)
    normalizeVector(xAxis, xAxis)
    xAxis[3] = 0

    const yAxis = new Float64Array(4)
    crossProduct(xAxis, zAxis, yAxis)
    normalizeVector(yAxis, yAxis)
    yAxis[3] = 0

    zAxis[0] = -zAxis[0]
    zAxis[1] = -zAxis[1]
    zAxis[2] = -zAxis[2]

    setMatrix4Column(viewMatrix, 0, xAxis)
    setMatrix4Column(viewMatrix, 1, yAxis)
    setMatrix4Column(viewMatrix, 2, zAxis)
    viewMatrix[3] = 0
    viewMatrix[7] = 0
    viewMatrix[11] = 0
    viewMatrix[15] = 1

    const tx = -cameraPos[0]
    const ty = -cameraPos[1]
    const tz = -cameraPos[2]
    const tw = viewMatrix[1] * tx + viewMatrix[5] * ty + viewMatrix[9] * tz + viewMatrix[13]
    const tz2 = viewMatrix[2] * tx + viewMatrix[6] * ty + viewMatrix[10] * tz + viewMatrix[14]
    const tz3 = viewMatrix[3] * tx + viewMatrix[7] * ty + viewMatrix[11] * tz + viewMatrix[15]
    viewMatrix[12] = viewMatrix[0] * tx + viewMatrix[4] * ty + viewMatrix[8] * tz + viewMatrix[12]
    viewMatrix[13] = tw
    viewMatrix[14] = tz2
    viewMatrix[15] = tz3

    const m00 = projectionMatrix[0]
    const m01 = projectionMatrix[1]
    const m02 = projectionMatrix[2]
    const m03 = projectionMatrix[3]
    const m10 = projectionMatrix[4]
    const m11 = projectionMatrix[5]
    const m12 = projectionMatrix[6]
    const m13 = projectionMatrix[7]
    const m20 = projectionMatrix[8]
    const m21 = projectionMatrix[9]
    const m22 = projectionMatrix[10]
    const m23 = projectionMatrix[11]
    const m30 = projectionMatrix[12]
    const m31 = projectionMatrix[13]
    const m32 = projectionMatrix[14]
    const m33 = projectionMatrix[15]
    const a00 = viewMatrix[0]
    const a01 = viewMatrix[1]
    const a02 = viewMatrix[2]
    const a03 = viewMatrix[3]
    const a10 = viewMatrix[4]
    const a11 = viewMatrix[5]
    const a12 = viewMatrix[6]
    const a13 = viewMatrix[7]
    const a20 = viewMatrix[8]
    const a21 = viewMatrix[9]
    const a22 = viewMatrix[10]
    const a23 = viewMatrix[11]
    const a30 = viewMatrix[12]
    const a31 = viewMatrix[13]
    const a32 = viewMatrix[14]
    const a33 = viewMatrix[15]

    viewProjectionMatrix[0] = m00 * a00 + m10 * a01 + m20 * a02 + m30 * a03
    viewProjectionMatrix[1] = m01 * a00 + m11 * a01 + m21 * a02 + m31 * a03
    viewProjectionMatrix[2] = m02 * a00 + m12 * a01 + m22 * a02 + m32 * a03
    viewProjectionMatrix[3] = m03 * a00 + m13 * a01 + m23 * a02 + m33 * a03
    viewProjectionMatrix[4] = m00 * a10 + m10 * a11 + m20 * a12 + m30 * a13
    viewProjectionMatrix[5] = m01 * a10 + m11 * a11 + m21 * a12 + m31 * a13
    viewProjectionMatrix[6] = m02 * a10 + m12 * a11 + m22 * a12 + m32 * a13
    viewProjectionMatrix[7] = m03 * a10 + m13 * a11 + m23 * a12 + m33 * a13
    viewProjectionMatrix[8] = m00 * a20 + m10 * a21 + m20 * a22 + m30 * a23
    viewProjectionMatrix[9] = m01 * a20 + m11 * a21 + m21 * a22 + m31 * a23
    viewProjectionMatrix[10] = m02 * a20 + m12 * a21 + m22 * a22 + m32 * a23
    viewProjectionMatrix[11] = m03 * a20 + m13 * a21 + m23 * a22 + m33 * a23
    viewProjectionMatrix[12] = m00 * a30 + m10 * a31 + m20 * a32 + m30 * a33
    viewProjectionMatrix[13] = m01 * a30 + m11 * a31 + m21 * a32 + m31 * a33
    viewProjectionMatrix[14] = m02 * a30 + m12 * a31 + m22 * a32 + m32 * a33
    viewProjectionMatrix[15] = m03 * a30 + m13 * a31 + m23 * a32 + m33 * a33

    this.glContext.bindFramebuffer(this.particleRenderFramebuffer)
    this.glContext.clearColor(0, 0, 0, 0)
    this.glContext.clear(WebGLRenderingContext.COLOR_BUFFER_BIT)
    this.glContext.enable(WebGLRenderingContext.BLEND)
    this.glContext.blendEquation(WebGLRenderingContext.FUNC_ADD)
    this.glContext.blendFunc(WebGLRenderingContext.ONE, WebGLRenderingContext.ONE)
    this.glContext.activateProgram(this.alphaMaskProgram)
    this.glContext.setUniform('worldViewProj', ...viewProjectionMatrix)

    let density = (this.canvas.height / 450) / (256 * this.particleScaleFactor)
    density = Math.max(density, 2 / 255)
    this.glContext.setUniform('density', density)

    for (let i = 0; i < 2; ++i) {
      const particleSystem = this.particleSystems[i]
      this.glContext.bindTexture('positionTex', particleSystem.framebuffer0.colorTexture)
      this.glContext.bindAttributeBuffer('uv', particleSystem.buffer)

      const numParticles = Math.floor(this.particleScaleFactor * particleSystem.framebuffer0.height) * particleSystem.framebuffer0.width
      const halfParticles = Math.floor(numParticles / 2)

      if (i === 0) {
        this.glContext.colorMask(true, false, false, false)
        this.glContext.drawArrays(WebGLRenderingContext.POINTS, 0, halfParticles)
        this.glContext.colorMask(false, true, false, false)
      } else {
        this.glContext.colorMask(false, false, true, false)
        this.glContext.drawArrays(WebGLRenderingContext.POINTS, 0, halfParticles)
        this.glContext.colorMask(false, false, false, true)
      }

      this.glContext.drawArrays(WebGLRenderingContext.POINTS, halfParticles, numParticles - halfParticles)
    }

    this.glContext.colorMask(true, true, true, true)
    this.glContext.disable(WebGLRenderingContext.BLEND)

    this.glContext.bindFramebuffer(this.colorBlendFramebuffer)
    this.glContext.activateProgram(this.colorBlendProgram)
    this.glContext.bindTexture('tex', this.particleRenderFramebuffer.colorTexture)
    this.glContext.bindAttributeBuffer('uv', this.vertexBuffer)
    const color0 = Particles.colorFromHue(0.05 * this.time, 0.85)
    this.glContext.setUniform('color0', ...color0)
    const color1 = Particles.colorFromHue(0.05 * this.time + 2, 0.85)
    this.glContext.setUniform('color1', ...color1)
    this.glContext.drawArrays(WebGLRenderingContext.TRIANGLE_STRIP, 0, this.vertexBuffer.vertexCount)
  }

  renderBackground (): void {
    this.setupMatrices()
    this.glContext.disable(WebGLRenderingContext.BLEND)
    this.glContext.bindFramebuffer(this.particleRenderFramebuffer)
    this.glContext.activateProgram(this.particleUpdateProgram)
    this.glContext.bindTexture('mainTex', this.colorBlendFramebuffer.colorTexture)
    this.glContext.bindAttributeBuffer('uv', this.vertexBuffer)
    this.glContext.setUniform('duv', 1 / this.width, 0)
    this.glContext.setUniform('alphaScaleOffset', 1, 0)
    this.glContext.drawArrays(4, 0, this.vertexBuffer.vertexCount)
    this.glContext.enable(WebGLRenderingContext.BLEND)
    this.glContext.blendFunc(WebGLRenderingContext.SRC_ALPHA, WebGLRenderingContext.ONE_MINUS_SRC_ALPHA)
    this.glContext.bindFramebuffer(this.alphaBlendFramebuffer)
    this.glContext.bindTexture('mainTex', this.particleRenderFramebuffer.colorTexture)
    this.glContext.bindAttributeBuffer('uv', this.vertexBuffer)
    this.glContext.setUniform('duv', 0, 1 / this.height)
    this.glContext.setUniform('alphaScaleOffset', 0.25, 0.75)
    this.glContext.drawArrays(4, 0, this.vertexBuffer.vertexCount)
    this.glContext.disable(WebGLRenderingContext.BLEND)
    this.glContext.bindFramebuffer(null)
    this.glContext.activateProgram(this.finalRenderProgram)
    this.glContext.bindTexture('mainTex', this.alphaBlendFramebuffer.colorTexture)
    this.glContext.bindTexture('grainTex', this.grainTex)
    this.glContext.bindAttributeBuffer('uv', this.vertexBuffer)
    const widthOffset = this.canvas.width / this.grainTex.width
    const heightOffset = this.canvas.height / this.grainTex.height
    this.glContext.setUniform('grainScaleOffset', widthOffset, heightOffset, Math.random(), Math.random())
    this.glContext.drawArrays(4, 0, this.vertexBuffer.vertexCount)
  }

  updateCenterPoint (): void {
    this.particleSystemCenterPosition = new Float32Array(3)
    vec3Add(this.particleSystems[0].position, this.particleSystems[1].position, this.particleSystemCenterPosition)
    vec3Mul(this.particleSystemCenterPosition, 0.5, this.particleSystemCenterPosition)
  }

  updateCameraPosition (): void {
    const system1Position = this.particleSystems[0].position
    const system2Position = this.particleSystems[1].position
    const cameraAngle = 0.3 * this.time

    this.cameraPosition = createVec3(4.4 * Math.cos(cameraAngle), 0, 4.4 * Math.sin(cameraAngle))

    const centerPosition = new Float32Array(3)
    vec3Add(system1Position, system2Position, centerPosition)
    vec3Mul(centerPosition, 0.5, centerPosition)
    vec3Mul(centerPosition, 0.05, centerPosition)
    vec3Mul(this.particleSystemCenterPosition, 0.95, this.particleSystemCenterPosition)
    vec3Add(this.particleSystemCenterPosition, centerPosition, this.particleSystemCenterPosition)
  }
}
