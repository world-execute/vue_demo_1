const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  // 开发服务器配置
  devServer:{
    // 设置开发服务器端口号
    port:8000
  },

  // webpack相关
  configureWebpack:{
    // 解析
    resolve:{
      // 路径别名
      alias:{
        "@v":path.resolve(__dirname,'src/views'),
        "@c":path.resolve(__dirname,'src/components')
      }
    }
  }
})
