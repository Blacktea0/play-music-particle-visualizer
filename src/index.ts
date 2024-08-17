import { WebGLContext } from './webgl-context'
import { Particles } from './particles'
import { WallpaperEngineDatasource } from './wallpaper-engine-datasource'

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

  const webGLContext = new WebGLContext(canvas, gl)
  const particles = new Particles(WallpaperEngineDatasource.instance, gl, canvas, webGLContext)

  function render (now: number): void {
    particles.update(now)
    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)

  canvas.addEventListener('click', () => {
    void WallpaperEngineDatasource.instance.resume()
  })

  // @ts-expect-error wallpaper engine global function
  window.wallpaperRegisterAudioListener((array: Float32Array) => {
    WallpaperEngineDatasource.instance.cache = array
  })
}
