import { WebGLContext } from './webgl-context'
import { Particles } from './particles'
import { RandomDatasource } from '../test/test-utils'

main()

function main (): void {
  const canvas: HTMLCanvasElement | null = document.querySelector('#particles')
  if (canvas == null) {
    console.log('canvas not found')
    return
  }
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const gl: WebGLRenderingContext | null = canvas.getContext('webgl', {
    antialias: false,
    depth: false,
    stencil: false
  })
  if (gl == null) {
    console.log('WebGL not found')
    return
  }
  const extensions = ['OES_texture_float', 'OES_texture_float_linear']
  for (const extension of extensions) {
    if (gl.getExtension(extension) == null) {
      console.log('Extension not found' + extension)
      return
    }
  }

  const analyserNode = new RandomDatasource()
  const webGLContext = new WebGLContext(canvas, gl)
  const particles = new Particles(analyserNode, gl, canvas, webGLContext)
  particles.renderBackground()
  function render (now: number): void {
    particles.update(now)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
