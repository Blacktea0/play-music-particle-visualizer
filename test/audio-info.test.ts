/**
 * @jest-environment jsdom
 */
import { AudioInfo } from '../src/audio-info'
import { ConstantDatasource } from './test-utils'

/* eslint-disable */
// @ts-ignore
var Minified = function (length) {
  this['raw'] = new Float32Array(length)
  this.bL = new Float32Array(length)
  this.S$ = new Float32Array(length)
}
// @ts-ignore
Minified.prototype.applyGaussianBlur = function (a, b, c) {
  for (var e = Math.min(a.length, b.length), f = 0; f < e; ++f) {
    for (var h = 0, k = 0, m = -c; m <= c; ++m) {
      var p = f + m
      if (!(0 > p || p >= a.length))
        var r = m / c
          , r = Math.exp(-4 * r * r)
          , h = h + r
          , k = k + r * a[p]
    }
    b[f] = k / h
  }
}
// @ts-ignore
Minified.prototype.updateAudioData = function (a) {
  for (var b = 0; b < this.S$.length; ++b)
    this.S$[b] = this.raw[b]
  a.getFloatFrequencyData(this.raw)
  for (b = 0; b < this.raw.length; ++b) {
    a = this.S$[b]
    var c = Math.max(0, 20 * Math.pow(10, .05 * this.raw[b]))
    this.raw[b] = c + (c > a ? .1 : .8) * (a - c)
  }
  this.applyGaussianBlur(this.raw, this.bL, 8)
  for (b = 0; b < this.bL.length; ++b)
    this.bL[b] = Math.max(0, 2 * this.raw[b] - this.bL[b])
}
/* eslint-enable */

describe('AudioInfo', () => {
  test('applyGaussianBlur', () => {
    const input = new Float32Array(256)
    for (let i = 0; i < input.length; i++) {
      input[i] = Math.random()
    }
    const expected = new Float32Array(256)
    Minified.prototype.applyGaussianBlur(input, expected, 8)
    const actual = new Float32Array(256)
    AudioInfo.applyGaussianBlur(input, actual, 8)

    expect(actual).toEqual(expected)
  })

  test('updateAudioData', () => {
    const audioInfo = new AudioInfo(256)
    // @ts-expect-error for test
    const minified = new Minified(256)

    const analyserNode = new ConstantDatasource()
    minified.updateAudioData(analyserNode)
    audioInfo.updateAudioData(analyserNode)

    expect(audioInfo.rawData).toEqual(minified.raw)
    expect(audioInfo.smoothedData).toEqual(minified.bL)
    expect(audioInfo.previousData).toEqual(minified.S$)
  })
})
