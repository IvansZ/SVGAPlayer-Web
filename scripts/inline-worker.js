const path = require('path')
const fs = require('fs-extra')
const del = require('del')

module.exports = function (env) {
  const coreFile = path.resolve(__dirname, `../${env === 'test' ? 'tests/dist' : 'dist'}/svga.lite.min.js`)
  const workerFile = path.resolve(__dirname, `../${env === 'test' ? 'tests/dist' : 'dist'}/svga.lite.worker.min.js`)

  const distFile = env === 'test' ? path.resolve(__dirname, '../tests/svga.lite.min.js') : coreFile

  const core = fs.readFileSync(coreFile, 'utf8')
  const worker = fs.readFileSync(workerFile, 'utf8')

  fs.writeFileSync(distFile, core.replace('"#INLINE_WROKER#"', JSON.stringify(worker).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')), 'utf8')

  env !== 'test' && del.sync(workerFile, { force: true })
}
