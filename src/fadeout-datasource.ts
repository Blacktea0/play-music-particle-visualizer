export class FadeoutDatasource implements FloatFrequencyDatasource {
  private readonly createTime: number

  constructor () {
    this.createTime = Date.now()
  }

  private normalize (value: number): number {
    if (value < 0 || value > 1) {
      return 0
    }

    value = value < 0.25 ? value / 0.25 : 1 - (value - 0.25) / 0.75
    return 3 * value * value - 2 * value * value * value
  }

  getFloatFrequencyData (array: Float32Array): void {
    const timeElapsed = (Date.now() - this.createTime) / 1000 * 0.8 % 1
    let alpha = 0
    let beta = 0

    if (timeElapsed < 0.5) {
      alpha = this.normalize(2 * timeElapsed)
    } else {
      beta = this.normalize(2 * (timeElapsed - 0.5))
    }

    const halfLength = array.length / 16
    const logBase10 = Math.log(10)

    for (let i = 0; i < array.length; ++i) {
      const value = (0.2 + 0.5 * beta + alpha * this.normalize(i / halfLength)) / 1.7
      array[i] = value > 0 ? 20 * Math.log(value) / logBase10 : -1000
    }
  }
}

export interface FloatFrequencyDatasource {
  getFloatFrequencyData: (array: Float32Array) => void
}
