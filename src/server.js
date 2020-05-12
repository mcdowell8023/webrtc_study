/*
 * @Author: mcdowell
 * @Date: 2020-05-10 01:01:19
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-12 09:16:06
 */
var { is_https, port, crt, file_directory } = require('../config/index')
var express = require('express')
var app = express()
var fs = require('fs')
var http = require('http')
var https = require('https')
// http
var PORT = port
var httpServer = http.createServer(app)
httpServer.listen(PORT, function () {
  console.log(
    `HTTP ${process.env.npm_package_name} Server is running on: http://localhost:%s`,
    PORT
  )
})
// 启用 https
if (is_https) {
  var SSLPORT = PORT + 1
  var privateKey = fs.readFileSync(crt.privateKey_path, 'utf8')
  var certificate = fs.readFileSync(crt.certificate_path, 'utf8')
  var httpsServer = https.createServer(
    { key: privateKey, cert: certificate },
    app
  )
  httpsServer.listen(SSLPORT, function () {
    console.log(
      `HTTPS ${process.env.npm_package_name} Server is running on: https://localhost:%s`,
      SSLPORT
    )
  })
}

// 加载 静态 目录
Object.keys(file_directory).map((path) => {
  app.use(path, express.static(file_directory[path]))
})

app.get('/', function (req, res) {
  res.status(200)
  res.sendFile(__dirname + '/page/index.html')
  // .send('Welcome to Safety Land!')
})
