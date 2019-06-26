// 同步中的异常, 可以冒泡, 被上层try-catch捕获
function fun1() {
  try {
    fun2()
  } catch (error) {
    console.log(
      '*******捕捉到了一个错误*******\n',
      error,
      '\n******************************'
    )
  }
}
function fun2() {
  fun3()
}
function fun3() {
  a
  return 'success'
}
fun1()
