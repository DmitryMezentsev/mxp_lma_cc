'use strict';



const path = require('path');

const webpack                    = require('webpack');
const CleanWebpackPlugin         = require('clean-webpack-plugin');
const HtmlWebpackPlugin          = require('html-webpack-plugin');
const WebappWebpackPlugin        = require('webapp-webpack-plugin');
const Autoprefixer               = require('autoprefixer');
const CSSnano                    = require('cssnano');
const { VueLoaderPlugin }        = require('vue-loader');

const autoprefixer = Autoprefixer({ browsers: ['ie >= 10', 'last 5 version'] });



module.exports = (env = {}) => {
    const isDev = (typeof env.development !== 'undefined') && env.development;

    return {
        mode: isDev ? 'development' : 'production',
        watch: isDev,
        devtool: false,

        // Отключение вывода лишней информации о сборке в консоль
        stats: {
            hash:       false,
            version:    false,
            timings:    false,
            assets:     false,
            chunks:     false,
            modules:    false,
            reasons:    false,
            children:   false,
            source:     false,
            publicPath: false,
        },
        performance: { hints: false },

        entry: path.join(__dirname, 'src/index.js'),
        output: {
            path: path.join(__dirname, 'build'),
            filename: 'main.js?[chunkhash:8]',
            publicPath: '/',
        },
        plugins: [
            new CleanWebpackPlugin(path.join(__dirname, 'build/**/*.*')),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.join(__dirname, 'src/index.html'),
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    preserveLineBreaks: true,
                    html5: true,
                },
            }),
            new WebappWebpackPlugin(path.join(__dirname, 'src/common/img/favicon.png')),
            new VueLoaderPlugin(),
            new webpack.DefinePlugin({
                BUILD_IS_DEV: isDev,
            }),
        ],
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env'] },
                },
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true,
                    postcss: [autoprefixer, CSSnano()],
                },
            }, {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                }, {
                    loader: 'postcss-loader',
                    options: { plugins: [autoprefixer] },
                }, {
                    loader: 'less-loader',
                }],
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }, {
                test: /\.(png|jpg|gif|svg|ttf|woff|woff2|eot)$/,
                use: ['url-loader'],
            }],
        },
        resolve: {
            extensions: ['.vue', '.js', '.less', '.css'],
        },
        devServer: {
            stats: 'errors-only',
            historyApiFallback: true,
        },
    }
};
