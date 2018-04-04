const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    const isDev = !(env && env.prod);
    return [{
        entry: {
            mozlite: path.join(__dirname, 'src', 'index.js'),
            bootstrap: 'bootstrap-loader'
        },
        output: {
            filename: '[name].js',
            path: path.join(__dirname, 'dist'),
            chunkFilename: '[id].chunk.js',
            sourceMapFilename: '[name].map',
            library: '[name]',
            libraryTarget: 'var',
        },
        resolve: {
            extensions: ['.js', '.json'],
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
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: 'url-loader?limit=8192&name=images/[hash].[ext]'
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: 'url-loader?limit=8192&name=fonts/[hash].[ext]'
                },
                {
                    test: /\.s?css$/, //移到单独得文件
                    exclude: /(node_modules|bower_components)/,
                    use: isDev ?
                        ExtractTextPlugin.extract({ use: ['css-loader', 'sass-loader'] }) : ExtractTextPlugin.extract({ use: ['css-loader?minimize', 'sass-loader?minimize'] })
                },
                {
                    test: /bootstrap.scss$/, //移到单独得文件
                    use: isDev ?
                        ExtractTextPlugin.extract({ use: ['css-loader', 'sass-loader'] }) : ExtractTextPlugin.extract({ use: ['css-loader?minimize', 'sass-loader?minimize'] })
                }
            ]
        },
        externals: {
            jquery: "jQuery"
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            }),
            new webpack.optimize.OccurrenceOrderPlugin(true),
            new ExtractTextPlugin('[name].css')
        ].concat(isDev ? [
            new HTMLPlugin({
                title: 'Mozlite JS UI',
                inject: 'head',
                filename: 'index.html',
                template: 'src/index.html'
            }),
            new webpack.HotModuleReplacementPlugin()
        ] : [
            new CopyPlugin([
                { from: 'src/index.d.ts', to: 'index.d.ts' },
                { from: 'node_modules/jquery/dist/jquery.min.js', to: 'jquery.min.js' }
            ]),
            new UglifyJsPlugin()
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