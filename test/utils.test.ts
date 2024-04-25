import { getTargetPosition, createVec3 } from '../src/utils'

/* eslint-disable */
// @ts-ignore
var minifiedGetTargetPosition = function (a, b, c) {
  var e = 2 * (Math.cos(.51 * a) + Math.sin(.29 * a))
    , f = 3 * Math.cos(a + Math.sin(.47 * a)) - 2 * Math.sin(.79 * a);
  a = .5 + .5 * (Math.sin(a + Math.cos(.31 * a)) * Math.cos(3.7 * a) - Math.sin(2.1 * a));
  a = b + a * (c - b);
  return createVec3(a * Math.cos(f) * Math.cos(e), a * Math.sin(e), a * Math.sin(f) * Math.cos(e))
};
/* eslint-enabled */

describe('utils', () => {
  test('test getTargetPosition', () => {
    const a = 50
    const b = 1.5
    const c = 3

    const expected = minifiedGetTargetPosition(a, b, c)
    const actual = getTargetPosition(a, b, c)
    expect(actual).toEqual(expected)
  })
})