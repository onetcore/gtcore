const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env) => {
    const isDev = !(env && env.prod);
    return [{
        entry: path.join(__dirname, 'src', 'index.js'),
        output: {
            filename: 'bundle.js',
            path: path.join(__dirname, 'dist')
        },
        module: {
            rules: [{
                test: /\.js$/,
                include: path.join(__dirname, "src"),
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ['transform-runtime']
                    }
                }
            }, {
                test: /\.html$/,
                include: path.join(__dirname, "src"),
                loader: 'file-loader'
            }]
        },
        plugins: (isDev ? [
            new webpack.HotModuleReplacementPlugin()
        ] : [new UglifyJsPlugin({
            uglifyOptions: {
                ecma: 6 //es6支持
            }
        })]).concat([
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            }),
            new webpack.optimize.OccurrenceOrderPlugin(true),
            new webpack.IgnorePlugin(/jquery/)
        ]),
        devServer: {
            contentBase: path.join(__dirname, "dist"),
            port: 8080,
            host: '0.0.0.0',
            historyApiFallback: true,
            hot: true
        }
    }];
};