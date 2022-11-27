<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
          <!--表格-->
        </el-col>
        <el-col>
          <tree-table
              :data="cateList"
              :columns="columns"
              :selection-type="false"
              :expand-type="false"
              show-index
              border
              :show-row-hover="false"
          >
            <!--是否有效-->
            <template slot="isok" slot-scope="scope">
              <i v-if="!scope.row.cat_deleted"
                 class="el-icon-circle-check"
                 style="color: green;font-size: 20px;"
              >
              </i>
              <i v-else class="el-icon-circle-close"  style="color: red;font-size: 20px;"></i>
            </template>
            <!--排序等级-->
            <template slot="order" slot-scope="scope">
              <el-tag v-if="scope.row.cat_level === 0" size="small">一级</el-tag>
              <el-tag v-if="scope.row.cat_level === 1" size="small" type="success">二级</el-tag>
              <el-tag v-if="scope.row.cat_level === 2" size="small" type="warning">三级</el-tag>
            </template>
            <!--操作-->
            <template slot="opt" slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑对应分类名称" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                           @click="showEditCateDialog(scope.row)">编辑</el-button>
              </el-tooltip>

              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row)">删除</el-button>
            </template>

          </tree-table>
        </el-col>
        <el-col>
          <!--分页-->
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="querInfo.pagenum"
              :page-sizes="[5,10,15,20]"
              :page-size="querInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <!--添加分类的对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible" width="35%"
      @close="addCateDialogClosed"
    >
      <!--添加分类的表单-->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name" style="width: 222px"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!--options用于指定数据源-->
          <el-cascader
              :options="parentCateList"
              :props="cateProps"
              v-model="selectKeys"
              ref="cascaderRef"
              @change="parentCateChanged"
              clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑分类的对话框-->
    <el-dialog
        title="编辑分类"
        :visible.sync="editCateDialogVisible" width="35%"
    >
      <!--编辑分类的表单-->
      <el-form :model="editForm" :rules="addCateFormRules" ref="editCateForm"
               label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editForm.cat_name" style="width: 240px"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getCategorie,addCategorie,editCateNameByCateId,
    deleteCateByID
} from "@/api/goodsApi";

export default {
  name: "Cate",
  data() {
    return {
      // 商品分类数据列表查询参数
      querInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      // 商品分类数据列表
      cateList: [],
      // 商品分类总数据量
      total:0,
      // 为table指定列的属性
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label: '是否有效',
          // 将当前列定义为模板列
          type:'template',
          // 表示当前列模板的名称
          template:'isok'
        },
        {
          label: '级别',
          type:'template',
          template:'order'
        },
        {
          label: '操作',
          type:'template',
          template:'opt'
        }
      ],
      // 控制添加分类对话框的显示和隐藏
      addCateDialogVisible:false,
      // 控制编辑分类对话框的显示和隐藏
      editCateDialogVisible:false,
      // 添加分类的表单数据对象
      addCateForm:{
        // 将要添加的分类名称
        cat_name:'',
        // 父级分类id
        cat_pid:0,
        // 分类的等级默认为1级
        cat_level:0
      },
      // 添加分类的表单验证规则
      addCateFormRules:{
        cat_name:[
          {required:true,message:'请输入分类名称',trigger:'blur'}
        ]
      },
      // 父级分类列表
      parentCateList:[],
      // 级联选择器规则
      cateProps:{
        expandTrigger: 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children',
        checkStrictly:true
      },
      // 选中的父级id数据
      selectKeys:[],
      // 编辑分类的新名称
      editForm:{
        cat_id:0,
        cat_name:'',
        cat_oldName:''
      },
      row:[]
    }
  },
  created() {
    this.get_Categorie()
  },
  methods:{
    async get_Categorie(){
      const {data:res} = await getCategorie(this.querInfo)
      if(res.meta.status !== 200){
        return this.$message.error('获取商品分类失败')
      }
      // console.log(res)
      this.cateList = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听 pageSize 改变
    handleSizeChange(newSize){
      this.querInfo.pagesize = newSize
      this.get_Categorie()
    },
    // 监听 pageNum 的改变
    handleCurrentChange(newPage){
      this.querInfo.pagenum = newPage
      this.get_Categorie()
    },
    // 点击按钮显示添加分类的对话框
    async showAddCateDialog(){
      // 获取父级分类列表
      const {data:res} = await getCategorie({type: 2})
      if(res.meta.status !== 200){
        this.$message.error('获取父级分类失败')
      }
      this.addCateDialogVisible = true
      this.parentCateList = res.data
    },
    // 关闭添加分类的对话框时触发
    addCateDialogClosed(){
      // this.addCateForm.cat_name = ''
      // this.addCateForm.cat_pid = 0
      // this.addCateForm.cat_level = 0
      this.$refs['addCateForm'].resetFields()
      this.$refs['cascaderRef'].$refs['panel'].clearCheckedNodes()
      this.addCateDialogVisible = false
    },
    // 选择项发生变化时触发
    parentCateChanged(){
      // console.log(this.selectKeys)
      // 判断是否有选中任意值
      if(this.selectKeys.length > 0){
        // 父级id,下标为数组长度-1
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 分类级别与数组长度一致
        this.addCateForm.cat_level = this.selectKeys.length
        return
      }
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击确认,添加分类
    addCate(){
      // console.log(this.addCateForm)
      // 验证表单
      this.$refs['addCateForm'].validate(async valid => {
        if(!valid) return
        const {data:res} = await addCategorie(this.addCateForm)
        if(res.meta.status !== 201){
          return this.$message.error('添加分类失败')
        }
        // console.log(res)
        this.$message.success('添加分类成功')
        await this.get_Categorie()
        this.addCateDialogVisible = false
      })
    },
    // 点击按钮显示编辑分类对话框
    showEditCateDialog(row){
      console.log(row)
      this.row[0] = row
      this.editForm.cat_id = row.cat_id
      this.editForm.cat_name = row.cat_name
      this.editForm.cat_oldName = row.cat_name
      this.editCateDialogVisible = true
    },
    // 编辑分类
    editCate(){
      if(this.editForm.cat_oldName === this.editForm.cat_name){
        return this.$message.info('请输入新的分类名称或点击退出')
      }
      this.$refs['editCateForm'].validate(async valid => {
        if(!valid) return
        const {data:res} = await editCateNameByCateId(this.editForm.cat_id, this.editForm)
        if(res.meta.status !== 200){
          return this.$message.error('编辑分类失败')
        }
        this.$message.success('编辑分类成功')
        this.editCateDialogVisible = false
      })
    },
    // 删除分类
    deleteCate(row){
      this.$confirm('确认删除该分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res} = await deleteCateByID(row.cat_id)
        if(res.meta.status !== 200) {
          return this.$message.error('删除分类失败')
        }
        this.$message.success('删除分类成功')
        await this.get_Categorie()
      }).catch(() => {
        this.$message.info('取消删除')
      })

    }
  }
}
</script>

<style scoped>
.el-col{
  margin-bottom: 15px;
}
</style>
