const Router = require('koa-router')
const router = new Router()

router.get('/v1/book/latest', async (ctx, next) => {
  throw new Error('API Exception')
  ctx.body = {
    key: 'book'
  }
})

module.exports = router
