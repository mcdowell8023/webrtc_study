/*
 * @Author: mcdowell
 * @Date: 2020-05-11 16:42:54
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-11 22:35:54
 */
var path = require('path')
const argvs = process.argv.splice(2, process.argv.length)
// 获取命令 中的端口
const port_index = argvs.indexOf('--port')
// 获取命令 https
const is_https = argvs.includes('--https') || false
// 项目 根目录
const root_path = path.join(__dirname, '../')
// 导出配置
module.exports = {
  // npm start -- --port 8090
  port: port_index > -1 ? Number(argvs[port_index + 1]) : 3000,
  is_https,
  // https 证书 路径 如果 要启用 https 必须确保正式可用
  crt: {
    privateKey_path: __dirname + '/crt/test.key',
    certificate_path: __dirname + '/crt/test.crt',
  },
  // 此处 静态路径 是从项目根目录 开始
  file_directory: {
    '/static': root_path + 'static',
    '/demo': root_path + 'demo',
    '/doc': root_path + 'doc',
  },
}
