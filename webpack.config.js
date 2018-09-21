const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const inputDir = path.join(__dirname, 'mozlite', 'src');
const outputDir = path.join(__dirname, 'mozlite', 'dist');
const jsDir = 'js';
const cssDir = 'css';

module.exports = (env) => {
    const isDev = !(env && env.prod);
    return [{
        entry: {mozlite: path.join(inputDir, 'mozlite.js')},
        output: {
            filename: 'js/[name].min.js',
            path: outputDir,
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
                    include: inputDir,
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
                    use: 'url-loader?limit=8192&name=images/[hash].[ext]'
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: 'url-loader?limit=8192&name=fonts/[hash].[ext]'
                },
                {
                    test: /\.s?css$/, //移到单独得文件
                    use: isDev ?
                        ExtractTextPlugin.extract({ use: ['css-loader', 'sass-loader'] }) : 
                        ExtractTextPlugin.extract({ use: ['css-loader?minimize', 'sass-loader?minimize'] })
                }
            ]
        },
        externals: {
            jquery: "jQuery"
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery"
            }),
            new webpack.IgnorePlugin(/\/bootstrap\//),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
            new webpack.optimize.OccurrenceOrderPlugin(true),
            new ExtractTextPlugin('css/[name].min.css'),
            new CopyPlugin([
                { from: 'package.json', to: '../package.json' },
                { from: 'README.md', to: '../README.md' }
            ])
        ].concat(isDev ? [
            new HTMLWebpackPlugin({
                title: 'Mozlite JS UI',
                inject: 'head',
                filename: 'index.html',
                template: 'templates/index.html'
            }),
            new webpack.HotModuleReplacementPlugin(),
            new CopyPlugin([
                { from: 'node_modules/jquery/dist/jquery.min.js', to: jsDir },
                { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css', to: cssDir },
                { from: 'node_modules/bootstrap/dist/js/bootstrap.min.js', to: jsDir },
                { from: 'node_modules/popper.js/dist/popper.min.js', to: jsDir },
                { from: 'node_modules/font-awesome/css', to: 'font-awesome/css' },
                { from: 'node_modules/font-awesome/fonts', to: 'font-awesome/fonts' },
                { from: 'node_modules/eonasdan-bootstrap-datetimepicker/build', to: 'bootstrap-datetimepicker' },
            ])
        ] : [ new UglifyJsPlugin() ]),
        devServer: {
            contentBase: path.join(__dirname, "./mozlite/dist"),
            port: 8080,
            host: 'localhost',
            historyApiFallback: true,
            hot: true,
            publicPath: '/'
        }
    }];
};