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

  const audioCtx = new AudioContext()
  const audio = new Audio(url)
  audio.loop = true
  const audioElement = document.body.appendChild(audio)
  const analyserNode = audioCtx.createAnalyser()
  const track = audioCtx.createMediaElementSource(audioElement)
  const delayNode = audioCtx.createDelay(0.05)
  const gainNode = audioCtx.createGain()
  gainNode.gain.value = 0.5
  track.connect(analyserNode).connect(delayNode).connect(gainNode).connect(audioCtx.destination)

  const webGLContext = new WebGLContext(canvas, gl)
  const particles = new Particles(analyserNode, gl, canvas, webGLContext)

  function render (now: number): void {
    particles.update(now)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)

  let playing = audioCtx.state === 'running'
  canvas.addEventListener('click', () => {
    if (playing) {
      audioElement.pause()
      playing = false
    } else {
      audioCtx.resume().catch(reason => { throw reason })
      audioElement.play().catch(reason => { throw reason })
      playing = true
    }
  })
}
