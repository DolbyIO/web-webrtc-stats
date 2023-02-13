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
    externals: {
        'js-logger':'js-logger',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: 'eval-source-map',
    output: {
        filename: 'webrtc-stats.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'WebRTCStats',
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
    mode: 'production',
};
