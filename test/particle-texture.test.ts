import { ParticleTexture } from '../src/particle-texture'
import { WebGLContext } from '../src/webgl-context'
import { setupJestCanvasMock } from 'jest-webgl-canvas-mock'

/* eslint-disabled */
// @ts-ignore
var createGradientBuffer = function (width, height) {
  var size = width * height
  for (var b = new Float32Array(2 * size), c = 0, e = 0; e < height; ++e)
    for (var f = 0; f < width; ++f) {
      var h = f / width
        , k = e / height;
      b[c++] = h;
      b[c++] = k
    }
  return b
}
/* eslint-enabled */

beforeEach(() => {
  jest.resetAllMocks()
  setupJestCanvasMock()
})

describe('ParticleTexture', () => {
  test('createGradientBuffer', () => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl', {
      antialias: false,
      depth: false,
      stencil: false
    })
    if (gl == null) {
      throw new Error('WebGL not found')
    }
    const bufferDataMock = jest.fn((target, data, usage) => {
    })
    gl.bufferData = bufferDataMock
    const webGLContext = new WebGLContext(canvas, gl)
    const width = 1920
    const height = 1080
    new ParticleTexture(webGLContext, width, height)

    const expectData = createGradientBuffer(width, height)
    expect(bufferDataMock).toHaveBeenCalledWith(WebGLRenderingContext.ARRAY_BUFFER, expectData, WebGLRenderingContext.STATIC_DRAW)
  })
})