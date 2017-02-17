const sfile = require('./sfile')
const util = require('./util')

const main = function main(keyword, options) {
  sfile.search(keyword).then(function (data) {
    if (data.total) {
      data.libs.forEach(function (item) {
        util.printf(item)
      })
    } else {
      util.log('抱歉哦，没有匹配到任何内容捏，要不客官换一个关键词可好？', 'warn')
    }
  }).catch(function (err) {
    console.error(err)
  })
}

module.exports = main 
