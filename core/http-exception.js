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
