const inquirer = require('inquirer')
const sfile = require('./sfile')
const get = require('./get')
const util = require('./util')

/**
 * 将给定的数据集转换为 prompt 中的选择项
 * @param  {Array} data 数据集
 * @return {Object}     转换后的选择项
 */
const mapDataToChoices = function mapDataToChoices(data) {
  return data.slice(0).map(function (item) {
    return {
      name: `${item.name}@${item.version}`,
      value: item.name,
      short: `${item.name}@${item.version}`,
    }
  })
}

/**
 * 快速搜索接口
 * @param  {String} keyword 搜索的关键词
 * @param  {Object} options 配置参数
 * @return {undefined}
 */
const main = function main(keyword, options) {
  // 尝试根据提供的关键字进行搜索
  sfile.search(keyword).then(function (data) {
    if (!data.total) {
      return util.log('抱歉哦，没有匹配到任何内容捏，要不客官换一个关键词可好？', 'warn')
    }

    // 搜索到多个结构之后让用户进行选择
    const choices = mapDataToChoices(data.libs)
    const prompt = inquirer.createPromptModule()

    prompt({
      type: 'list',
      name: 'package',
      message: '请选择你要找的 package: ',
      choices: choices,
      pageSize: 10,
    }).then(function (answer) {
      // 根据用户的选择，获取指定 package 的信息
      get(answer.package, { parent: options })
    })
  }, function (err) {
    console.error(err)
  })
}

module.exports = main
