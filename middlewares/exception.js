const { HttpException } = require('../core/http-exception')

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
      console.error(error) // 可以通过pm2打印日志
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
