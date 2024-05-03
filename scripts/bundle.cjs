#!/usr/bin/env node
const { configure } = require('esbd')
const glslxPlugin = require('./libs/esbuild-plugin-glslx')
const { livereloadPlugin } = require('@jgoz/esbuild-plugin-livereload')

let plugins = [
  glslxPlugin({
    writeTypeDeclarations: true,
    renaming: 'all'
  }),
]
if (process.argv[1] === 'serve') {
  plugins += livereloadPlugin({})
}

configure({
  entryPoints: ['./index.html'],
  sourcemap: true,
  outdir: './dist',
  absWorkingDir: __dirname + '/..',
  plugins: plugins,
  loader: {
    '.mp3': 'file'
  }
})
