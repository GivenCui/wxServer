const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const InitManager = require('./core/init')
const exception = require('./middlewares/exception')
const app = new Koa()

app.use(exception)
app.use(bodyParser()) // 解析request中的body

InitManager.initCore(app)
app.listen(3000, () => {
  console.log('server is on 3000')
})
