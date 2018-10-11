process.env.NODE_ENV = 'test'

const path = require('path')
const browserSync = require('browser-sync')
const webpack = require('webpack')
const config = require('./webpack.config.js')
const inlineWorker = require('./inline-worker')

let isInitBrowserSync = false

const BrowserSyncOptions = {
  server: {
    baseDir: path.resolve(__dirname, '../tests'),
    directory: true
  },
  https: false,
  ui: false,
  notify: false,
  ghostMode: false,
  port: 8080,
  open: true,
  timestamps: true,
  watch: true,
  ignore: ['dist']
}

webpack(config, (error, stats) => {
  if (error || stats.hasErrors()) {
    console.error(error)
  } else {
    inlineWorker(process.env.NODE_ENV)

    !isInitBrowserSync && (isInitBrowserSync = true) && browserSync(BrowserSyncOptions)
  }
})
