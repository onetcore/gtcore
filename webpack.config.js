const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const SrcDir = path.join(__dirname, 'mozlite', 'src');
const DistDir = path.join(__dirname, 'mozlite', 'dist');

module.exports = (env) => {
    const isDev = !(env && env.prod);
    return [{
        entry: {
            mozlite: path.join(SrcDir, 'mozlite.js'),
            commons: [
                'bootstrap',
                'eonasdan-bootstrap-datetimepicker'
            ]
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'commons',
                        chunks: 'all'
                    }
                }
            }
        },
        output: {
            filename: 'js/[name].min.js',
            path: DistDir,
            chunkFilename: 'js/[name].min.js',
            sourceMapFilename: 'js/[name].map',
            library: 'Mozlite',
            libraryTarget: 'var',
            publicPath: '../'
        },
        resolve: {
            extensions: ['.js', '.json'],
        },
        module: {
            rules: [{
                    test: /\.js$/,
                    include: SrcDir,
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
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
            new webpack.optimize.OccurrenceOrderPlugin(true),
            new ExtractTextPlugin('css/[name].min.css'),
            new CopyPlugin([
                { from: 'node_modules/jquery/dist/jquery.min.js', to: 'js/jquery.min.js' },
                { from: 'package.json', to: '../package.json' },
            ])
        ].concat(isDev ? [
            new HTMLPlugin({
                title: 'Mozlite JS UI',
                inject: 'head',
                filename: 'index.html',
                template: 'index.html'
            }),
            new webpack.HotModuleReplacementPlugin()
        ] : [
            new CopyPlugin([
                { from: 'README.md', to: '../README.md' }
            ]),
            new UglifyJsPlugin()
        ]),
        devServer: {
            contentBase: DistDir,
            port: 8080,
            host: 'localhost',
            historyApiFallback: true,
            hot: true,
            publicPath: '/'
        }
    }];
};