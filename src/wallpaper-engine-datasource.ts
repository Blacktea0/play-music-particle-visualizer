import { type FloatFrequencyDatasource } from './frequency-datasource'
import url from '../assets/flow.mp3'

export class WallpaperEngineDatasource implements FloatFrequencyDatasource {
  private static _instance: WallpaperEngineDatasource

  /**
   * get singleton
   */
  static get instance (): WallpaperEngineDatasource {
    if (this._instance === undefined) {
      this._instance = new this()
    }
    return this._instance
  }

  cache: Float32Array
  private readonly isWallpaperEngine: boolean
  private readonly analyserNode: FloatFrequencyDatasource
  private readonly audioCtx: AudioContext
  private readonly audioElement: HTMLAudioElement

  private constructor () {
    this.cache = new Float32Array(128)
    // @ts-expect-error wallpaper engine global function
    if (window.wallpaperRegisterAudioListener !== undefined) {
      this.isWallpaperEngine = true
    } else {
      console.info('not in Wallpaper Engine, init dummy data.')
      this.isWallpaperEngine = false
      const audioCtx = new AudioContext()
      const audio = new Audio(url)
      audio.loop = true
      const audioElement = document.body.appendChild(audio)
      const analyserNode = audioCtx.createAnalyser()
      const track = audioCtx.createMediaElementSource(audioElement)
      track.connect(analyserNode)
      this.analyserNode = analyserNode
      this.audioCtx = audioCtx
      this.audioElement = audioElement
      console.log(analyserNode.frequencyBinCount)
    }
  }

  async resume (): Promise<void> {
    if (!this.isWallpaperEngine && this.audioCtx.state !== 'running') {
      console.debug('audio context not running, resume it.')
      await this.audioCtx.resume()
      await this.audioElement.play()
    }
  }

  getFloatFrequencyData (array: Float32Array): void {
    if (this.isWallpaperEngine) {
      // audio array of Wallpaper Engine has fixed size of 128
      // for emphasizing bass, only use bass part of audio info
      for (let i = 0; i < 16; i++) {
        const left = this.cache[i]
        const right = this.cache[127 - i]
        const mono = (left + right) / 2
        const logVolume = Math.log(Math.min(mono, 1))
        // output array has length of 256
        for (let j = 0; j < 16; j++) {
          array[i * 16 + j] = logVolume
        }
      }
    } else {
      this.analyserNode.getFloatFrequencyData(array)
    }
  }
}
