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
    redirect: '/welcome',
    component: () => import('../views/Home'),
    children:[
      {
        path:'/welcome',
        component: () => import('../components/Welcome')
      },
      {
        path:'/users',
        component: () => import('../views/user/Users')
      },
      {
        path:'/rights',
        component:() => import('../views/power/Rights')
      },
      {
        path: '/roles',
        component:() => import('../views/power/Roles')
      },
      {
        path: '/categories',
        component:() => import('../views/goods/Cate')
      }
    ]
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
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // token不存在则跳转到登录页
  // token存在就不需要进入登录页,直接跳转到首页
  if(to.path ==='/login'){
    return tokenStr ? next('/home') : next()
  }else {
    // 访问其他路由时判断token是否存在
    // 存在则放行,不存在则跳转到登录页面
    return tokenStr ? next() : next('/login')
  }
})
router.afterEach(() => {
  Nprogress.done()
})

export default router
