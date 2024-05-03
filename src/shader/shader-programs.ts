import { ShaderProgram } from '../webgl-context'
import * as dy from './dy.glslx'
import * as ey from './ey.glslx'
import * as fy from './fy.glslx'
import * as gy from './gy.glslx'
import * as hy from './hy.glslx'
import * as iy from './iy.glslx'

export class ParticleUpdateShader extends ShaderProgram {
  constructor (gl: WebGLRenderingContext) {
    super(gl, dy.vertex, dy.fragment)
    this.initVariableMapping(gl, dy.reverseRenaming)
  }
}

export class ColorBlendShader extends ShaderProgram {
  constructor (gl: WebGLRenderingContext) {
    super(gl, ey.vertex, ey.fragment)
    this.initVariableMapping(gl, ey.reverseRenaming)
  }
}

export class RenderParticleSystemShader extends ShaderProgram {
  constructor (gl: WebGLRenderingContext) {
    super(gl, fy.vertex, fy.fragment)
    this.initVariableMapping(gl, fy.reverseRenaming)
  }
}

export class FinalRenderShader extends ShaderProgram {
  constructor (gl: WebGLRenderingContext) {
    super(gl, gy.vertex, gy.fragment)
    this.initVariableMapping(gl, gy.reverseRenaming)
  }
}

export class AlphaMaskShader extends ShaderProgram {
  constructor (gl: WebGLRenderingContext) {
    super(gl, hy.vertex, hy.fragment)
    this.initVariableMapping(gl, hy.reverseRenaming)
  }
}

export class ParticleSimulationShader extends ShaderProgram {
  constructor (gl: WebGLRenderingContext) {
    super(gl, iy.vertex, iy.fragment)
    this.initVariableMapping(gl, iy.reverseRenaming)
  }
}
