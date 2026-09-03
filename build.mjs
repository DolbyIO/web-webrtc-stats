import * as esbuild from 'esbuild';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

const shared = {
    entryPoints: ['./src/index.ts'],
    bundle: true,
    platform: 'browser',
    minify: true,
    minifyWhitespace: true,
    legalComments: 'none',
    sourcemap: true,
};

await Promise.all([
    esbuild.build({
        ...shared,
        format: 'esm',
        outfile: 'dist/webrtc-stats.mjs',
        plugins: [dtsPlugin()],
    }),
    esbuild.build({
        ...shared,
        format: 'cjs',
        outfile: 'dist/webrtc-stats.js',
    }),
]);
