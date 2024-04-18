import { initBuffers } from './init-buffer'
import { drawScene } from './draw-scene'
import { type ProgramInfo } from './program-info'
import { ShaderProgram } from './webgl-context'
import { Cy } from './shader/cy'
import * as shaders from './shader/demo.glslx'

main()

/*
- get WebGL context
- init shader program
  - load vertex shader
  - load fragment shader
  - create program
  - attach both shader
  - link program
- prepare program info
- init buffers
  - create buffer
  - bind buffer
  - buffer data
- draw scene
  - config scene
  - bind buffer
  - vertex attrib pointer
  - enable vertex attrib array
  - use program
  - set shader uniform
  - draw arrays
 */

function main (): void {
  const canvas: HTMLCanvasElement | null = document.querySelector('#particles')
  if (canvas == null) {
    console.log('canvas not found')
    return
  }
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const gl: WebGLRenderingContext | null = canvas.getContext('webgl', {
    antialias: false,
    depth: false,
    stencil: false
  })
  if (gl == null) {
    console.log('WebGL not found')
    return
  }
  const extensions = ['OES_texture_float', 'OES_texture_float_linear']
  for (const extension of extensions) {
    if (gl.getExtension(extension) == null) {
      console.log('Extension not found' + extension)
      return
    }
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clearDepth(1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)

  const cy = new Cy(gl)
  console.log(cy)

  const shaderProgram = new ShaderProgram(gl, shaders.vertex, shaders.fragment)

  console.log('wrong:')
  console.log(gl.getAttribLocation(shaderProgram.handle, shaders.renaming.uModelViewMatrix))
  console.log(gl.getUniformLocation(shaderProgram.handle, shaders.renaming.aVertexPosition))
  console.log('right:')
  console.log(gl.getAttribLocation(shaderProgram.handle, shaders.renaming.aVertexPosition))
  console.log(gl.getUniformLocation(shaderProgram.handle, shaders.renaming.uModelViewMatrix))

  const programInfo: ProgramInfo = {
    program: shaderProgram.handle,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram.handle, shaders.renaming.aVertexPosition)
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram.handle, shaders.renaming.uProjectionMatrix),
      modelViewMatrix: gl.getUniformLocation(shaderProgram.handle, shaders.renaming.uModelViewMatrix)
    }
  }

  console.log(programInfo)

  const buffers = initBuffers(gl).position
  if (buffers == null) {
    throw Error('Failed to init buffer')
  }
  drawScene(gl, programInfo, buffers)
}
