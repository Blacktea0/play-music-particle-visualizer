export function getTargetPosition (t: number, minRadius: number, maxRadius: number): Float32Array {
  const x = 2 * (Math.cos(0.51 * t) + Math.sin(0.29 * t))
  const y = 3 * Math.cos(t + Math.sin(0.47 * t)) - 2 * Math.sin(0.79 * t)
  const radius = 0.5 + 0.5 * (Math.sin(t + Math.cos(0.31 * t)) * Math.cos(3.7 * t) - Math.sin(2.1 * t))
  const scaledRadius = minRadius + radius * (maxRadius - minRadius)
  return createVec3(scaledRadius * Math.cos(y) * Math.cos(x), scaledRadius * Math.sin(x), scaledRadius * Math.sin(y) * Math.cos(x))
}

export const createVec3 = (a: number, b: number, c: number): Float32Array => {
  const e = new Float32Array(3)
  e[0] = a
  e[1] = b
  e[2] = c
  return e
}

export const vec3Add = (a: Float32Array | Float64Array, b: Float32Array | Float64Array, output: Float32Array | Float64Array): Float32Array | Float64Array => {
  output[0] = a[0] + b[0]
  output[1] = a[1] + b[1]
  output[2] = a[2] + b[2]
  return output
}

export const vec3Sub = (a: Float32Array | Float64Array, b: Float32Array | Float64Array, output: Float32Array | Float64Array): Float32Array | Float64Array => {
  output[0] = a[0] - b[0]
  output[1] = a[1] - b[1]
  output[2] = a[2] - b[2]
  return output
}

export const vec3Mul = (a: Float32Array | Float64Array, multiplier: number, output: Float32Array | Float64Array): Float32Array | Float64Array => {
  output[0] = a[0] * multiplier
  output[1] = a[1] * multiplier
  output[2] = a[2] * multiplier
  return output
}

export const normalizeVector = (vector: Float32Array | Float64Array, output: Float32Array | Float64Array): Float32Array | Float64Array => {
  const x = vector[0]
  const y = vector[1]
  const z = vector[2]
  const magnitude = 1 / Math.sqrt(x * x + y * y + z * z)
  output[0] = x * magnitude
  output[1] = y * magnitude
  output[2] = z * magnitude
  return output
}

export const crossProduct = (a: Float32Array | Float64Array, b: Float32Array | Float64Array, output: Float32Array | Float64Array): Float32Array | Float64Array => {
  output[0] = a[1] * b[2] - a[2] * b[1]
  output[1] = a[2] * b[0] - a[0] * b[2]
  output[2] = a[0] * b[1] - a[1] * b[0]
  return output
}

export const setMatrix4Column = (matrix: Float32Array | Float64Array, column: number, vector: Float32Array | Float64Array): Float32Array | Float64Array => {
  matrix[column] = vector[0]
  matrix[column + 4] = vector[1]
  matrix[column + 8] = vector[2]
  matrix[column + 12] = vector[3]
  return matrix
}
