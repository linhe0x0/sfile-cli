const request = require('request')
const _ = require('lodash')
const util = require('./util')

/**
 * 定义接口请求地址
 * @param  {String} type    接口类型
 * @param  {Object} options 请求接口时附带的参数
 * @return {String}         返回指定的接口地址
 */
const api = function api(type, options) {
  const data = {
    search: 'http://api.staticfile.org/v1/search?q={keyword}',
    pkg: 'https://api.staticfile.org/v1/packages/{pkg}'
  }

  let result = data[type]

  result = result.replace(/{[a-zA-Z]+}/g, function (attr) {
    const value = attr.slice(1, -1)

    return encodeURIComponent(options[value]) || ''
  })

  return result
}

/**
 * 搜索接口
 * @param  {String} keyword 搜索的关键词
 * @param  {Object} options 配置参数
 * @return {Promise}        搜索 API 的 Promise
 */
exports.search = function search(keyword, options) {
  let opts = _.defaults({}, options, { loading: true })
  let loading

  if (opts.loading) {
    loading = util.loading(`正在搜索与 ${keyword} 相关的信息`)
  }

  return new Promise(function (resolve, reject) {
    request.get({
      url: api('search', { keyword: keyword }),
      json: true,
    }, function (err, response, data) {
      if (err) {
        if (opts.loading) {
          loading.fail(`搜索 ${keyword} 相关信息失败，请检查网络是否存在问题`)
        }

        reject(err)
      } else {
        if (opts.loading) {
          loading.succeed(`搜索 ${keyword} 相关信息成功`)
        }

        resolve(data)
      }
      util.log()
    })
  })
}

/**
 * 获取 package 接口
 * @param  {String} pkg 指定获取的 package 名
 * @return {Promise}    获取 API 的 Promise
 */
exports.get = function get(pkg) {
  const loading = util.loading(`正在获取 ${pkg} 的信息`)

  return new Promise(function (resolve, reject) {
    request.get({
      url: api('pkg', { pkg: pkg }),
      json: true,
    }, function (err, response, data) {
      if (err) {
        loading.fail(`获取 ${pkg} 信息失败，请检查网络是否存在问题`)
        reject(err)
      } else {
        loading.succeed(`获取 ${pkg} 信息成功`)
        resolve(data)
      }

      util.log()
    })
  })
}

/**
 * URL 格式化
 * @param  {Object} options package 数据
 * @param  {Boolean} ssl    是否输出为 https 格式
 * @return {String}         格式化后的 package 链接地址
 */
exports.url = function url(options, ssl) {
  const hostname = ssl ? 'https://cdn.staticfile.org' : 'http://cdn.staticfile.org'

  return `${hostname}/${options.name}/${options.version}/${options.file}`
}
