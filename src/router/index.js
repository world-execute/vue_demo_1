import Vue from 'vue'
import VueRouter from 'vue-router'
// 注册Nprogress 跳转进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    name:'login',
    component: () => import('../views/Login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home')
  },
  {
    path: '*',
    name: 'nofound',
    component: () => import('../views/NoFound')
  }
]

const router = new VueRouter({
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  Nprogress.start()
  if(to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})
router.afterEach(() => {
  Nprogress.done()
})

export default router
