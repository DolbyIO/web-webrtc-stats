const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: 'eval-source-map',
    output: {
        filename: 'webrtc-stats.js',
        sourceMapFilename: 'webrtc-stats.js.map',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: 'WebRTCStats',
            type: 'umd',
        },
    },
    mode: 'production',
};
