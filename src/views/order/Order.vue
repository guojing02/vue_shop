<template>
  <div>
    <dreadcrumb>
      <span slot="tow">订单管理</span>
      <span slot="three">订单列表</span>
    </dreadcrumb>
    <el-card>
      <el-row>
        <el-col :span='8'>
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <table-list :orderLists='orderList' :orderLabel='orderLabel' :orderprop='orderprop'></table-list>
    
      <pagination @listSizeChange='listSizeChange'
    @listCurrentChange='listCurrentChange' :queryInfo='queryInfo'
    :total='total'></pagination>
    </el-card>

     <el-dialog title="修改地址" @close='editDialogClose' :visible.sync="editdialogVisible" width="50%">
      <el-form :model="addressForm" :rules='addressRules'
      ref="editCateRef" label-width="120px">
      <el-form-item label="省市区/县" height='300px' prop='address1'>
         <el-cascader
          v-model="addressForm.address1"
          :options="cityData" height='120px'>
          </el-cascader>
      </el-form-item>

       <el-form-item label="详细地址" prop='address1'>
        <el-input v-model="addressForm.address2"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

      <el-dialog title="物流进度" :visible.sync="showdialogVisible" @open='showdialogOpen' width="50%">
        <el-timeline>
          <el-timeline-item
            color='#0bbd87'
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.timestamp">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Dreadcrumb from "../../components/content/breadcrumb/Dreadcrumb";
import TableList from '../../components/content/table/TableList'
import Pagination from '../../components/content/pagination/Pagination'

import {itemIfMixin} from '../../common/mixin'
import cityData from '../../common/cityData'
export default {
  mixins:[itemIfMixin],
  data(){
    return{
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5
      },
      total:0,
      orderList:[],
      orderLabel:['订单编号','订单价格(元)','是否付款','是否发货','下单时间','操作'],
      orderprop:['order_number','order_price','pay_status','is_send','create_time'],
      editdialogVisible:false,
      orderId:'',
      addressForm:{
        address1:[],
        address2:''
      },
      addressRules:{
        address1:[{ required: true, message: '请选择地址', trigger: 'blur' }],
        address2:[{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      cityData,
      showdialogVisible:false,
      progressInfo:[]
    }
  },
  created(){
    this.getOrderList()
    this.$bus.$on('showEditDialog',(id)=>{
      this.editdialogVisible = true
      this.orderId = id
    })
    this.$bus.$on('showProgressBox', (id)=>{
      this.showdialogVisible = true
      this.orderId = id
    })
  },
  methods:{
    async getOrderList(){
      const {data:res} = await this.$http.get('orders',{
        params:this.queryInfo
      })
      this.get200(res,'获取订单列表失败','获取订单列表成功')
      this.orderList = res.data.goods
      console.log(res);
      this.total = res.data.total
    },
    listSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    listCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    editDialogClose(){
      this.$refs.editCateRef.resetFields()
      this.addressForm.address2 = ''
    },
    async showdialogOpen(){
      const {data:res} = await this.$http.get('/kuaidi/1106975712662')
      this.get200(res,'获取物流信息失败','获取物流信息成功')
      this.progressInfo = res.data
    console.log(res);
    }
  },
  components: {
    Dreadcrumb,
    TableList,
    Pagination
  }
};
</script>

<style>
</style>