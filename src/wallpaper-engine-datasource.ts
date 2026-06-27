import { type FloatFrequencyDatasource } from './frequency-datasource'
import { FadeoutDatasource } from './fadeout-datasource'
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
  isTransparent: boolean = true
  private readonly isWallpaperEngine: boolean
  private readonly analyserNode: FloatFrequencyDatasource

  private constructor () {
    this.cache = new Float32Array(128)
    // @ts-expect-error wallpaper engine global function
    if (window.wallpaperRegisterAudioListener !== undefined) {
      this.isWallpaperEngine = true
    } else {
      console.info('not in Wallpaper Engine, init dummy data.')
      this.isWallpaperEngine = false
      this.analyserNode = new FadeoutDatasource()
    }
  }

  async resume (): Promise<void> {
    // noop
  }

  getFloatFrequencyData (array: Float32Array): void {
    if (this.isWallpaperEngine) {
      // Wallpaper Engine provides 128 audio channels (0-63 left, 64-127 right).
      // We map the 64 frequency channels to 256 output slots (each channel spans 4 slots).
      for (let i = 0; i < 64; i++) {
        const left = this.cache[i]
        const right = this.cache[64 + i]
        const mono = (left + right) / 2
        // Convert normalized linear volume [0, 1] to decibels (0 to -100 dB).
        const logVolume = 20 * Math.log10(Math.max(1e-5, mono))
        for (let j = 0; j < 4; j++) {
          array[i * 4 + j] = logVolume
        }
      }
    } else {
      this.analyserNode.getFloatFrequencyData(array)
    }
  }
}
