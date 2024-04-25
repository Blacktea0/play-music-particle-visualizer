import { type FloatFrequencyDatasource } from './fadeout-datasource'

export class AudioInfo {
  rawData: Float32Array
  smoothedData: Float32Array
  previousData: Float32Array

  constructor (length: number) {
    this.rawData = new Float32Array(length)
    this.smoothedData = new Float32Array(length)
    this.previousData = new Float32Array(length)
  }

  static applyGaussianBlur (input: Float32Array, output: Float32Array, kernelRadius: number): void {
    const len = Math.min(input.length, output.length)
    for (let i = 0; i < len; ++i) {
      let weightSum = 0
      let valueSum = 0
      for (let j = -kernelRadius; j <= kernelRadius; ++j) {
        const k = i + j
        if (!(k < 0 || k >= input.length)) {
          const r = j / kernelRadius
          const weight = Math.exp(-4 * r * r)
          weightSum += weight
          valueSum += weight * input[k]
        }
      }
      output[i] = valueSum / weightSum
    }
  }

  updateAudioData (analyserNode: FloatFrequencyDatasource): void {
    for (let i = 0; i < this.previousData.length; ++i) {
      this.previousData[i] = this.rawData[i]
    }
    analyserNode.getFloatFrequencyData(this.rawData)
    for (let i = 0; i < this.rawData.length; ++i) {
      const prevValue = this.previousData[i]
      const newValue = Math.max(0, 20 * Math.pow(10, 0.05 * this.rawData[i]))
      this.rawData[i] = newValue + (newValue > prevValue ? 0.1 : 0.8) * (prevValue - newValue)
    }
    AudioInfo.applyGaussianBlur(this.rawData, this.smoothedData, 8)
    for (let i = 0; i < this.smoothedData.length; ++i) {
      this.smoothedData[i] = Math.max(0, 2 * this.rawData[i] - this.smoothedData[i])
    }
  }
}
