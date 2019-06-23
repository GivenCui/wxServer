const koa = require('koa')
const app = new koa()

const mockAsyn = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('等待2秒')
    }, 2000)
  })
}

app.use((ctx, next) => {
  console.log(1)
  next()
  console.log(2)
})
app.use(async (ctx, next) => {
  console.log(3)
  // const res = await mockAsyn()
  // await后默认是异步调动, 所以阻塞内部
  await next() // Promise{ undefined }
  console.log(4)
})
app.listen(3001, () => {
  console.log('server is running is 3001')
})
