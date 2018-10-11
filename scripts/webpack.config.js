const path = require('path')
const webpack = require('webpack')
const moment = require('moment')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const { version } = require('../package.json')

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
  resolve: {
    extensions: ['.js', '.ts']
  },
  context: path.resolve(__dirname, '../'),
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  },
  performance: {
    maxEntrypointSize: 300000,
    maxAssetSize: 300000
  }
}

const outputPath = path.resolve(__dirname, `../${process.env.NODE_ENV === 'test' ? 'tests' : 'dist'}`)

const ForkTsCheckerWebpackPluginConfig = new ForkTsCheckerWebpackPlugin({
  workers: 2,
  formatter: 'codeframe'
})

module.exports = [
  {
    entry: {
      'svga.lite': './core/index.ts'
    },
    output: {
      path: outputPath,
      filename: '[name].min.js',
      libraryTarget: 'umd',
      library: 'SVGA',
      libraryExport: 'default'
    },
    plugins: [
      ForkTsCheckerWebpackPluginConfig,
      new webpack.BannerPlugin(banner)
    ],
    ...defaultConfig
  },
  {
    entry: {
      'svga.lite.worker': './core/worker/index.ts'
    },
    output: {
      path: outputPath,
      filename: '[name].min.js'
    },
    plugins: [
      ForkTsCheckerWebpackPluginConfig
    ],
    ...defaultConfig
  }
]
