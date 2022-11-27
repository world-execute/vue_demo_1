<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="头像">
      </div>
      <!--表单区-->
      <el-form ref="form" :model="loginForm" :rules="rules" class="login_form">
        <el-form-item prop="username">
          <el-input
              prefix-icon="iconfont icon-yonghutianchong"
              v-model="loginForm.username"
              placeholder="请输入用户名">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              prefix-icon="iconfont icon-tianchongxing-"
              v-model="loginForm.password"
              placeholder="请输入密码"
              type="password">
          </el-input>
        </el-form-item>
        <!--按钮区-->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('form')">登录</el-button>
          <el-button type="info" @click="resetForm('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {userLogin} from '@/api/userApi'
export default {
  name: "Login",
  data() {
    return {
      // 表单数据
      loginForm: {
        // 登录名
        username:'',
        // 密码
        password:''
      },
      // 数据验证
      rules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {min:3,max:10,message: '用户名长度应该在3到10个字符',trigger:'blur'}
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {min:6,max:10,message: '密码长度应该在6到10个字符',trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if(!valid) return
        userLogin(this.loginForm).then(({data:res}) =>{
          // console.log(res)
          if(res.meta.status !== 200){
            this.$message.error(res.meta.msg)
          }else {
            // 登录成功
            this.$message.success(res.meta.msg)
            // 保存token
            window.sessionStorage.setItem('token',res.data.token)
            // 编程式导航到后台主页
            this.$router.push('/home')
          }
        }).catch(reason => {
          this.$message.error('请求失败,请稍后再试')
        })
      });
    },
    resetForm(form) {
      this.$refs[form].resetFields();
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  height: 100%;
  background-color: #2b4b6b;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 5px;
  position: absolute;
  left: calc(50% - 225px);
  top: calc(50% - 150px);
  .avatar_box{
    position: absolute;
    left: calc(50% - 50px);
    top: -50px;
    height: 100px;
    width: 100px;
    padding: 8px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0  10px #afafaf;
    backdrop-filter: blur(10px);
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eff;
    }
  }
}
.login_form{
  width: 100%;
  position: absolute;
  bottom: 10px;
  padding: 0 50px;
  //box-sizing 定义如何计算元素的宽度和高度:是否应该包含填充和边框
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
