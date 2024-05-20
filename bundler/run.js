import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['app.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2020'],
  outfile: 'out.js',
});
