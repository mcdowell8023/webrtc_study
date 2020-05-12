# demo-test-project-for-webrtc_study

## demo-test-projectTemplate-for-web

## 启动

```bash
  # 下载 依赖
  npm install
  # 启动
  npm start
  # 用 端口 8090 启动 如果有https 那么端口+1:即 8091
  npm start -- --port 8090
  # 启用 https
  npm start -- --https
  # 启用 https 并且 使用 8090 端口
  npm start -- --https --port 8090
```

## 说明

1. 启动项目 https 服务，需要证书
2. https 服务 端口 在 http 端口 +1

## 愿景

> 项目主要用作 web 前端 学习编写 dome 又需要服务 的情况 ，提供简单的 node http 服务，方便 测试，调试。
> 约定 > 配置 简化 工具使用， 让你 专注 学习，编写 deome 测试

1. ~~提供 约定 静态目录 /demo /deoc /stactic~~
2. ~~提供 默认主页 目录~~【 自动生成 】
3. doc 文件 支持读取、渲染 md
