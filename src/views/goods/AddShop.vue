<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--提示区-->
      <el-alert
          title="添加商品信息"
          type="info"
          center
          show-icon
          :closable="false"
      >
      </el-alert>
      <!--步骤条-->
      <el-steps :space="200" :active="activeIndex-0" finish-status="finish" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="RefAddForm" label-position="top">
      <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeLeave" @tab-click="tabClicked">
        <el-tab-pane label="基本信息" name="0">
            <el-row :gutter="30">
              <el-col :span="16">
                <el-form-item label="商品名称" prop="goods_name" >
                  <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品分类" prop="goods_cat">
                  <el-cascader
                      :options="cateList"
                      :props="cateProps"
                      v-model="addForm.goods_cat"
                      style="width: 100%"
                      @change="handleChange"
                      placeholder="请选择分类"
                  >
                  </el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30">
              <el-col :span="8">
                <el-form-item label="商品价格" prop="goods_price" >
                  <el-input v-model="addForm.goods_price" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品数量" prop="goods_number" >
                  <el-input v-model="addForm.goods_number" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品质量" prop="goods_weight" >
                  <el-input v-model="addForm.goods_weight" type="number"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <!--渲染商品参数-->
          <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
            <!--复选框组-->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox v-for="(cb,index) in item.attr_vals" :key="index" :label="cb" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-upload
                  :action="uploadURL"
                  :headers="headerObj"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  :before-upload="handleBeforeUp"
                  accept=".jpg, .png"
                  list-type="picture">
                <el-button size="small" type="primary">点击上传商品图片</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
              </el-upload>
            </el-col>
            <el-col :span="14">
              <div class="block" v-show="showPreview">
                <span class="demonstration">预览图片</span>
                <el-image :src="imageSrc">
                </el-image>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!--富文本编辑器组件-->
          <quill-editor v-model="addForm.goods_introduce">
          </quill-editor>
          <el-button type="primary" style="margin-top: 10px" @click="addShop">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {getCategorie, getCateAttributesById, addShop} from "@/api/goodsApi";

