import { ShaderProgram } from '../webgl-context'
import { vertex, fragment, renaming } from './cy.glslx'

class Cy extends ShaderProgram {
  feilds = renaming
  constructor (gl: WebGLRenderingContext) {
    super(gl, vertex, fragment)
    this.attribCount = 0
    gl.bindAttribLocation(this.handle, this.attribCount, renaming.b)
    this.attribMapping.uv = this.attribCount++
    gl.useProgram(this.handle)
  }
}

export { Cy }
