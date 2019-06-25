# 路由系统的改造<!-- omit in toc -->
- [相关](#%E7%9B%B8%E5%85%B3)
- [路由](#%E8%B7%AF%E7%94%B1)
- [路由按主题划分](#%E8%B7%AF%E7%94%B1%E6%8C%89%E4%B8%BB%E9%A2%98%E5%88%92%E5%88%86)
- [多Router拆分路由](#%E5%A4%9ARouter%E6%8B%86%E5%88%86%E8%B7%AF%E7%94%B1)
  - [api版本](#api%E7%89%88%E6%9C%AC)
  - [版本号携带策略](#%E7%89%88%E6%9C%AC%E5%8F%B7%E6%90%BA%E5%B8%A6%E7%AD%96%E7%95%A5)
  - [目录结构](#%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84)
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
