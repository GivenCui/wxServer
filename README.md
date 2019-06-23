# nodejs + koa2开发微信小程序服务端<!-- omit in toc -->
- [相关](#%E7%9B%B8%E5%85%B3)
- [学习内容](#%E5%AD%A6%E4%B9%A0%E5%86%85%E5%AE%B9)
  - [环境搭建](#%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA)
  - [Node的能力与应用](#Node%E7%9A%84%E8%83%BD%E5%8A%9B%E4%B8%8E%E5%BA%94%E7%94%A8)
  - [koa](#koa)
    - [koa使用](#koa%E4%BD%BF%E7%94%A8)
    - [洋葱模型](#%E6%B4%8B%E8%91%B1%E6%A8%A1%E5%9E%8B)
## 相关
- [github](https://github.com/GivenCui/wxServer)
- [幕布](https://mubu.com/doc/oaG5Q95Zb0)
- [mooc](https://coding.imooc.com/learn/list/342.html)
- [对接课程](https://pan.baidu.com/disk/home?errno=0&errmsg=Auth%20Login%20Sucess&&bduss=&ssnerror=0&traceid=#/all?vmode=list&path=%2Fmooc%E7%BD%91%E6%95%99%E7%A8%8B2019%2F%E7%BA%AF%E6%AD%A3%E5%95%86%E4%B8%9A%E7%BA%A7%E5%BA%94%E7%94%A8-%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%BC%80%E5%8F%91%E5%AE%9E%E6%88%98)
- [lin-cms-vue](https://github.com/TaleLin/lin-cms-vue)
- [lin-cms-koa](https://github.com/TaleLin/lin-cms-koa)
## 学习内容
### 环境搭建
- 微信开发者工具
- MySQL
- postman
- Navicat
- nodemon/pm2
### Node的能力与应用
> node提供的API很"低级", 开发效率低, 所以基于nodejs, 有很多框架, 例如express, koa
- 脱离浏览器运行JS
- NodeJS Sream (前端工程化的基础)
- 开源
- 工具
- 服务端API (重点)
- 作为中间层

> 拓展:
 - 后端的职责
    - 读写数据库 (IO是性能瓶颈)
    - 提供API
### koa
> 1. koa框架很精简, 需要二次开发, e.g. koa-router也需要引入
> 2. 越精简, 定制化能力越强

拓展
- 模块加载
  - AMD
  - es6 modules
  - commonJS
    - nodejs暂时不支持es modules
    - 也可以用babel让nodejs提前es新特效
- Typescript
  - 适合大型, 维护
  - 类型校验
  - 对新ES功能支持的比较好

#### koa使用
```js
const Koa = require('koa')
const app = new Koa()

// 应用程序对象 中间件

app.listen(3000)
```
中间件就是函数, 需要用app.use()把中间件注册到app上
```js
const Koa = require('koa')

const app = new Koa()

// 一个函数
const test = () => {
  console.log(123)
}
// 注册中间件到app
app.use(test)

app.listen(3000, () => {
  console.log('server is on 3000')
})


```
中间件的使用
1. 第一个命中的中间件会自动执行
2. 下一个需要手动调用 next()

#### 洋葱模型
![洋葱模型](http://ww2.sinaimg.cn/large/006tNc79ly1g4bbd1iknrj30d20bf3yq.jpg)
```js
const Koa = require('koa')

const app = new Koa()

// 应用程序对象 中间件(函数, 只不过有格式的约定)

// 接收HTTP
// 中间件如要注册到应用上
app.use((ctx, next) => {
  console.log('middleware 1 上')
  next() // 调用下一个
  console.log('middleware 1 下')
})

app.use((ctx, next) => {
  console.log('middleware 2 上')
  next() // 调用下一个
  console.log('middleware 2 下')
})

app.listen(3000, () => {
  console.log('server is on 3000')
})



```
