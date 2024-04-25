import { type FloatFrequencyDatasource } from '../src/fadeout-datasource'

export class RandomDatasource implements FloatFrequencyDatasource {
  getFloatFrequencyData (data: Float32Array): void {
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.pow(10, Math.random() * 1000)
    }
  }
}

export class ConstantDatasource implements FloatFrequencyDatasource {
  getFloatFrequencyData (data: Float32Array): void {
    data.fill(1)
  }
}
