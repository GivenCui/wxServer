const Koa = require('koa')

const app = new Koa()

// 应用程序对象 中间件(函数, 只不过有格式的约定)

// 接收HTTP
// 中间件如要注册到应用上
app.use((ctx, next) => {
  console.log('middleware 1 上')
  next()
  console.log('middleware 1 下')
})

app.use((ctx, next) => {
  console.log('middleware 2 上')
  // next()
  // console.log('middleware 2 下')
})

app.listen(3000, () => {
  console.log('server is on 3000')
})
