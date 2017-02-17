const request = require('request')
const _ = require('lodash')
const util = require('./util')

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

exports.url = function url(options, ssl) {
  const hostname = ssl ? 'https://cdn.staticfile.org' : 'http://cdn.staticfile.org'

  return `${hostname}/${options.name}/${options.version}/${options.file}` 
}
