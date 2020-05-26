<template>
  <div>
  <slot name="one">
    <el-form-item label='商品名称' prop='goods_name'>
            <el-input v-model="addFrom.goods_name"></el-input>
          </el-form-item>
          <el-form-item label='商品价格' prop='goods_price'>
            <el-input v-model="addFrom.goods_price" type='number'></el-input>
          </el-form-item>
          <el-form-item label='商品重量' prop='goods_weight'>
            <el-input v-model="addFrom.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label='商品数量' prop='goods_number'>
            <el-input v-model="addFrom.goods_number" type='number'></el-input>
          </el-form-item>
          <el-form-item label='商品分类' prop='goods_cat'>
            <el-cascader
            v-model="addFrom.goods_cat"
            :options="catelist"
            :props="{ expandTrigger:'hover',label:'cat_name',value:'cat_id',
            childrem:'children'}"
            @change="handleChange">
            </el-cascader>
    </el-form-item>
  </slot>
  <slot name="tow">

     <el-form-item :label='item.attr_name' v-for="item in manyTableData" :key='item.attr_id' prop='goods_name'>
        <el-checkbox-group v-model="item.attr_vals" >
          <el-checkbox border :label="cb" v-for="(cb,index) in item.attr_vals" :key='index'></el-checkbox>
        </el-checkbox-group>
    </el-form-item>

  </slot>
   <slot name="therr">

     <el-form-item :label='item.attr_name' v-for="item in onlyTableData" :key='item.attr_id' prop='goods_name'>
        <el-input v-model="item.attr_vals"></el-input>
    </el-form-item>

  </slot>
  <slot name="four">
    <el-upload
    :headers='headerObj'
  class="upload-demo"
  :action="uplodURL"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :on-success='handleSuccess'
  list-type="picture">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>

  </slot>
  </div>
</template>

<script>
export default {
  props:{
    addFrom:{
      type:Object,
      default(){
        return {}
      }
    },
    catelist:{
      type:Array
    },
    manyTableData:{
      type:Array
    },
    onlyTableData:{
      type:Array
    }
  },
  data(){
    return{
      uplodURL:'http://timemeetyou.com:8889/api/private/v1/upload',
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      previewPath:''
    }
  },
  methods:{
     handleChange(){
       if (this.addFrom.goods_cat.length !== 3) {
        this.addFrom.goods_cat = []
        // this.manyList = []
        // this.onlyList = []
        return
      }
    },
    handlePreview(file){
      this.previewPath = file.response.data.url
      this.$bus.$emit('handlePreviews', this.previewPath)
    },
    handleRemove(file){
      this.$emit('handleRemove',file)
    },
    handleSuccess(response){
      this.$emit('handleSuccess',response)
    }
  }
}
</script>

<style lang="less" scoped>

</style>