export default {
  name: "AddShop",
  data() {
    const validateNumber = (rule, value, callback) => {
      if (value <= 0 ) {
        callback(new Error('数值应大于0'))
      }
    };
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm:{
        goods_name:'',
        goods_price:0,
        goods_number:0,
        goods_weight:0,
        // 商品所属分类数据
        goods_cat:[],
        // 图片路径
        pics:[],
        // 商品详情
        goods_introduce:'',
        // 商品参数
        attrs:[]
      },
      // 分类数据列表
      cateList:[],
      // 商品参数数据
      manyTableData:[],
      // 商品属性数据
      onlyTableData:[],
      // 级联选择器配置
      cateProps:{
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      // 商品表单数据验证
      addFormRules:{
        goods_name:[
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price:[
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { validator:validateNumber, trigger: 'blur' },
        ],
        goods_weight:[
          { required: true, message: '请输入商品质量', trigger: 'blur' },
          { validator:validateNumber, trigger: 'blur' },
        ],
        goods_number:[
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { validator:validateNumber, trigger: 'blur' },
        ],
        goods_cat:[
          { required: true, message: '请输入商品分类', trigger: 'change' }
        ]
      },
      // 上传图片的url地址
      uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片的请求头
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      // 预览窗口显示和隐藏
      showPreview:false,
      // 预览图片的src地址
      imageSrc:''
    }
  },
  created() {
    this.get_Categorie()
  },
  computed:{
    cateId(){
      if(this.addForm.goods_cat.length === 3){
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods:{
    // 获取所有商品的分类数据
    async get_Categorie(){
      const {data:res} = await getCategorie()
      if(res.meta.status !== 200){
        return this.$message.error('获取商品分类数据失败')
      }
      this.cateList = res.data
    },
    // 级联选择器选择项发生变化触发
    handleChange(){

    },
    // 切换标签页之前
    beforeLeave(activeName,oldActiveName){
      let tmp = true
      if(oldActiveName === '0'){
        this.$refs['RefAddForm'].validate( valid=> {
          this.$message.error('请完整正确填写基本信息')
          tmp = valid
        })
      }
      // if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
      //   this.$message.error('请先选择商品分类')
      //   return false
      // }
      return tmp
    },
    // 获取商品动态参数
    async getCateParams(){
      const {data:res} = await getCateAttributesById(this.cateId,{sel:'many'}).catch(reason => {
        console.log(reason)
      })
      if(res.meta.status !== 200){
        return this.$message.error('获取动态参数列表失败')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
      })
      this.manyTableData = res.data.filter(item => {
        return item.attr_vals.length !== 0
      })
    },
    //获取商品静态参数
    async getCateAttribute(){
      const {data:res} = await getCateAttributesById(this.cateId,{sel:'only'}).catch(reason => {
        console.log(reason)
      })
      if(res.meta.status !== 200){
        return this.$message.error('获取静态属性列表失败')
      }
      this.onlyTableData = res.data
    },
    // 标签页切换时触发
    tabClicked(){
      if(this.activeIndex === '1'){
        // 访问商品参数面板
        this.getCateParams()
      }
      if(this.activeIndex === '2'){
        // 访问商品属性面板
        this.getCateAttribute()
      }
    },
    // 处理图片预览效果
    handlePreview(file){
      this.showPreview = true
      console.log(file)
      this.imageSrc = file.response.data.url
    },
    // 处理移除图片的操作
    handleRemove(file){
      // 获取删除图片的临时路径
      const filePath = file.response.data.tmp_path

      // // 从addForm.pics数组中寻找对应索引值
      // const index = this.addForm.pics.findIndex(item => {
      //   item.pic = filePath
      // })
      // // 从addForm.pics数组中删除
      // this.addForm.pics.splice(index,1)

      // 使用filter方法
      this.addForm.pics = this.addForm.pics.filter(item => {
        return item.pic !== filePath
      })
      this.$message.info('已移除该图片')
    },
    // 监听图片上传完毕的事件
    handleSuccess(res){
      // 拼接得到图片信息对象
      const picInfo = {
        pic:res.data.tmp_path
      }
      // 图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo)
    },
    // 图片上传前的触发,用于审查上传文件格式和大小
    handleBeforeUp(file){
      // 获取上传文件的后缀名
      const fileSuffix = file.name.substring(file.name.lastIndexOf('.')+1)
      // 合法的图片后缀
      const legalSuffix = ['jpg','png']
      if(legalSuffix.indexOf(fileSuffix) === -1){
        this.$message.error('只可以上传jpg,png后缀的图像文件')
        return false
      }
      // 文件大小大于2MB时阻止上传
      if(file.size > 2*1024*1024){
        this.$message.error('上传的图像文件大于2MB')
        return false
      }
      return true
    },
    // 添加商品
    async addShop(){
      // 深拷贝
      const CloneAddForm = this.deepClone(this.addForm)
      // 将goods_cat转为','分隔的字符串
      CloneAddForm.goods_cat = CloneAddForm.goods_cat.join(',')

      // 处理动态参数
      this.manyTableData.forEach(item => {
        const newInfo = {
          attr_id:item.attr_id,
          attr_value:item.attr_vals.join(' ')
        }
        this.addForm.attrs.push(newInfo)
      })
      // 处理静态属性
      this.onlyTableData.forEach(item => {
        const newInfo = {
          attr_id:item.attr_id,
          attr_value: item.attr_vals
        }
        this.addForm.attrs.push(newInfo)
      })

      CloneAddForm.attrs = this.addForm.attrs
      console.log(CloneAddForm)

      const {data:res} = await addShop(CloneAddForm)
      if(res.meta.status !== 201){
        this.$message.error('添加商品失败')
      }
      this.$message.success('添加商品成功')
      this.$router.push('/goods')
    },
    // 用于深拷贝对象
    deepClone(object){
      // 将对象转为JSON字符串,再将字符串生成一个新的对象
      if(typeof object === 'object' && object !== null){
        return JSON.parse(JSON.stringify(object))
      }
      return null
    }
  }
}
</script>

<style scoped>
.el-tab-pane{
  padding: 10px 20px;
}
.el-checkbox{
  margin: 0 10px 0 0 !important;
}
.block{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  background-color: #f2f2f3;
}
.demonstration{
  margin: 5px;
  font-size: 14px;
}
</style>
