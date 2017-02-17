const sfile = require('./sfile')
const util = require('./util')

const main = function main(pkg, options) {
  sfile.get(pkg).then(function (data) {
    if (data.name) {
      util.info(data)
    } else {
      util.suggest(pkg)
    }

  }).catch(function (err) {
    console.error(err)
  })
}

module.exports = main
