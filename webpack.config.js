const path = require('path')
const webpack = require('webpack')
const moment = require('moment')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const { version } = require('./package.json')

const banner =
`[name].min.js

Version: ${version}
Time: ${moment().format('YYYY-MM-DD HH:mm')}
Document: https://github.com/yyued/SVGAPlayer-Web/tree/lite
(c) 2018 YY.UEDC
Released under the MIT License.`

const defaultConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      workers: 2,
      formatter: 'codeframe'
    }),
    new webpack.BannerPlugin(banner)
  ],
  resolve: {
    extensions: ['.js', '.ts']
  },
  context: path.resolve(__dirname, './'),
  devServer: {
    contentBase: path.join(__dirname, 'tests'),
    watchContentBase: true
  },
  performance: {
    maxEntrypointSize: 300000,
    maxAssetSize: 300000
  }
}

module.exports = [
  {
    entry: {
      'svga.lite': './core/index.ts'
    },
    output: {
      path: path.resolve(__dirname, process.env.NODE_ENV === 'test' ? 'tests' : 'dist'),
      filename: '[name].min.js',
      libraryTarget: 'umd',
      library: 'SVGA',
      libraryExport: 'default'
    },
    ...defaultConfig
  },
  {
    entry: {
      'svga.lite.worker': './core/worker.ts'
    },
    output: {
      path: path.resolve(__dirname, process.env.NODE_ENV === 'test' ? 'tests' : 'dist'),
      filename: '[name].min.js'
    },
    ...defaultConfig
  }
]
