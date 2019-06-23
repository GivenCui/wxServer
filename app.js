const Koa = require('koa')

const app = new Koa()

// 应用程序对象 中间件(函数, 只不过有格式的约定)

// 接收HTTP
// 中间件如要注册到应用上
app.use(async (ctx, next) => {
  try {
    console.log('middleware 1 上')
    // 方案一
    // const res = next()
    // res.then(data => {
    //   console.log(data)
    // })

    // 方案二
    const res = await next()
    console.log(res)
    console.log('middleware 1 下')
  } catch (err) {
    console.error('catch捕获', err)
  }
})

app.use(async (ctx, next) => {
  console.log('middleware 2 上')
  // await next()
  console.log('middleware 2 下')
  return Promise.reject('reject')
})

app.listen(3000, () => {
  console.log('server is on 3000')
})
