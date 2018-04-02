const webpack = require('webpack');
const path = require('path');

exports.module = {
    entry: {
        app: [path.join(__dirname, 'src', 'index.js')]
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 8080,
        host: '0.0.0.0',
        historyApiFallback: true,
        hot: true
    }
};