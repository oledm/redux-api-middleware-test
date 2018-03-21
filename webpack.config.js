const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || '8888'
const nodeEnv = process.argv.indexOf('-p') === -1 ? 'development' : 'production'
const isProd = nodeEnv === 'production'

const sourcePath = path.join(__dirname, './src')
const staticsPath = path.join(__dirname, './public')

function getFilename(filename) {
  //    return isProd ? filename.replace(/\.([^.]+)$/,".[chunkhash].$1") : filename
  return filename
}

function getExtractTextPlugin(filename) {
  return new ExtractTextPlugin({
    filename: getFilename(filename),
    disable: false,
    allChunks: true,
  })
}

const extractCSS = getExtractTextPlugin('styles.css')
const extractSASS = getExtractTextPlugin('styles-common.css')

const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: getFilename('vendor.bundle.js'),
    minChunks(module, count) {
      const context = module.context
      return context && context.indexOf('node_modules') >= 0
    },
  }),
  new webpack.optimize.CommonsChunkPlugin({
    async: 'qs',
    minChunks(module, count) {
      const context = module.context
      const target = 'qs'
      return context && context.indexOf('node_modules') >= 0 && context.indexOf(target) >= 0
    },
  }),
  new webpack.optimize.CommonsChunkPlugin({
    async: 'used-twice',
    minChunks(module, count) {
      return count >= 2
    },
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
  }),
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
  }),
  new HtmlWebpackPlugin({
    inject: false,
    template: 'index.ejs',
  }),
  extractCSS,
  extractSASS,
]

const cssLoader = {
  loader: 'css-loader',
  query: {
    modules: true,
    importLoader: 1,
    localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
  },
}

const jsEntry = ['./src/index.js']

if (isProd) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new CopyWebpackPlugin([
      {
        from: './static/**',
        to: '../',
      },
    ])
  )
} else {
  plugins.push(new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin())
}

module.exports = {
  devtool: isProd ? 'source-map' : 'source-map',
  entry: {
    bundle: jsEntry,
  },
  output: {
    filename: getFilename('[name].js'),
    chunkFilename: getFilename('[name]-chunk.js'),
    path: isProd ? path.join(staticsPath, 'static') : staticsPath,
    publicPath: isProd ? '/static/' : '/',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'file-loader',
          query: {
            name: '[name].[ext]',
          },
        },
      },
      {
        test: /\.scss$/,
        include: [/main/, /node_modules/],
        use: isProd
          ? extractSASS.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader'],
          })
          : ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        //                exclude: /node_modules/,
        use: isProd
          ? extractCSS.extract({
            fallback: 'style-loader',
            use: [cssLoader],
          })
          : ['style-loader', cssLoader],
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: [['es2015', { modules: false }], 'react', 'stage-0', 'env'],
              plugins: ['transform-class-properties'],
              babelrc: false,
            },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            query: {
              fix: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.worker\.js$/,
        exclude: /node_modules/,
        use: { loader: 'worker-loader' },
      },
      {
        test: /\.(gif|png|jpg|jpeg\ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    modules: [sourcePath, 'node_modules'],
  },
  plugins,
  devServer: {
    contentBase: '.',
    publicPath: '/',
    historyApiFallback: true,
    port: PORT,
    host: HOST,
    hot: true,
    inline: true,
    compress: isProd,
    stats: {
      colors: true,
      chunks: false, // be less verbose
    },
  },
  externals: {
    cheerio: 'window',
    'react/addons': true, // important!!
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
}
