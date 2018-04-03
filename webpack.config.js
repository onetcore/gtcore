const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    const isDev = !(env && env.prod);
    return [{
        entry: { mozlite: path.join(__dirname, 'src', 'index.js') },
        output: {
            filename: '[name].js',
            path: path.join(__dirname, 'dist')
        },
        resolve: { extensions: ['.js', '.json'] },
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
                }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            }),
            new webpack.optimize.OccurrenceOrderPlugin(true),
            new webpack.IgnorePlugin(/jquery/),
            new ExtractTextPlugin('[name].css')
        ].concat(isDev ? [
            new HTMLPlugin({
                title:'Mozlite JS UI'
            }),
            new webpack.HotModuleReplacementPlugin()
        ] : [
            new UglifyJsPlugin({
                uglifyOptions: {
                    ecma: 6 //es6支持
                }
            }),
            new CopyPlugin([{ from: 'src/index.d.ts', to: 'index.d.ts' },{
                from:'node_modules/jquery/dist/jquery.min.js', to:'jquery.min.js'
            }])
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