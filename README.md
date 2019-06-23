# nodejs + koa2开发微信小程序服务端<!-- omit in toc -->
- [相关](#%E7%9B%B8%E5%85%B3)
- [学习内容](#%E5%AD%A6%E4%B9%A0%E5%86%85%E5%AE%B9)
  - [环境搭建](#%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA)
  - [Node的能力与应用](#Node%E7%9A%84%E8%83%BD%E5%8A%9B%E4%B8%8E%E5%BA%94%E7%94%A8)
  - [koa](#koa)
    - [koa使用](#koa%E4%BD%BF%E7%94%A8)
    - [洋葱模型](#%E6%B4%8B%E8%91%B1%E6%A8%A1%E5%9E%8B)
    - [koa支持async函数](#koa%E6%94%AF%E6%8C%81async%E5%87%BD%E6%95%B0)
    - [深入理解async/await](#%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3asyncawait)
      - [await](#await)
    - [洋葱模型的意义](#%E6%B4%8B%E8%91%B1%E6%A8%A1%E5%9E%8B%E7%9A%84%E6%84%8F%E4%B9%89)
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
> koa按洋葱模型的顺序执行的先决条件: 必须用async, next()前必须加await

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
#### koa支持async函数
```js

pp.use(async (ctx, next) => {
  console.log('middleware 2 上')
  await next() // 异步调用下一个
  console.log('middleware 2 下')
})

```
async和await如果用, 都用, 否则, 顺序会变成下面:
```js
app.use((ctx, next) => {
  console.log('middleware 1 上')
  next()
  console.log('middleware 1 下')
})

app.use(async (ctx, next) => {
  console.log('middleware 2 上')
  // await后默认是异步调动, 所以阻塞内部
  await next() // Promise { undefined }
  console.log('middleware 2 下')
})

// middleware 1 上
// middleware 2 上
// middleware 1 下
// middleware 2 下
```
都用async/await就正常了
```js
app.use(async (ctx, next) => {
  console.log('middleware 1 上')
  await next()
  console.log('middleware 1 下')
})

app.use(async (ctx, next) => {
  console.log('middleware 2 上')
  await next()
  console.log('middleware 2 下')
})

// middleware 1 上
// middleware 2 上
// middleware 2 下
// middleware 1 下
```
中间件中的调用总会返回promise (内部实现是基于async/await)
```js
aapp.use((ctx, next) => {
  console.log('middleware 1 上')
  const res = next() // Promise { undefined }
  console.log(res)
  console.log('middleware 1 下')
})

app.use((ctx, next) => {
  console.log('middleware 2 上')
  console.log('middleware 2 下')
})

// middleware 1 上
// middleware 2 上
// middleware 2 下
// Promise { undefined }
// middleware 1 下
```
中间件可以return, koa内部是基于async/await实现的, 所以返回的是Promise对象, 如果返回的不是promise对象, 会强制转换成Promise对象
```js
app.use((ctx, next) => {
  console.log('middleware 1 上')
  const res = next() // Promise { 'abc' }
  console.log(res)
  console.log('middleware 1 下')
})

app.use((ctx, next) => {
  console.log('middleware 2 上')
  console.log('middleware 2 下')
  return 'abc'
})

// middleware 1 上
// middleware 2 上
// middleware 2 下
// Promise { 'abc' }
// middleware 1 下
```
#### 深入理解async/await
如何获取return中的值?
```js
app.use((ctx, next) => {
  console.log('middleware 1 上')
  // 方案一
  const res = next()
  res.then((data) => {
    console.log(data)
  })
  console.log('middleware 1 下')
})

app.use((ctx, next) => {
  console.log('middleware 2 上')
  console.log('middleware 2 下')
  return 'abc'
})

// middleware 1 上
// middleware 2 上
// middleware 2 下
// middleware 1 下
// abc
```
async/await代替promise
```js
// 内部有await, 必须是async 函数
app.use(async (ctx, next) => {
  console.log('middleware 1 上')

  // 方案二
  // await底层实现基于genarator, 所有不同于promise的执行顺序
  const res = await next()
  console.log(res)
  console.log('middleware 1 下')
})

app.use((ctx, next) => {
  console.log('middleware 2 上')
  console.log('middleware 2 下')
  return 'abc'
})

// middleware 1 上
// middleware 2 上
// middleware 2 下
// abc
// middleware 1 下

```
##### await
`await expression`
- 表达式
  - 可以接Promise对象
  - 可以后接其他表达式 e.g `10*10`
- 返回值
  - 返回Promise对象的处理结果, 只接收resolve状态
  - 如等待的不是Promise对象, 则返回改值本身
  - 如果是reject状态, 会抛出异常, 由try-catch捕获
- 暂停当前 async function 的执行，等待 Promise 处理完成  (generate中的yeild关键字使生成器函数执行暂停)
  - async内是阻塞的
  - async外是非阻塞的, async内也可以去并发请求  如promise.all
  - 阻塞当前线程, 这个说法是错误的
  
以下例子验证:
```js
const koa = require('koa')

const mockAsyn = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('等待2秒')
    }, 2000)
  })
}

const app = new koa()
app.use(async (ctx, next) => {
  const start = Date.now()
  // const res = mockAsyn() // case1
  const res = await mockAsyn() // case2
  const end = Date.now() 
  console.log('请求用时为: ', end - start, 'ms')
})
app.listen(3001, () => {
  console.log('server is running is 3001')
})

// case1
// 请求用时为:  0ms

// case2
// 请求用时为:  2002ms
```
但是没有阻塞函数外
```js
const mockAsyn = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('等待2秒')
    }, 2000)
  })
}

const testAsyn = async () => {
  console.log('1')

  const res = await mockAsyn()
  console.log('2', res)
}

testAsyn()

console.log('3')
console.log('4')


// 1
// 3
// 4
// 2 等待2秒
```
问: 为什么koa中间件要用async
- 内部如果用了await关键字, 函数一定要有async
- 如果内部没用到await, 可以不加
- koa是基于async/await实现的, 所以, 中间件return, 会是个Promise对象

#### 洋葱模型的意义
1. 是一个约定, 比如: logger中计算请求响应时长, 如果不按照洋葱模型, 就不准确
2. 中间件的数据流转通过ctx, 例如ctx.state用来保存公共数据
