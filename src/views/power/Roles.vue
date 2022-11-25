<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--角色列表卡片视图-->
    <el-card>
      <!--添加角色按钮区-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表区-->
      <el-table :data="rolesList" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['bdBottom',index === 0? 'bdtop':'','vcenter']"
                    v-for="(item,index) in scope.row.children"
                    :key="item.id"
                    style="margin: 0 20px 0 20px"
            >
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item.id)">
                  {{item.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!--嵌套渲染二级权限-->
                <el-row v-for="(item2,index2) in item.children"
                        :key="item2.id"
                        :class="[index2 ===0 ? '':'bdtop','vcenter']"
                >
                  <!--渲染二级权限-->
                  <el-col :span="6">
                    <el-tag type="success" closable  @close="removeRightById(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--渲染三级权限-->
                  <el-col :span="18">
                    <el-tag
                        v-for="(item3,index3) in item2.children"
                        :key="index3.id"
                        type="warning"
                        closable
                        @close="removeRightById(scope.row,item3.id)"
                    >
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="slot">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="showEditDialog(slot.row.id)"
            >编辑</el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="showDeleteDialog(slot.row.id)"
            >删除</el-button>
            <!--TODO 分配权限-->
            <el-button type="warning" icon="el-icon-setting" size="mini"
                       @click="showSetRightDialog(slot.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加角色的dialog-->
    <el-dialog
        title="添加角色"
        width="30%"
        :visible.sync="addDialogVisible"
        @close="addDialogClosed"
    >
      <!--内容主体区-->
      <el-form :model="addForm" :rules="addFormRules"
               ref="addForm" label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName" >
          <el-input v-model="addForm.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" placeholder="对角色进行简单描述,可以为空" clearable></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>
    <!--修改角色的dialog-->
    <el-dialog
        title="添加角色"
        width="30%"
        :visible.sync="editDialogVisible"
        @close="editDialogClosed"
    >
      <!--内容主体区-->
      <el-form :model="editForm" :rules="addFormRules"
               ref="editForm" label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName" >
          <el-input v-model="editForm.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" placeholder="对角色进行简单描述,可以为空" clearable></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
    </el-dialog>
    <!--分配权限的dialog-->
    <el-dialog
        title="分配权限"
        width="50%"
        :visible.sync="setRightDialogVisible"
        @close=""
    >
      <!--内容主体区,树型控件-->
      <el-tree :data="rightsList"
               :props="treeProps"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys="defKeys"
               ref="treeRef"
      >
      </el-tree>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogClosed">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import {get_rolesList,addRoles,getRolesById,editRolesById,
    deleteRolesById,deleteRightByRolesId,get_rightsList,
    setRightByRolesId
} from "@/api/powerApi";
import {deleteUser} from "@/api/userApi";
export default {
  name: "Roles",
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 角色id(用于分配权限)
      rolesId:'',
      // 控制添加角色对话框的显示和隐藏
      addDialogVisible: false,
      // 控制修改角色对话框的显示和隐藏
      editDialogVisible: false,
      // 控制分配权限对话框的显示和隐藏
      setRightDialogVisible:false,
      // 添加角色的表单数据
      addForm:{
        roleName:'',
        // 角色描述可以为空
        roleDesc:''
      },
      // 添加角色的表单数据验证
      addFormRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
        ]
      },
      // 编辑角色的表单数据
      editForm:{},
      // 所有权限的数据
      rightsList:[],
      // 树形控件属性绑定
      treeProps:{
        label: 'authName',
        children: 'children'
      },
      // 树形控件默认选中的数据
      defKeys:[]
    }
  },
  created() {
    this.getRolesList()
  },
  methods:{
    // 获取角色列表
    async getRolesList(){
      const {data:res} = await get_rolesList()
      if(res.meta.status !== 200){
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    // 关闭添加角色对话框时
    addDialogClosed(){
      // 清空对话框中表单数据
       this.$refs['addForm'].resetFields();
    },
    // 确认添加角色
    addUser(){
      this.$refs['addForm'].validate(async (valid) => {
        if (!valid) return
        const {data:res} = await addRoles(this.addForm)
        if(res.meta.status !== 201){
          return this.$message.error('创建角色失败')
        }
        this.$message.success('创建用户成功')
        await this.getRolesList()
        this.addDialogVisible = false
      })
    },
    // 关闭修改角色对话框时
    editDialogClosed(){
      this.editDialogVisible = false
    },
    // 确定修改角色
    editUser(){
      this.$refs['editForm'].validate(async (valid) => {
        if(!valid) return
        const {data:res} = await editRolesById(this.editForm.roleId,this.editForm)
        if(res.meta.status !== 200){
          return this.$message.error('修改角色信息失败')
        }
        this.$message.success('修改用户信息成功')
        await this.getRolesList()
        this.editDialogVisible = false
      })
    },
    // 显示修改角色对话框时
    showEditDialog(id){
      this.editDialogVisible = true
      getRolesById(id).then(({data:res})=>{
        if(res.meta.status !== 200){
          return this.$message.error('获取角色失败')
        }
        this.editForm = res.data
      })
    },
    // 显示删除角色提示框
    async showDeleteDialog(id){
      // 弹框询问是否删除
      const confirmRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(reason => reason )
      if(confirmRes !== 'confirm'){
        return this.$message.info('已取消删除')
      }
      const {data:res} = await deleteRolesById(id)
      if(res.meta.status !== 200){
        return this.$message.error('删除角色信息失败')
      }
      this.$message.success('删除角色信息成功')
      await this.getRolesList()
    },
    // 删除指定id的权限
    removeRightById: async function (role, rightId) {
      const confirmRes = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(reason => reason)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // console.log(roleId,rightId)
      const {data: res} = await deleteRightByRolesId(role.id, rightId)
      if (res.meta.status !== 200) {
        return this.$message.error('删除对应权限失败')
      }
      this.$message.success('删除对应权限成功')
      role.children = res.data
    },
    // 显示分配权限的对话框
    async showSetRightDialog(node){
      // 获取所有权限的树状数据
      const {data:res} = await get_rightsList('tree')
      if(res.meta.status !== 200){
        return this.$message.error('获取用户权限失败')
      }
      // 获取的权限数据保存到data中
      this.rightsList = res.data
      // 保存角色id方便分配权限
      this.rolesId = node.id
      // 递归获取三级节点数据
      this.defKeys.splice(0,this.defKeys.length)
      this.getLeafKeys(node,this.defKeys)
      this.setRightDialogVisible = true
    },
    // 递归获取所有三级权限id
    getLeafKeys(node,arr){
      // 判断节点是否为三级节点,即是否含有children子节点
      if(!node.children){
        return arr.push(node.id)
      }
      // 循环node子节点
      node.children.forEach(item => {
        this.getLeafKeys(item,arr)
      })
    },
    // 监听权限对话框关闭事件
    setRightDialogClosed(){
      this.defKeys.splice(0,this.defKeys.length)
      this.setRightDialogVisible = false
    },
    // 设置角色权限
    async allotRights(){
      const keys = [
          ...this.$refs['treeRef'].getCheckedKeys(),
          ...this.$refs['treeRef'].getHalfCheckedKeys()
      ]
      // 数组拼接为字符串,用逗号间隔
      const idStr = keys.join(',')
      const {data:res}= await setRightByRolesId(this.rolesId, {rids: idStr})
      console.log(res)
      if(res.meta.status !== 200){
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      await this.getRolesList()
      this.setRightDialogVisible = false
    }
  }

}
</script>

<style scoped>
.el-tag{
  margin: 10px;
}
.bdtop{
  border-top: 1px solid #eeeeee;
}
.bdBottom{
  border-bottom: 1px solid #eeeeee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
