<template>
  <el-menu
      class="el-menu-vertical-demo"
      background-color="#252c33"
      text-color="#fff"
      active-text-color="#409eff"
      router
      unique-opened
      :collapse="isCollapse"
      style="border: none"
      :default-active="activePath"
      :collapse-transition="false">
    <div class="toggle-button" @click="toggleCollapse">
      <i :class="isCollapse?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"></i>
    </div>
    <!--一级菜单-->
    <el-submenu v-for="subitem in menulist" :key="subitem.id" :index="subitem.id +''">
      <!--一级菜单模板区-->
      <template slot="title">
        <!--图标-->
        <i :class="iconsObject[subitem.id]"></i>
        <!--文本-->
        <span>{{subitem.authName}}</span>
      </template>
      <!--二级菜单-->
      <el-menu-item
          v-for="item in subitem.children"
          :key="item.id" :index="item.path"
          @click="saveNavState(item.path)"
      >
        <template slot="title">
          <!--图标-->
          <i class="el-icon-menu"></i>
          <!--文本-->
          <span>{{item.authName}}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import {getMenus} from "@/api/homeApi";
import {mapState} from 'vuex'
export default {
  name: "AsideMenu",
  data() {
    return {
      menulist: [],
      iconsObject:{
        '125':'iconfont icon-haoyou',
        '103':'iconfont icon-quanxianshezhi',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-dingdandingdanmingxishouzhimingxi',
        '145':'iconfont icon-statistics-full'
      },
      // 是否折叠
      isCollapse:false
    }
  },
  computed:{
    ...mapState(['activePath'])
  },
  created() {
    getMenus().then(({data}) => {
      if(data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.menulist = data.data
    }).catch(reason => {
      console.log(reason)
    })
  },
  methods:{
    // 点击按钮切换展开与收起
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
      this.$emit('setValue',this.isCollapse)
    },
    // 保存连接激活状态
    saveNavState(activePath){
      this.$store.commit('changeActivePath',activePath)
    }
  }
}
</script>

<style lang="less" scoped>
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #57616e;
  color: #fff;
  text-align: center;
  font-size: 20px;
  line-height: 30px;
  cursor: pointer;
  i{
    transition: all 0.5s;
  }
}
</style>
