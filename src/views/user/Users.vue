<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!--搜索与添加区-->
          <el-input v-model="queryInfo.query" placeholder="根据姓名查找" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
          :data="userlist"
          border
          stripe
      >
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state" width="70">
          <template v-slot="scope">
            <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#bebebe"
                @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!--分配角色按钮-->
            <el-tooltip class="item" effect="dark" content="分配角色"
                        placement="top" :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!--添加用户的dialog-->
    <el-dialog
        title="添加用户"
        width="30%"
        :visible.sync="addDialogVisible"
        @close="addDialogClosed"
    >
      <!--内容主体区-->
      <el-form :model="addForm" :rules="addFormRules"
               ref="addForm" label-width="70px"
      >
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="addForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" clearable></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>
    <!--修改用户的dialog-->
    <el-dialog
        title="修改用户"
        width="30%"
        :visible.sync="editDialogVisible"
        @close="editDialogClosed"
    >
      <!--内容主体区-->
      <el-form :model="editForm" :rules="addFormRules"
               ref="editForm" label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" clearable></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
    </el-dialog>
    <!--分配用户角色的对话框-->
    <el-dialog
        title="分配权限"
        :visible.sync="setRoleDialogVisible"
        width="30%"
        @close="setRoleDialogClosed"
       >
      <!--内容主体-->
      <div class="selected_div">
        <p>当前的用户:<span>{{userinfo.username}}</span></p>
        <p>当前的角色:<span>{{userinfo.role_name}}</span></p>
        <p>分配新角色
          <el-select v-model="selectedRoleID" placeholder="请选择">
            <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <!--尾部-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {get_userList,changeUserState,addUser,
  get_userById,editUser,deleteUser,setRoleByUserId
} from "@/api/userApi";
import {get_rolesList} from "@/api/powerApi";

export default {
  name: "Users",
  data() {
    return {
      queryInfo:{
        query:'',
        // 当前页数
        pagenum:1,
        pagesize:5
      },
      // 用户列表
      userlist:[],
      // 用户列表总数
      total:0,
      // 要被分配角色的用户信息
      userinfo:{},
      // 所有角色列表
      rolesList:[],
      // 选中已选中的角色id
      selectedRoleID:'',
      // 控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示和隐藏
      editDialogVisible: false,
      // 控制分配用户角色对话框的显示和隐藏
      setRoleDialogVisible: false,
      // 添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      // 修改用户的表单数据
      editForm:{},
      // 添加用户的表单验证规则
      addFormRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type:'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
        ],
        mobile:[
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern:/^1[3456789]\d{9}$/,
            message: '请输入有效的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods:{
    // 获取用户数据
    async getUserList(){
      const {data:res} = await get_userList(this.queryInfo)
      if(res.meta.status !== 200){
        return this.$message.error('获取用户信息失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听每页显示条数改变事件
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听用户状态的改变
    async userStateChange(userinfo){
      // console.log(userinfo)
      const {data:res} = await changeUserState(userinfo.id,userinfo.mg_state)
      if(res.meta.status !== 200){
        // 操作失败,状态取反,页面保持和数据库一致
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听添加用户对话框关闭事件
    addDialogClosed(){
      this.$refs['addForm'].resetFields()
    },
    // 点击按钮添加用户
    addUser(){
      this.$refs['addForm'].validate(async (valid) => {
        if(!valid) return
        // 请求api添加用户
        const {data:res} = await addUser(this.addForm)
        if(res.meta.status !== 201){
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        // 隐藏添加的对话框
        this.addDialogVisible = false
        // 刷新列表
        await this.getUserList()
      })
    },
    // 显示修改用户信息的对话框
    async showEditDialog(id){
      // console.log(id)
      const {data:res} = await get_userById(id)
      if(res.meta.status !== 200){
        return this.$message.error('查询用户失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框关闭事件
    editDialogClosed(){
      this.$refs['editForm'].resetFields()
    },
    // 修改用户信息提交
    editUserInfo(){
      this.$refs['editForm'].validate(async valid => {
        if(!valid) return
        // 发起修改用户的请求
        const{data:res} = await editUser(this.editForm.id,this.editForm)
        if(res.meta.status !== 200){
          return this.$message.error('更新用户信息失败')
        }
        this.$message.success('更新用户信息成功')
        this.editDialogVisible = false
        await this.getUserList()
      })
    },
    // 根据id删除用户
    async removeUserById(id){
      // 弹框询问是否删除
      const confirmRes = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(reason => reason )
      // 用户点击确定,res的值为confirm
      // 用户点击取消,res的值为cancel
      if(confirmRes !== 'confirm'){
        return this.$message.info('已取消删除')
      }
      const {data:res} = await deleteUser(id)
      if(res.meta.status !== 200){
        return this.$message.error('删除用户信息失败')
      }
      this.$message.success('删除用户信息成功')
      await this.getUserList()
    },
    //展示分配角色的对话框
    async setRole(userInfo){
      this.setRoleDialogVisible = true
      this.userinfo = userInfo
      // 在展示对话框之前,获取所有的角色列表
      // TODO 获取角色列表
      const {data:res} =  await get_rolesList()
      if(res.meta.status !== 200){
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    // 点击按钮分配角色
    async saveRoleInfo(){
      if(!this.selectedRoleID){
        return this.$message.error('请选择要分配的角色!')
      }
      const {data:res} = await setRoleByUserId(this.userinfo.id,{rid:this.selectedRoleID})
      if (res.meta.status !== 200){
        return this.$message.error('分配角色失败')
      }
      this.$message.success('分配角色成功')
      await this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 关闭分配角色对话框时重置用户的选择
    setRoleDialogClosed(){
      this.selectedRoleID =''
      this.userinfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
.selected_div{
  p{
    margin-bottom: 15px;
    span{
      margin-left: 10px;
      color: #409eff;
      font-weight: bolder;
    }
  }
}
</style>
