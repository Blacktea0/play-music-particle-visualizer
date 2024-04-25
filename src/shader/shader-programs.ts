import { ShaderProgram } from '../webgl-context'
import * as cy from './cy.glslx'
import * as dy from './dy.glslx'
import * as ey from './ey.glslx'
import * as fy from './fy.glslx'
import * as gy from './gy.glslx'
import * as hy from './hy.glslx'
import * as iy from './iy.glslx'

export class Cy extends ShaderProgram {
  constructor (gl: WebGLRenderingContext) {
    super(gl, cy.vertex, cy.fragment)
    this.initVariableMapping(gl, cy.reverseRenaming)
  }
}

export class Dy extends ShaderProgram {
  constructor (gl: WebGLRenderingContext) {
    super(gl, dy.vertex, dy.fragment)
    this.initVariableMapping(gl, dy.reverseRenaming)
  }
}

export class Ey extends ShaderProgram {
  constructor (gl: WebGLRenderingContext) {
    super(gl, ey.vertex, ey.fragment)
    this.initVariableMapping(gl, ey.reverseRenaming)
  }
}

export class Fy extends ShaderProgram {
  constructor (gl: WebGLRenderingContext) {
    super(gl, fy.vertex, fy.fragment)
    this.initVariableMapping(gl, fy.reverseRenaming)
  }
}

export class Gy extends ShaderProgram {
  constructor (gl: WebGLRenderingContext) {
    super(gl, gy.vertex, gy.fragment)
    this.initVariableMapping(gl, gy.reverseRenaming)
  }
}

export class Hy extends ShaderProgram {
  constructor (gl: WebGLRenderingContext) {
    super(gl, hy.vertex, hy.fragment)
    this.initVariableMapping(gl, hy.reverseRenaming)
  }
}

export class Iy extends ShaderProgram {
  constructor (gl: WebGLRenderingContext) {
    super(gl, iy.vertex, iy.fragment)
    this.initVariableMapping(gl, iy.reverseRenaming)
  }
}
