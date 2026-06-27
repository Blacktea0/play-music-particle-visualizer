#!/usr/bin/env node
const { configure } = require('esbd')
const glslxPlugin = require('./libs/esbuild-plugin-glslx')
const { livereloadPlugin } = require('@jgoz/esbuild-plugin-livereload')

const copyProjectJsonPlugin = {
  name: 'copy-project-json',
  setup (build) {
    const fs = require('fs')
    const path = require('path')
    build.onEnd(() => {
      const src = path.join(__dirname, '..', 'project.json')
      const dest = path.join(__dirname, '..', 'dist', 'project.json')
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest)
        console.log('i  Copied project.json to dist/project.json')
      }
    })
  }
}

let plugins = [
  glslxPlugin({
    writeTypeDeclarations: true,
    renaming: 'all'
  }),
  copyProjectJsonPlugin
]
const isDev = process.argv[2] === 'serve'
if (isDev) {
  plugins.push(livereloadPlugin({}))
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
