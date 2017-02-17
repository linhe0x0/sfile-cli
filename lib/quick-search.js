const inquirer = require('inquirer')
const sfile = require('./sfile')
const get = require('./get')
const util = require('./util')

const mapDataToChoices = function mapDataToChoices(data) {
  return data.slice(0).map(function (item) {
    return {
      name: `${item.name}@${item.version}`,
      value: item.name,
      short: `${item.name}@${item.version}`,
    }
  })
}

const main = function main(keyword, options) {
  sfile.search(keyword).then(function (data) {
    if (!data.total) {
      return util.log('抱歉哦，没有匹配到任何内容捏，要不客官换一个关键词可好？', 'warn')
    }

    const choices = mapDataToChoices(data.libs)
    const prompt = inquirer.createPromptModule()

    prompt({
      type: 'list',
      name: 'package',
      message: '请选择你要找的 package: ',
      choices: choices,
      pageSize: 10,
    }).then(function (answer) {
      get(answer.package, { parent: options })
    })
  }, function (err) {
    console.error(err)
  })
}

module.exports = main
