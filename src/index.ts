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
  if (typeof window.wallpaperRegisterAudioListener === 'function') {
    // @ts-expect-error wallpaper engine global function
    window.wallpaperRegisterAudioListener((array: number[]) => {
      const cache = WallpaperEngineDatasource.instance.cache
      for (let i = 0; i < Math.min(array.length, cache.length); ++i) {
        cache[i] = array[i]
      }
    })
  }

  let currentBgColor = 'rgb(255, 255, 255)'

  // @ts-expect-error wallpaper engine global listener
  window.wallpaperPropertyListener = {
    applyUserProperties: (properties: any) => {
      if (properties.bg_color !== undefined && typeof properties.bg_color.value === 'string' && properties.bg_color.value !== '') {
        const colors = properties.bg_color.value.split(' ').map((c: string) => Math.round(parseFloat(c) * 255))
        currentBgColor = `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`
      }

      document.body.style.backgroundColor = currentBgColor

      if (properties.bg_image !== undefined && typeof properties.bg_image.value === 'string') {
        const rawPath = properties.bg_image.value as string
        const path = rawPath.replace(/\\/g, '/')
        const bgUrl = path !== '' ? `url('file:///${path}')` : ''
        console.log('[Wallpaper Engine] Setting background image:', bgUrl)
        document.body.style.backgroundImage = bgUrl
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center'
        document.body.style.backgroundRepeat = 'no-repeat'
      }
    }
  }
}
