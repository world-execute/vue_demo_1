<template>
  <div>
    Home 组件
    <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    loginOut() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
