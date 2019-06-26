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
  a // 测试未知异常
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
