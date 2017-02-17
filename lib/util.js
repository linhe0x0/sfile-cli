const chalk = require('chalk')
const ora = require('ora')
const _ = require('lodash')
const sfile = require('./sfile')

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

exports.printf = function printf(options, ssl) {
  console.log('-', chalk.bold.green(`${options.name}@${options.version}`), chalk.underline.blue(`${options.homepage}`))
  console.log()
  console.log(' ', chalk.yellow(`${options.description}`))
  console.log()

  if (!options.assets) {
    return
  }

  let files = []

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

let outputPkgList = exports.outputPkgList = function outputPkgList(data) {
  data.libs.forEach(function (item) {
    console.log('-', item.name)
  })

  console.log()
}

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

exports.loading = function loading(text) {
  text = text || 'fetching data.'

  const spinner = ora({
    text: text,
    color: 'yellow'
  })

  spinner.start()

  return spinner
}

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
