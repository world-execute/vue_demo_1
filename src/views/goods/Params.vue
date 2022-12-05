<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--头部警告区域-->
      <el-alert
          show-icon
          title="注意: 只允许为第三级分类设置相关参数! "
          :closable="false"
          type="warning">
      </el-alert>
      <!--选择商品分类区-->
      <el-row class="cat_opt">
        <el-col>
          <span style="margin-right:15px ">选择商品分类:</span>
          <!--选择商品分类的级联选择框-->
          <el-cascader
              v-model="selectCateList"
              :options="cateList"
              :props="cateProps"
              style="width: 300px"
              @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!--tabs页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!--添加动态参数的面板-->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="small" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data="manyTableData" border stripe width="100%">
            <!--展开行-->
            <el-table-column type="expand" width="50">
              <template slot-scope="scope">
                <!--循环渲染Tag标签-->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index"
                        closable @close="handleClose(index,scope.row)" >
                  {{item}}
                </el-tag>
                <!--输入文本框-->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                >
                <!--添加按钮,点击后切换到输入框  -->
                </el-input>
                <el-button v-else class="button-new-tag" size="small"
                           @click="showInput(scope.row)" style="margin-left: 10px">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <!--修改按钮-->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                <!--删除按钮-->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--添加静态属性的面板-->
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="small" @click="addDialogVisible=true">添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data="onlyTableData" border stripe width="100%">
            <!--展开行-->
            <el-table-column type="expand" width="50">
              <template slot-scope="scope">
                <!--循环渲染Tag标签-->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index"
                        closable @close="handleClose(index,scope.row)" >
                  {{item}}
                </el-tag>
                <!--输入文本框-->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                >
                  <!--添加按钮,点击后切换到输入框  -->
                </el-input>
                <el-button v-else class="button-new-tag" size="small"
                           @click="showInput(scope.row)" style="margin-left: 10px">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <!--修改按钮-->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                <!--删除按钮-->
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加参数的对话框-->
    <el-dialog
        :title="titleText"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addDialogClosed"
    >
      <!--添加参数的表单-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑参数的对话框-->
    <el-dialog
        :title="'修改'+titleText"
        :visible.sync="editDialogVisible"
        width="30%"
        @close="editDialogClosed"
    >
      <!--添加参数的表单-->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getCategorie,getCateAttributesById,addCateAttributesById,
editCateAttributesById,deleteCateAttributesById} from "@/api/goodsApi";

export default {
  name: "Params",
  data() {
    return {
      // 控制添加参数对话框的显示与隐藏
      addDialogVisible:false,
      // 控制编辑参数对话框的显示与隐藏
      editDialogVisible:false,
      // 商品列表
      cateList:[],
      // 级联选择框配置
      cateProps:{
        expandTrigger: 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      // 添加参数的表单数据
      addForm:{
        // 参数名称
        attr_name:'',
        // 参数类别
        attr_sel:'many'
      },
      // 编辑参数的表单数据
      editForm:{
        // 参数id
        attr_id:0,
        // 参数名称
        attr_name:'',
        // 参数类别
        attr_sel:'many'
      },
      // 添加参数的表单验证
      addFormRules:{
        attr_name:[
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 级联选择框双向绑定的数据
      selectCateList:[],
      // 被激活的页签名称
      activeName:'many',
      // 动态参数表格数据
      manyTableData:[],
      // 静态参数表格数据
      onlyTableData:[]
    }
  },
  created() {
    this.get_Categorie()
  },
  computed:{
    // 控制按钮是否被禁用
    isBtnDisabled(){
      return this.selectCateList.length !== 3
    },
    // 获取选择的三级分类id
    catID(){
      if(this.selectCateList.length === 3){
        return this.selectCateList[2]
      }
      return null
    },
    // 动态设置对话框标题
    titleText(){
      if(this.activeName === 'many'){
        return '动态参数'
      }
      return '静态参数'
    }
  },
  methods:{
    // 获取所有的商品分类列表
    async get_Categorie(){
      const {data:res} = await getCategorie()
      if(res.meta.status !== 200){
        return this.$message.error('获取商品分类列表失败')
      }
      this.cateList = res.data
    },
    // 级联选择器改变时触发
    handleChange(){
      this.getParamsData()
    },
    // tab页签点击事件
    handleClick(){
      this.addForm.attr_sel = this.activeName
      if(this.selectCateList.length === 0){
        return
      }
      this.getParamsData()
    },
    // 获取所选分类的id和所处的面板获取参数列表
    async getParamsData(){
      const {data:res} = await getCateAttributesById(this.catID,{sel:this.activeName})
      if(res.meta.status !== 200){
        this.$message.error('获取分类参数失败')
      }
      res.data.forEach(item => {
        // 使用空格分隔,空字符串分割会返回
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' '):[]
        // 为每项添加文本框显示于隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      if(this.activeName === 'many'){
        this.manyTableData = res.data
      }else {
        this.onlyTableData = res.data
      }
    },
    // 关闭添加参数对话框时触发
    addDialogClosed(){
      this.$refs['addFormRef'].resetFields()
    },
    // 点击按钮添加参数
    addParams(){
      this.$refs['addFormRef'].validate(async valid=>{
        if(!valid) return
        const {data:res} = await addCateAttributesById(this.catID, this.addForm)
        if(res.meta.status !== 201){
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        await this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 显示编辑对话框
    showEditDialog(row){
      this.editForm.attr_name = row.attr_name
      this.editForm.attr_id = row.attr_id
      this.editDialogVisible = true
    },
    // 关闭编辑参数对话框时
    editDialogClosed(){
      this.editForm.attr_name = ''
    },
    // 点击确认编辑参数
    editParams(){
      this.$refs['editFormRef'].validate(async valid => {
        if(!valid) return
        const {data:res} = await editCateAttributesById(this.catID, this.editForm.attr_id, this.editForm)
        if(res.meta.status !== 200){
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.editDialogVisible = false
        await this.getParamsData()
      })
    },
    // 点击按钮删除参数
    deleteParams(row){
      this.$confirm('是否删除该参数?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res} = await deleteCateAttributesById(this.catID,row.attr_id)
        if(res.meta.status !== 200){
          this.$message.error('删除参数失败')
        }
        this.$message.success('删除参数成功')
        await this.getParamsData()
      })
    },
    // 输入框失去焦点或按下Enter键触发
    async handleInputConfirm(row){
      console.log('ok')
      // 判断是否输入空格
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 输入了内容,进行处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.savaAttrValue(row)
    },
    // 点击按钮切换为输入框
    showInput(row){
      row.inputVisible = true
      // 文本框自动获得焦点
      // $nextTick 当页面元素被重新渲染后才执行回调函数中的代码
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //
    handleClose(index,row){
      row.attr_vals.splice(index,1)
      this.savaAttrValue(row)
    },
    // 将attr_vals修改保存到数据库
    async savaAttrValue(row){
      // 发起请求保存该操作
      const {data:res} =  await editCateAttributesById(this.catID,row.attr_id,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })
      if(res.meta.status !== 200){
        this.$message.error('修改失败')
      }
      this.$message.success('修改成功')
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt{
  margin-top: 10px;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 100px;
  margin: 10px;
}
</style>
