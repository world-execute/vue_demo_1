import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 激活的菜单路由
    activePath:''
  },
  getters: {
  },
  mutations: {
    changeActivePath(state,activePath){
      state.activePath = activePath
    }
  },
  actions: {
  },
  modules: {
  }
})
