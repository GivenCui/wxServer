const Router = require('koa-router')
const requireDirectory = require('require-directory')
const path = require('path')

class InitManager {
  static initCore(app) {
    // 入口方法
    InitManager.app = app
    InitManager.initLoadrouters()
  }

  static initLoadrouters() {
    // 动脑筋 思考 能不能简化写法
    // '../app/api'写死的路径不利于代码重构复用
    // 1. 绝对路径
    // 2. 可以提供接口配置path
    const apiPath = path.resolve(process.cwd(), './app/api')
    requireDirectory(module, apiPath, {
      visit(module) {
        if (module instanceof Router) {
          // 注册路由
          InitManager.app.use(module.routes())
        }
      }
    })
  }
}

module.exports = InitManager
