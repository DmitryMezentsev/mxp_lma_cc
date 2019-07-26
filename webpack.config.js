const path = require('path');

const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const Autoprefixer = require('autoprefixer');
const CSSnano = require('cssnano');
const WebpackAutoInjectVersion = require('webpack-auto-inject-version');
const { VueLoaderPlugin } = require('vue-loader');

const autoprefixer = Autoprefixer({
  overrideBrowserslist: ['> 2%', 'last 5 versions'],
});

module.exports = (env = {}) => {
  const isDev = typeof env.development !== 'undefined' && env.development;

  return {
    mode: isDev ? 'development' : 'production',
    watch: isDev,
    devtool: false,

    // Отключение вывода лишней информации о сборке в консоль
    stats: {
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
    },
    performance: { hints: false },

    entry: path.join(__dirname, 'src/index.js'),
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'main.js?[chunkhash:8]',
      publicPath: '/',
    },
    plugins: [
      new CleanWebpackPlugin(),
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
      new WebpackAutoInjectVersion({
        SILENT: true,
        components: {
          AutoIncreaseVersion: false,
          InjectAsComment: true,
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env'] },
          },
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            extractCSS: true,
            postcss: [autoprefixer, CSSnano()],
          },
        },
        {
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            fix: true,
          },
        },
        {
          test: /\.less$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: { plugins: [autoprefixer] },
            },
            {
              loader: 'less-loader',
            },
          ],
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpg|gif|svg|ttf|woff|woff2|eot)$/,
          use: ['url-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.vue', '.js', '.less', '.css', '.scss'],
      alias: {
        Base: path.resolve(__dirname, 'src/'),
        Common: path.resolve(__dirname, 'src/common/'),
        Constants: path.resolve(__dirname, 'src/constants/'),
        Components: path.resolve(__dirname, 'src/components/'),
        Directives: path.resolve(__dirname, 'src/directives/'),
      },
    },
    devServer: {
      stats: 'errors-only',
      historyApiFallback: true,
    },
  };
};
