class ProgramInfo {
  public program: WebGLProgram
  public attribLocations: Record<string, GLint>
  public uniformLocations: Record<string, WebGLUniformLocation | null>
}

export { ProgramInfo }
