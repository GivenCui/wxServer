# 异步异常与全局异常处理<!-- omit in toc -->
- [相关](#%E7%9B%B8%E5%85%B3)
- [参数获取与LinValidator校验器](#%E5%8F%82%E6%95%B0%E8%8E%B7%E5%8F%96%E4%B8%8ELinValidator%E6%A0%A1%E9%AA%8C%E5%99%A8)
  - [路由中传参的4种形式](#%E8%B7%AF%E7%94%B1%E4%B8%AD%E4%BC%A0%E5%8F%82%E7%9A%844%E7%A7%8D%E5%BD%A2%E5%BC%8F)
  - [路由参数的校验](#%E8%B7%AF%E7%94%B1%E5%8F%82%E6%95%B0%E7%9A%84%E6%A0%A1%E9%AA%8C)
    - [编写校验层目的](#%E7%BC%96%E5%86%99%E6%A0%A1%E9%AA%8C%E5%B1%82%E7%9B%AE%E7%9A%84)
    - [LinValidator](#LinValidator)
- [异常理论与异常链](#%E5%BC%82%E5%B8%B8%E7%90%86%E8%AE%BA%E4%B8%8E%E5%BC%82%E5%B8%B8%E9%93%BE)
  - [异常处理基本理论](#%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86%E5%9F%BA%E6%9C%AC%E7%90%86%E8%AE%BA)
  - [异步的try-catch](#%E5%BC%82%E6%AD%A5%E7%9A%84try-catch)
- [异常处理中间件 (全局)](#%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86%E4%B8%AD%E9%97%B4%E4%BB%B6-%E5%85%A8%E5%B1%80)
- [异常返回格式](#%E5%BC%82%E5%B8%B8%E8%BF%94%E5%9B%9E%E6%A0%BC%E5%BC%8F)
  - [错误分类](#%E9%94%99%E8%AF%AF%E5%88%86%E7%B1%BB)
  - [应该返回前端的信息](#%E5%BA%94%E8%AF%A5%E8%BF%94%E5%9B%9E%E5%89%8D%E7%AB%AF%E7%9A%84%E4%BF%A1%E6%81%AF)
- [HttpException异常基类](#HttpException%E5%BC%82%E5%B8%B8%E5%9F%BA%E7%B1%BB)
- [特定异常类与global全局变量](#%E7%89%B9%E5%AE%9A%E5%BC%82%E5%B8%B8%E7%B1%BB%E4%B8%8Eglobal%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F)
## 相关
[Lin CMS-koa文档](http://doc.cms.7yue.pro/lin/server/)
## 参数获取与LinValidator校验器
### 路由中传参的4种形式
1. path中动态匹配参数  e.g. `/v1/:id/book`
2. querystring
3. request.body
4. request.header

```js
const Router = require('koa-router')
const router = new Router()

router.post('/v1/:id/classic/latest', (ctx, next) => {
  // 获取路由参数的4种形式
  const params = ctx.params
  const query = ctx.request.query
  const headers = ctx.request.header
  const body = ctx.request.body // 需要koa-bodyparser

  ctx.body = {
    key: 'classic',
    params,
    query,
    headers,
    body
  }
})

module.exports = router

```
### 路由参数的校验
> Python中第三方库WTForms可以校验, LinValidator(看看)
#### 编写校验层目的
- 拦截非法参数
  - 数据类型错误
  - xss, sql注入
  - 邮箱格式校验
- 给客户端明确的提示

#### LinValidator
[LinValidator](../code/7yue-island/island/core/lin-validator.js)
[LinValidator-v2](../code/7yue-island/island/core/lin-validator-v2.js)
[文档](http://doc.cms.7yue.pro/lin/server/)

## 异常理论与异常链
### 异常处理基本理论
底层报错, 会冒泡到上层, 通过try-catch解决, 但是
- 不一定没个中间调用都会用try-catch包裹
- try-catch对异步方法, 不能捕捉到错误

```js
// 同步中的异常, 可以冒泡, 被上层try-catch捕获
function fun1() {
  try {
    fun2()
  } catch (error) {
    console.log(
      '*******捕捉到了一个错误*******\n',
      error,
      '\n******************************'
    )
  }
}
function fun2() {
  fun3()
}
function fun3() {
  a
  return 'success'
}
fun1()

```

### 异步的try-catch
- 返回的`Promise对象`, 如果不是用`Promise`包装
- 用`await`接收`Promise`就可以`try-catch`
- 所有的函数都写为`async/await`
```js
// 异步的异常处理
async function fun1() {
  try {
    const res = await fun2()
    console.log(res)
  } catch (error) {
    console.log(
      '*******捕捉到了一个错误*******\n',
      error,
      '\n******************************'
    )
  }
}
async function fun2() {
  return await fun3()
}
async function fun3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const r = Math.random()
        a
        if (r < 0.6) {
          reject('error')
        }
        resolve('success')
      } catch (error) {
        reject(error)
      }
    }, 1000)
  })
}
fun1()

```
## 异常处理中间件 (全局)
> 拓展: AOP 面向切面编程
```js
const exception = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    ctx.body = {
      error: error.message
    }
  }
}

module.exports = exception

```
## 异常返回格式
### 错误分类
- 已知错误, 一般会处理, 比较明确
- 未知错误, 是不明朗的, 未被try-catch捕获的, 统一返回错误码
### 应该返回前端的信息
- HTTP Status Code  (2xx, 4xx, 5xx)
- 自定义message
- error_code (10001)
- reuqest_url

## HttpException异常基类
> 基类中的reuqestUrl放在错误中间件中设置

异常基类
```js
// core/HttpException.js

class HttpException extends Error {
  // 只有继承自Error才能被throw抛出
  constructor(msg = '服务器异常', errorCode = 1000, code = 400) {
    super()
    this.errorCode = errorCode
    this.code = code
    this.msg = msg
  }
}

module.exports = HttpException

```
错误捕获中间件, 统一格式返回
```js
// middlewares/exception.js

const HttpException = require('../core/HttpException')

const exception = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    // 已知类型的错误
    if (error instanceof HttpException) {
      ctx.status = error.code // 状态码
      ctx.body = {
        msg: error.msg,
        errorCode: error.errorCode, // 自定义错误码
        request: `${ctx.method} ${ctx.path}`
      }
    }
  }
}

module.exports = exception

```
处理错误信息的应用
```js
// app/api/v1/classic.js

const Router = require('koa-router')
const {
  HttpException
} = require('../../../core/HttpException')
const router = new Router()

router.post('/v1/:id/classic/latest', (ctx, next) => {
  // 获取路由参数的4种形式
  const params = ctx.params
  const query = ctx.request.query
  const headers = ctx.request.header
  const body = ctx.request.body // 需要koa-bodyparser
  if (true) {
    const error = new HttpException('出错啦', 10000, 500)
    throw error // 抛出错误, 会由 middlewares/exception.js中间件捕获, 并统一格式返回
  }
  ctx.body = {
    key: 'classic',
    params,
    query,
    headers,
    body
  }
})

module.exports = router

```
## 特定异常类与global全局变量
> global可以挂一些全局的属性, 不过, 不推荐

参数错误类 `ParameterException`
```js
// core/HttpException.js

class HttpException extends Error {
  // 只有继承自Error才能被throw抛出
  constructor(msg = '服务器异常', errorCode = 1000, code = 400) {
    super()
    this.errorCode = errorCode
    this.code = code
    this.msg = msg
  }
}

class ParameterException extends HttpException {
  // 只有继承自Error才能被throw抛出
  constructor(msg = '参数错误', errorCode = 10000) {
    super()
    this.code = 400
    this.msg = msg
    this.errorCode = errorCode
  }
}

module.exports = {
  HttpException,
  ParameterException
}

```
参数错误类应用

```js
// app/api/v1/classic.js
const Router = require('koa-router')
const {
  HttpException,
  ParameterException
} = require('../../../core/HttpException')
const router = new Router()

router.post('/v1/:id/classic/latest', (ctx, next) => {
  // 获取路由参数的4种形式
  const params = ctx.params
  const query = ctx.request.query
  const headers = ctx.request.header
  const body = ctx.request.body // 需要koa-bodyparser
  if (true) {
    const error = new ParameterException()
    throw error
  }
  ctx.body = {
    key: 'classic',
    params,
    query,
    headers,
    body
  }
})

module.exports = router

```
