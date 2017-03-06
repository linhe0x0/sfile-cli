const chalk = require('chalk')
const ora = require('ora')
const _ = require('lodash')
const sfile = require('./sfile')

/**
 * 根据关键词推荐出与之相似的 package
 * @param  {String} keyword 关键词
 * @return {undefined}
 */
exports.suggest = function suggest(keyword) {
  log(`没有找到 ${keyword}，或许你找的是下面的呢：`, 'warn')

  sfile.search(keyword, { loading: false }).then(function (data) {
    if (data.total) {
      outputPkgList(data)
    } else {
      log('抱歉哦，没有匹配到任何内容捏，要不客官换一个关键词可好？', 'warn')
    }
  })
}

/**
 * 在控制台中输出结果
 * @param  {Object} options 要输出的 package 的数据
 * @param  {Boolean} ssl    是否输出 https 链接
 * @return {undefined}
 */
exports.printf = function printf(options, ssl) {
  console.log('-', chalk.bold.green(`${options.name}@${options.version}`), chalk.underline.blue(`${options.homepage}`))
  console.log()
  console.log(' ', chalk.yellow(`${options.description}`))
  console.log()

  if (!options.assets) {
    return
  }

  let files = []

  // 筛选出指定的版本号的数据
  options.assets.forEach(function (item) {
    if (item.version === options.version) {
      files = item.files
    }
  })

  files.forEach(function (file) {
    const url = sfile.url({
      name: options.name,
      version: options.version,
      file: file,
    }, ssl)

    console.log(' ', url)
  })

  console.log()
}

/**
 * 输出 package 列表
 * @param  {Array} data package 数据
 * @return {undefined}
 */
let outputPkgList = exports.outputPkgList = function outputPkgList(data) {
  data.libs.forEach(function (item) {
    console.log('-', item.name)
  })

  console.log()
}

/**
 * 控制台输出工具函数
 * @param  {String} text 要输出的内容
 * @param  {String} type 指定输出的内容类型
 * @return {undefined}
 */
let log = exports.log = function log(text, type) {
  if (!text) {
    return console.log()
  }

  type = type || 'info'

  const colors = {
    info: 'gray',
    warn: 'yellow',
    error: 'red'
  }

  console.log(chalk[colors[type]](text))
}

/**
 * 在控制台显示 loading 效果
 * @param  {String} text 显示 loading 时的提示文本
 * @return {Object}      ora 实例
 */
exports.loading = function loading(text) {
  text = text || 'fetching data.'

  const spinner = ora({
    text: text,
    color: 'yellow'
  })

  spinner.start()

  return spinner
}

/**
 * 在控制台输出 package 信息
 * @param  {Object} data 原始数据集
 * @return {undefined}
 */
exports.info = function info(data) {
  const opts = _.pick(data, [ 'name', 'description', 'homepage', 'keywords'])

  opts.repositories = []
  opts.versions = []

  data.repositories.forEach(function (item) {
    opts.repositories.push(item.url)
  })

  data.assets.forEach(function (item) {
    opts.versions.push(item.version)
  })

  console.log(opts)
}
