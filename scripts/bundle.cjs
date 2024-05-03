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
const isDev = process.argv[1] === 'serve'
if (isDev) {
  plugins += livereloadPlugin({})
}

configure({
  entryPoints: ['./index.html'],
  sourcemap: true,
  outdir: './dist',
  absWorkingDir: __dirname + '/..',
  plugins: plugins,
  minify: !isDev,
  loader: {
    '.mp3': 'file'
  }
})
