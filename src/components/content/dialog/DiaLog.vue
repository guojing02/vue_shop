<template>
  <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="50%">
    <img :src="previewPath" alt="" class="previewImg">
</el-dialog>
</template>

<script>
export default {
  props:{

  },
  data(){
    return{
      dialogVisible:false,
      previewPath:''
    }
  },
  created(){
    this.$bus.$on('handlePreviews',(previewPaths)=>{
      this.previewPath = previewPaths
      this.dialogVisible = true
    })
  },
  methods:{
    handleClose(){

    }
  }
}
</script>

<style lang="less" scoped>
  .previewImg{
    width: 100%;
  }
</style>