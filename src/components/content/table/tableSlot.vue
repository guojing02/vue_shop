<template>
  <div>
    <slot name="left">
      <el-tooltip effect="dark" :enterable="false" content="编辑" placement="top">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          @click="showEditDialog(goods_id)"
        >编辑</el-button>
      </el-tooltip>
    </slot>
    <slot name="center">
      <el-tooltip effect="dark" :enterable="false" content="分配权限" placement="top">
        <el-button
          type="warning"
          icon="el-icon-setting"
          size="mini"
          @click="showSetRight(scope.row)"
        >分配权限</el-button>
      </el-tooltip>
    </slot>
    <slot name="right">
      <el-tooltip effect="dark" :enterable="false" content="删除" placement="top">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="removeUserId(goods_id)"
        >删除</el-button>
      </el-tooltip>
    </slot>
    <slot name="four">
       <el-tooltip effect="dark" :enterable="false" content="物流进度" placement="top">
        <el-button
          type="success"
          icon="el-icon-location"
          size="mini"
          @click="showProgressBox(goods_id)"
        >物流</el-button>
      </el-tooltip>
    </slot>    
  </div>
</template>

<script>
export default {
  props:{
    goods_id:{
      type:Number,
    }
  },
  methods:{
    async removeUserId(id){
       const confirmResult =  await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        // console.log(confirmResult);
        if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
        const {data:res} = await this.$http.delete(`goods/${id}`)
        if (res.meta.status !== (200 || 201)) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.$bus.$emit('removeUserId')
    },
    showEditDialog(id){
      this.$bus.$emit('showEditDialog',id)
    },
    showProgressBox(id){
      this.$bus.$emit('showProgressBox',id)
    }
  }
};
</script>

<style lang="less" scoped>
</style>