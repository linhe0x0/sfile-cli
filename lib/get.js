const sfile = require('./sfile')
const util = require('./util')

const main = function main(pkg, options) {
  const values = pkg.split('@')
  const name = values[0]
  const version = values[1]

  sfile.get(name).then(function (data) {
    if (data.name) {
      const opts = Object.assign({}, data, {
        version: version || data.version
      })
      
      util.printf(opts, options.parent.ssl)
    } else {
      util.suggest(name)
    }
  }).catch(function (err) {
    console.error(err)
  })
}

module.exports = main
