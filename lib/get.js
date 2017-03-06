const sfile = require('./sfile')
const util = require('./util')

/**
 * get 子命令
 * 根据指定的 package 名获取相对于的链接。
 * @param  {String} pkg     指定的 package 名。
 * @param  {Object} options 用户输入的参数。
 * @return {undefined}
 */
const main = function main(pkg, options) {
  // 格式化 package 名，获取 package 名和指定的版本号。eg. react@15.0.0
  const values = pkg.split('@')
  const name = values[0]
  const version = values[1]

  // 根据指定的 package 名获取数据。
  sfile.get(name).then(function (data) {
    if (data.name) {
      const opts = Object.assign({}, data, {
        version: version || data.version
      })

      // 输出结果
      util.printf(opts, options.parent.ssl)
    } else {
      // 未查询到 package，给出建议 package。
      util.suggest(name)
    }
  }).catch(function (err) {
    console.error(err)
  })
}

module.exports = main
