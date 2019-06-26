// 异步的异常处理
async function fun1() {
  try {
    const res = await fun2()
    console.log(res)
  } catch (error) {
    console.log(
      '*******捕捉到了一个错误*******\n',
      error,
      '\n******************************'
    )
  }
}
async function fun2() {
  return await fun3()
}
async function fun3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const r = Math.random()
        a
        if (r < 0.6) {
          reject('error')
        }
        resolve('success')
      } catch (error) {
        reject(error)
      }
    }, 1000)
  })
}
fun1()
