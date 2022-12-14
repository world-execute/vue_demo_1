import Vue from 'vue'
import App from './App.vue'
// 导入路由
import router from './router'
// 导入状态管理
import store from './store'
// 导入插件
import './plugin'
// 导入全局样式
import './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
