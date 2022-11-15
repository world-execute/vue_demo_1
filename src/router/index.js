import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name:'login',
    component: () => import('@v/Login')
  },
  {
    path: '*',
    name: 'nofound',
    component: () => import('@v/NoFound')
  }
]

const router = new VueRouter({
  routes
})

export default router
