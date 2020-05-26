<template>
<div>
  <el-card>
    <el-row :gutter='20'>
      <el-col :span='8'>
        <el-input placeholder="请输入内容" v-model="queryInfo.query"
         clearable @clear='search'>
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span='4' v-if="show">
        <el-button type='primary' @click='goAddpage'>添加商品</el-button>
      </el-col>
    </el-row>
    <table-list :goodsList='goodsList' :labels='labels' :props='props'></table-list>
    <pagination @listSizeChange='listSizeChange'
    @listCurrentChange='listCurrentChange' :queryInfo='queryInfo'
    :total='total'></pagination>
  </el-card>

  <el-dialog title="编辑商品" @open='dialogOpen' :visible.sync="dialogVisible" width="50%">
      <el-form :model="goodsForm"
      ref="editCateRef" label-width="90px">
      <el-form-item label="商品名称">
        <el-input v-model="goodsForm.goods_name"></el-input>
      </el-form-item>
       <el-form-item label="商品价格(元)">
        <el-input v-model="goodsForm.goods_price"></el-input>
      </el-form-item>
       <el-form-item label="商品重量">
        <el-input v-model="goodsForm.goods_weight"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogGoods">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
import TableList from 'components/content/table/TableList'
import Pagination from 'components/content/pagination/Pagination'

import {itemIfMixin} from '../../../../common/mixin'
export default {
  name:'Card',
  mixins:[itemIfMixin],
  props:{
    show:{
      type:Boolean,
      default(){
        return false
      }
    }
  },
  data(){
    return{
      // 查询参数对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5
      },
      goodsList:[],
      total:0,
      labels:['商品名称','商品价格(元)','商品重量','创建时间','数量','操作'],
      props:['goods_name','goods_price','goods_weight','add_time','goods_number'],
      dialogVisible:false,
      commodityId:'',
      goodsForm:{
        goods_name:'',
        goods_price:'',
        goods_weight:''
      }
    }
  },
  components:{
    TableList,
    Pagination
  },
  created(){
    this.getGoodsList()
    this.$bus.$on('showEditDialog',(id)=>{
      this.dialogVisible = true
      this.commodityId = id
    })
  },
  methods:{
    async getGoodsList(){
      const {data:res} = await this.$http.get('goods',{
        params:this.queryInfo
      })
      this.get200(res,'获取商品列表失败','获取商品列表成功')
      console.log(res.data);
      this.goodsList = res.data.goods
      this.total = res.data.total
      this.$bus.$on('removeUserId',()=>{
        this.getGoodsList()
      })
    },
    listSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    listCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    search(){
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    goAddpage(){
      this.$router.push({path:'/goods/add'})
    },
    async dialogOpen(){
      const {data:res} = await this.$http.get(`goods/${this.commodityId}`)
      this.get200(res,'商品数据获取失败','商品数据获取成功')
      this.goodsForm = res.data
    },
    async editDialogGoods(){
      console.log(this.commodityId);
      
      const {data:res} = await this.$http.put(`goods/${this.commodityId}`,{
        goods_name:this.goodsForm.goods_name,
        goods_price:this.goodsForm.goods_price,
        goods_weight:this.goodsForm.goods_weight,
        goods_number:this.goodsForm.goods_number,
        // attrs:this.goodsForm.attrs,
        // pics:this.goodsForm.pics,
        // goods_introduce:this.goodsForm.goods_introduce
      })
      this.get201(res,'商品修改失败','商品修改成功')
      this.dialogVisible = false
      this.getGoodsList()
    }
  }
}
</script>

<style>

</style>