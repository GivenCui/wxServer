const path = require('path')
// 测试node常用path相关

console.log('__dirname: ', __dirname) // 当前文件所在的目录
console.log('path.resolve("test.js"): ', path.resolve('test.js')) // 返回绝对路径
console.log('path.join("test.js"): ', path.join('test.js')) // 返回相对路径

console.log('process.cwd(): ', process.cwd()) // Node.js 进程的当前工作目录, 在不同的目录启动, 会变动
