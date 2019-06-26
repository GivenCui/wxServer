const { HttpException } = require('../core/HttpException')

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
