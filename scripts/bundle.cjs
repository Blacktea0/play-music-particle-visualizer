#!/usr/bin/env node
const { configure } = require('esbd')
const glslxPlugin = require('./libs/esbuild-plugin-glslx')
const { livereloadPlugin } = require('@jgoz/esbuild-plugin-livereload')

configure({
  entryPoints: ['./index.html'],
  sourcemap: true,
  outdir: './dist',
  absWorkingDir: __dirname + '/..',
  plugins: [
    glslxPlugin({
      writeTypeDeclarations: true,
      renaming: 'all'
    }),
    livereloadPlugin({})
  ],
  loader: {
    '.mp3': 'file'
  }
})
