<template>
    <el-container class="home_container">
      <!--头部区域-->
      <el-header>
        <div>
          <img src="../assets/logo.png">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="loginOut" size="small">退出</el-button>
      </el-header>
      <!--页面主体-->
      <el-container>
        <!--侧边栏-->
        <el-aside :width="isCollapse? '64px':'200px'">
          <aside-menu @setValue="getIsCollapse"></aside-menu>
        </el-aside>
        <!--内容主体-->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import AsideMenu from "@/components/AsideMenu";
export default {
  name: "Home",
  data() {
    return {
      isCollapse: false
    }
  },
  components:{
    AsideMenu
  },
  methods: {
    loginOut() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    // 获取子组件是否折叠数据
    getIsCollapse(value){
      this.isCollapse = value
    }
  }
}
</script>

<style lang="less" scoped>
.home_container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #eeffff;
  font-size: 20px;
  div{
    display: flex;
    align-items: center;
    img{
      width: 70px;
    }
    span{
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: #252c33;
}
.el-main{
  background-color: #eeeeee;
}
</style>
