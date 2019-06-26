# LinValidator校验器与Sequelize Orm生成MySQL数据表<!-- omit in toc -->
- [相关](#%E7%9B%B8%E5%85%B3)
- [Lin-Validator使用指南](#Lin-Validator%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97)
## 相关
[Lin CMS-koa文档](http://doc.cms.7yue.pro/lin/server/)

## Lin-Validator使用指南
> 处理未知异常

```js
// middlewares/exception.js

const { HttpException } = require('../core/HttpException')

const exception = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    const request = `${ctx.method} ${ctx.path}`
    // 已知类型的错误
    if (error instanceof HttpException) {
      ctx.status = error.code // 状态码
      ctx.body = {
        msg: error.msg,
        errorCode: error.errorCode, // 自定义错误码
        request
      }
    } else {
      // 未知的异常
      // console.error(error) // 可以通过pm2打印日志
      ctx.body = {
        msg: '服务器有错误...',
        errorCode: 999,
        request
      }
      ctx.status = 500
    }
  }
}

module.exports = exception

```
