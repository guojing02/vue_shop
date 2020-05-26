<template>
  <div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size.sync="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  methods:{
    handleSizeChange(newSize){
      this.$emit('listSizeChange',newSize)
      // console.log(newSize);
    },
    handleCurrentChange(newPage){
      this.$emit('listCurrentChange',newPage)
      // console.log(newPage);
    }
  },
  props:{
    queryInfo:{
      type:Object,
      default:{}
    },
    total:{
      type:Number,
      default:0
    }
  }
}
</script>

<style>

</style>