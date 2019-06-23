const mockAsyn = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('等待2秒')
    }, 2000)
  })
}

const testAsyn = async () => {
  console.log('1')

  const res = await mockAsyn()
  console.log('2', res)
}

testAsyn()

console.log('3')
console.log('4')

const test1 = async () => {
  const res = await (10 * 10)
  console.log('5', res)
}
test1()

// 1
// 3
// 4
// 5 100
// 2 等待2秒
