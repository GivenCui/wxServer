const Koa = require('koa')
const app = new Koa()
// 引入路由
const book = require('./api/v1/book')
const classic = require('./api/v1/classic')

// 注册路由
app.use(book.routes())
app.use(classic.routes())

app.listen(3000, () => {
  console.log('server is on 3000')
})
