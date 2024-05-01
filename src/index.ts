import { WebGLContext } from './webgl-context'
import { Particles } from './particles'
import url from '../assets/flow.mp3'

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

  canvas.addEventListener('click', async (e) => {
    const audioCtx = new AudioContext()
    const audio = new Audio(url)
    const audioElement = document.body.appendChild(audio)
    const analyserNode = audioCtx.createAnalyser()
    const track = audioCtx.createMediaElementSource(audioElement)
    track.connect(analyserNode)
    await audioCtx.resume()
    await audioElement.play()

    const webGLContext = new WebGLContext(canvas, gl)
    const particles = new Particles(analyserNode, gl, canvas, webGLContext)
    particles.renderBackground()

    function render (now: number): void {
      particles.update(now)
      requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
  })
}
