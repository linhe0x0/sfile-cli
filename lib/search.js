const sfile = require('./sfile')
const util = require('./util')

/**
 * 设置子命令 search
 * 根据指定的关键词搜索相关 package
 * @param  {String} keyword 指定的关键词
 * @param  {Object} options 配置参数
 * @return {undefined}
 */
const main = function main(keyword, options) {
  sfile.search(keyword).then(function (data) {
    // 如果搜索到结果
    if (data.total) {
      // 输出搜索到的结果
      data.libs.forEach(function (item) {
        util.printf(item)
      })
    } else {
      // 没有搜索到结果
      util.log('抱歉哦，没有匹配到任何内容捏，要不客官换一个关键词可好？', 'warn')
    }
  }).catch(function (err) {
    console.error(err)
  })
}

module.exports = main
