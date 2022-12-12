<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="get_goodeList">
            <el-button slot="append" icon="el-icon-search" @click="get_goodeList" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!--商品表格区域-->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="380">
        </el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="100">
        </el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80">
        </el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template slot-scope="{row}">
            {{row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑对应分类名称" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            </el-tooltip>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeShop(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--商品表格分页区-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
      >
      </el-pagination>
    </el-card>

    <!--修改商品的对话框-->
  </div>
</template>

<script>
import {getGoodsList,removeShopById,getCategorie} from "@/api/goodsApi";

export default {
  name: "Goods",
  data() {
    return {
      // 商品列表查询参数
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      // 商品列表
      goodsList:[],
      // 获取商品的总条数
      total:0,

    }
  },
  created() {
    this.get_goodeList()
  },
  methods:{
    // 根据分页获取对应的商品列表
    async get_goodeList(){
      const {data:res} = await getGoodsList(this.queryInfo)
      if(res.meta.status !== 200){
        this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 分页大小改变时
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.get_goodeList()
    },
    // 分页页码改变时
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.get_goodeList()
    },
    // 点击删除商品时
    removeShop(row){
      this.$confirm('是否删除该产品','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type:'warning'
      }).then(async () => {
        const {data:res} = await removeShopById(row.goods_id)
        if(res.meta.status !== 200){
          this.$message.error('删除商品失败')
        }
        this.$message.success('删除商品成功')
        this.get_goodeList()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 跳转去添加商品的页面
    goAddpage(){
      this.$router.push('/add_goods')
    }
  }
}
</script>

<style scoped>
.el-pagination{
  margin-top: 10px;
}
</style>
