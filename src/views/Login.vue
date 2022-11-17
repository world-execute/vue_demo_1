<template>
  <div class="main">
    <div class="login">
      <el-form
          size="mini"
          :hide-required-asterisk="true"
          :model="form"
          status-icon
          :rules="rules"
          ref="form"
          class="demo-ruleForm">
        <el-form-item size="100" label-width="60px" label="用户名" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item size="100" label-width="60px" label="密码" prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-row style="width: 100%" justify="space-between">
            <el-col :span="12">
              <el-button type="primary" @click="submitForm('form')">登录</el-button>
            </el-col>
            <el-col :span="12">
              <el-button @click="resetForm('form')">重置</el-button>
            </el-col>
          </el-row>
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
      form: {
        // 登录名
        username:'',
        // 密码
        password:''
      },
      // 数据验证
      rules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'}
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {min:5,max:10,message: '密码长度应该在5到10个字符',trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          // TODO 实现登录
          userLogin({
            username:this.form.username,
            password:this.form.password
          }).then(value => {
            if(value.status === 200){
              this.$message({
                message:'登陆成功',
                type:'success'
              })
            }else {
              this.$message({
                message:value.data.msg,
                type:'error'
              })
            }
          }).catch(reason => {
            console.log(reason.data)
          })
        } else {
          this.$message({
            message:'提交信息有误',
            type:'error'
          })
          return false;
        }
      });
    },
    resetForm(form) {
      this.$refs[form].resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  .login{
    width: 300px;
    height: 160px;
    padding: 20px;
    border: 1px solid;
  }
}
</style>
