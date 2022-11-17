import Vue from 'vue'
import App from './App.vue'
// 导入路由
import router from './router'
// 导入状态管理
import store from './store'
// 导入插件
import './plugin'
// 注册Nprogress 跳转进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false

// 全局路由守卫
router.beforeEach((to, from, next) => {
  Nprogress.start()
  next()
})
router.afterEach(() => {
  Nprogress.done()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
