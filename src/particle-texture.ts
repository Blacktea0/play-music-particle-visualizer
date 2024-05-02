import { type Buffer, type Texture, type TextureOptions, type WebGLContext } from './webgl-context'

export class ParticleTexture {
  readonly width: number
  readonly height: number
  readonly size: number
  readonly texture: Texture
  readonly buffer: Buffer

  constructor (gl: WebGLContext, width: number, height: number) {
    this.width = width
    this.height = height
    this.size = width * height
    this.texture = this.createRandomTexture(gl)
    this.buffer = this.createGradientBuffer(gl)
  }

  private createRandomTexture (gl: WebGLContext): Texture {
    const width = this.width
    const height = this.height
    const vector4List = new Float32Array(width * height * 4)
    const halfLength = Math.floor(vector4List.length / 8)

    for (let i = 0; i < halfLength;) {
      let x, y, z
      do {
        x = 2 * Math.random() - 1
        y = 2 * Math.random() - 1
        z = 2 * Math.random() - 1
      } while (x * x + y * y + z * z > 1)

      vector4List[i++] = x
      vector4List[i++] = y
      vector4List[i++] = z
      vector4List[i++] = Math.random()
    }

    const signs = [-1, 1, 1, 1, -1, 1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, -1, -1, -1, -1, -1]
    let j = 0

    for (let i = halfLength; i < vector4List.length;) {
      const x = vector4List[j++]
      const y = vector4List[j++]
      const z = vector4List[j++]
      j++

      for (let k = 0; k < signs.length;) {
        vector4List[i++] = x * signs[k++]
        vector4List[i++] = y * signs[k++]
        vector4List[i++] = z * signs[k++]
        vector4List[i++] = Math.random()
      }
    }

    const textureOptions: TextureOptions = {
      format: null,
      filter: WebGLRenderingContext.NEAREST,
      type: WebGLRenderingContext.FLOAT,
      wrap: WebGLRenderingContext.REPEAT,
      data: vector4List
    }

    return gl.createTexture(width, height, textureOptions)
  }

  private createGradientBuffer (gl: WebGLContext): Buffer {
    const data = new Float32Array(2 * this.size)
    let index = 0

    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        const u = x / this.width
        const v = y / this.height
        data[index++] = u
        data[index++] = v
      }
    }

    return gl.createBuffer(2, WebGLRenderingContext.STATIC_DRAW, data)
  }
}
