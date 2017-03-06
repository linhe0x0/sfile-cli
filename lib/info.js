const sfile = require('./sfile')
const util = require('./util')

/**
 * info 子命令
 * 获取指定 package 的包信息。
 * @param  {String} pkg     指定的 package 名。
 * @return {undefined}
 */
const main = function main(pkg) {
  sfile.get(pkg).then(function (data) {
    if (data.name) {
      // 输出结果
      util.info(data)
    } else {
      // 未查询到 package，给出建议 package。
      util.suggest(pkg)
    }

  }).catch(function (err) {
    console.error(err)
  })
}

module.exports = main
