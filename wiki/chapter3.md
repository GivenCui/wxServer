# 路由系统的改造<!-- omit in toc -->
- [相关](#%E7%9B%B8%E5%85%B3)
- [路由](#%E8%B7%AF%E7%94%B1)
- [路由按主题划分](#%E8%B7%AF%E7%94%B1%E6%8C%89%E4%B8%BB%E9%A2%98%E5%88%92%E5%88%86)
- [多Router拆分路由](#%E5%A4%9ARouter%E6%8B%86%E5%88%86%E8%B7%AF%E7%94%B1)
  - [api版本](#api%E7%89%88%E6%9C%AC)
  - [版本号携带策略](#%E7%89%88%E6%9C%AC%E5%8F%B7%E6%90%BA%E5%B8%A6%E7%AD%96%E7%95%A5)
  - [目录结构](#%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)
- [vscode + nodemon调试](#vscode--nodemon%E8%B0%83%E8%AF%95)
- [requireDirectory实现路由自动加载](#requireDirectory%E5%AE%9E%E7%8E%B0%E8%B7%AF%E7%94%B1%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD)
- [初始化管理器与process.cwd](#%E5%88%9D%E5%A7%8B%E5%8C%96%E7%AE%A1%E7%90%86%E5%99%A8%E4%B8%8Eprocesscwd)
## 相关
[API](http://bl.7yue.pro/dev/index.html)
## 路由
没有轮子, 路由用`if来写`
```js
if (ctx.path === '/classic/latest' && ctx.method === 'GET') {
  ctx.body = {
    test: `122`
  }
}

```
用轮子`koa-router`
```js
const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()

// router实例
const router = new Router()

router.get('/classic/latest', async (ctx, next) => {
  ctx.body = {
    test: `122`
  }
})

// router注册到app
app.use(router.routes())
app.use(router.allowedMethods()) // ?

```
## 路由按主题划分
- 先找到核心主题
- 再找到附属主题
- 主题的落地对应Model

## 多Router拆分路由
### api版本
> 因为业务变更, api需要有变化, 不能直接修改, 只能新增, 经验来说, 最多支持3个版本 (**开闭原则**)
### 版本号携带策略
1. 路径
2. 查询参数
3. header

### 目录结构

```js
.
├── api
│   ├── v1
│   │   ├── book.js
│   │   └── classic.js
│   └── v2
├── app.js
└── package.json

```
```js
// app.js

const Koa = require('koa')
const app = new Koa()
// 引入路由
const book = require('./api/v1/book')
const classic = require('./api/v1/classic')

// 注册路由
app.use(book.routes())
app.use(classic.routes())
// koa-router实例不等, 所以不是单例模式
// console.log(book === classic) // false

app.listen(3000, () => {
  console.log('server is on 3000')
})
```

```js
// api/v1/book.js

const Router = require('koa-router')
const router = new Router()

router.get('v1/book/latest', (ctx, next) => {
  ctx.body = {
    key: 'book'
  }
})

module.exports = router

```
## vscode + nodemon调试
> 需要nodemon全局安装, 如果不在PATH中, 则不能匹配, DEBUG配置文件在` .vscode/launch.jsson`中

```json
// vscode的DEBUG界面配置launch.json
{
  "type": "node",
  "request": "launch",
  "name": "nodemon",
  "runtimeExecutable": "nodemon",
  "program": "${workspaceFolder}/app.js",
  "restart": true,
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
},
{
  "type": "node",
  "request": "launch",
  "name": "当前文件",
  "program": "${file}"
},

```
## requireDirectory实现路由自动加载
```js
// 动脑筋 思考 能不能简化写法
const Router = require('koa-router')
const requireDirectory = require('require-directory')

// 动脑筋 思考 能不能简化写法
// 注意: module, 不是'module'
requireDirectory(module, './app/api', {
  visit(module) {
    if (module instanceof Router) {
      // 注册路由
      app.use(module.routes())
    }
  }
})
```
## 初始化管理器与process.cwd
> app.js中的相关逻辑拆分到`core/init.js`中
```
.
├── app
│   └── api
│       ├── v1
│       │   ├── book.js
│       │   └── classic.js
│       └── v2
├── app.js
├── core
│   └── init.js
└── package.json

```
`process.cwd()` 是指Node.js 进程的当前工作目录
```js
// '../app/api'写死的路径不利于代码重构复用
    // 1. 绝对路径
    // 2. 可以提供接口配置path
    const apiPath = path.resolve(process.cwd(), './app/api')
    requireDirectory(module, apiPath, {
      visit(module) {
        if (module instanceof Router) {
          // 注册路由
          InitManager.app.use(module.routes())
        }
      }
    })
```
拓展: node中路径相关概念
```js
const path = require('path')
// 测试node常用path相关

console.log('__dirname: ', __dirname) // 当前文件所在的目录
console.log('path.resolve("test.js"): ', path.resolve('test.js')) // 返回绝对路径
console.log('path.join("test.js"): ', path.join('test.js')) // 返回相对路径

console.log('process.cwd(): ', process.cwd()) // Node.js 进程的当前工作目录, 在不同的目录启动, 会变动

```
