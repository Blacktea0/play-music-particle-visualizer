# Play Music Particle Visualizer

[Live Demo Here](https://blacktea0.github.io/play-music-particle-visualizer/)

Reverse engineering for a music visualizer in a discontinued music stream service [Google Play Music](https://play.google.com/music/listen).

Here is a [YouTube video](https://www.youtube.com/watch?v=mjfKCSPFdGI) demonstrates what it should be.

Original minified JavaScript source code and extracted shaders could be found in [./reference](reference).

## Run

Build and run in debug mode on your local machine:

```shell
pnpm run serve
```

## Build

Build for release with minification:

```shell
pnpm run build
```

## Credit

Build script is modified from [@sitdisch/esbuild-plugin-glslx](https://github.com/sitdisch/esbuild-plugin-glslx)