<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="get_orderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--订单列表数据-->
      <el-table :data="orderList" stripe border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" min-width="200"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" min-width="120">
          <template slot-scope="{row}">
            {{row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="90">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改订单地址" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="small" @click="showBox"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="物流进度" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-location" size="small" @click="showProgressBox"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页控件区-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!--修改地址的对话框-->
    <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        @close="addressDialogClosed"
        width="40%"
        >
      <span>
        <el-form :model="addressForm" :rules="addressRules" ref="RefAddressForm" label-width="90px">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader :options="citydata" v-model="addressForm.address1" style="width: 100%"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="EditAddress">确 定</el-button>
    </span>
    </el-dialog>
    <!--显示物流进度的对话框-->
    <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="40%"
    >
      <span>

      </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="progressVisible = false">取 消</el-button>
    <el-button type="primary" @click="progressVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {getOrders} from "@/api/ordersApi";
import citydata from "@/views/order/citydata";

export default {
  name: "Order",
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      total:0,
      orderList:[],
      addressVisible:false,
      addressForm:{
        address1:[],
        address2:''
      },
      addressRules:{
        address1:[
          { required: true, message: '请选择省市区县', trigger: 'change' },
        ],
        address2:[
          { required: true, message: '请填写详细的物流地址', trigger: 'blur' },
        ]
      },
      citydata,
      progressVisible:false
    }
  },
  created() {
    this.get_orderList()
  },
  methods:{
    async get_orderList(){
      const {data:res} = await getOrders(this.queryInfo)
      if(res.meta.status !== 200){
        this.$message.error('获取订单信息失败')
      }
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    // 分页大小改变时触发
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.get_orderList()
    },
    // 分页页码改变时触发
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.get_orderList()
    },
    // 显示修改地址的对话框
    showBox(){
      this.addressVisible = true
    },
    // 关闭对话框时触发
    addressDialogClosed(){
      this.$refs['RefAddressForm'].resetFields()
    },
    // 确认编辑订单地址
    EditAddress(){
      this.$refs['RefAddressForm'].validate(valid => {
        if(!valid){
          this.$message.info('请完整填写信息后确认')
        }
      })
    },
    // 显示物流进度信息
    showProgressBox(){
      this.progressVisible = true
    }
  }
}
</script>

<style scoped>

</style>
