<template>
  <div>
  <el-card>
  <dreadcrumb>
    <span slot="tow">商品管理</span>
    <span slot="three">商品列表</span>
    <span slot="four">添加商品</span>
  </dreadcrumb>
  <el-alert title="添加商品信息" type='info' center show-icon :closable='false'></el-alert>
  
  <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
    <el-step title="基本信息"></el-step>
    <el-step title="商品参数"></el-step>
    <el-step title="商品属性"></el-step>
    <el-step title="商品图片"></el-step>
    <el-step title="商品内容"></el-step>
    <el-step title="完成"></el-step>
  </el-steps>

  <el-form :model="addFrom" :rules="addFromRules" ref="FormRef" 
  label-width="100px" class="demo-ruleForm" label-position='top'>
    <el-tabs :tab-position="'left'" v-model="activeIndex" 
    :before-leave='beforeTableave' @tab-click='tabClick'>
      
      <el-tab-pane label="基本信息" name='1'>
        <form-item :addFrom='addFrom' :catelist='catelist'>
          <div slot="four"></div>
        </form-item>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name='2'>
         <form-item :manyTableData='manyTableData'>
          <div slot="one" ></div>
          <div slot="four"></div>
        </form-item>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name='3'>
        <form-item :onlyTableData='onlyTableData'>
          <div slot="one"></div>
          <div slot="four"></div>
        </form-item>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name='4'>
        <form-item @handleSuccess='handleSuccess' @handleRemove='handleRemove'>
          <div slot="one"></div>
          <div slot="tow"></div>
          <div slot="therr"></div>
        </form-item>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name='5'>
         <quill-editor v-model="addFrom.goods_introduce"></quill-editor>
         <el-button type='primary' @click="add">添加商品</el-button>
      </el-tab-pane>
    </el-tabs>
  </el-form>
 
  </el-card>
  <dia-log></dia-log>
  </div>
</template>

<script>
import Dreadcrumb from 'components/content/breadcrumb/Dreadcrumb'
import FormItem from './children/FormItem'
import DiaLog from 'components/content/dialog/DiaLog'

import {itemIfMixin} from 'common/mixin'
import {deepClone} from 'common/clone'
export default {
  data(){
    return{
      activeIndex:'1',
      addFrom:{
        goods_name:'',
        goods_price:'',
        goods_weight:'',
        goods_number:'',
        goods_cat:[],
        pics:[],
        // 商品的详情描述
        goods_introduce:'',
        attrs:[]
      },
      addFromRules:{
        goods_name:[
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price:[
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight:[
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number:[
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat:[
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ]
      },
      catelist:[],
      // 动态参数获取
      manyTableData:[],
      onlyTableData:[],
      from:{}
    }
  },
  created(){
    this.getCateList()
  },
  mixins:[itemIfMixin],
  methods:{
    async getCateList(){
      const {data:res} = await this.$http.get('categories')
      this.get200(res,'获取商品分类数据失败','获取商品分类数据成功')
      this.catelist = res.data
      
    },
    beforeTableave(activeName,oldActiveName){      
       if(oldActiveName === '1' && this.addFrom.goods_cat.length !== 3){
        this.$message.error('请先选择商品分类')
         return false
       }
    },
    async tabClick(){
      if(this.activeIndex === '2'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'many'}
        })
        this.get200(res,'获取动态参数列表失败','获取动态参数列表成功')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals === 0 ? [] : item.attr_vals.split(',')}
          )
        this.manyTableData = res.data
        console.log(res.data);
      }else if(this.activeIndex === '3'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'only'}
        })
        this.get200(res,'获取静态参数列表失败','获取静态参数列表成功')
        this.onlyTableData = res.data
      }
      
    },
    handleSuccess(response){
      const picinfo = {pic:response.data.tmp_path}
      this.addFrom.pics.push(picinfo)
      console.log(this.addFrom);
      
    },
    handleRemove(file){
      const filePath = file.response.data.tmp_path
      const i = this.addFrom.pics.find(x => x.pic === filePath)
      this.addFrom.pics.splice(i,1)
      console.log(this.addFrom);
    },
     add(){
      this.$refs.FormRef.validate(async valid => {
        if(!valid) return this.$message.error('请输入必要的商品信息')
         this.from = deepClone(this.addFrom,this.from)
      this.from.goods_cat = this.from.goods_cat.join(',')
      this.manyTableData.forEach(item => {
       const newinfo = {
         attr_id:item.attr_id,
         attr_value:item.attr_vals.join(' ')
       }
       this.addFrom.attrs.push(newinfo)
      })
      this.manyTableData.forEach(item => {
       const oldinfo = {
         attr_id:item.attr_id,
         attr_value:item.attr_vals
       }
       this.addFrom.attrs.push(oldinfo)
     })
     this.from.attrs = this.addFrom.attrs
     console.log(this.from);
    //  console.log(this.addFrom);
     const {data:res} = await this.$http.post('goods',this.from)
     console.log(res);
     this.get201(res,'添加商品失败','添加商品成功')
     this.$router.push('/goods')
      })
    }
  },
  computed:{
    cateId(){
      if( this.addFrom.goods_cat.length === 3){
        return  this.addFrom.goods_cat[2]
      }
      return null
    },
  },
  components:{
    Dreadcrumb,
    FormItem,
    DiaLog
  }
}
</script>

<style>

</style>