import * as esbuild from 'esbuild';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

await esbuild.build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    platform: 'browser',
    minify: true,
    minifyWhitespace: true,
    legalComments: 'none',
    sourcemap: true,
    outfile: 'dist/webrtc-stats.js',
    plugins: [dtsPlugin()],
});
