<template>
  <div>
    <!-- 面包屑导航 -->
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <Dreadcrumb>
      <span slot="tow">权限管理</span>
      <span slot="three">权限列表</span>
    </Dreadcrumb>

  <!-- 卡片视图 -->
    <el-card>
      <el-table :data='rightsList' border stripe>
        <el-table-column type='index'></el-table-column>
        <el-table-column label='权限名称' prop='authName'></el-table-column>
        <el-table-column label='路径' prop='path'></el-table-column>
        <el-table-column label='权限等级'>
          <template v-slot='scope'> 
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Dreadcrumb from '../../components/content/breadcrumb/Dreadcrumb'

export default {
  name:'Rights',
  data(){
    return{
      rightsList:[]
    }
  },
  components:{
    Dreadcrumb
  },
  created(){
    this.getRightsList()
  },
  methods:{
    async getRightsList(){
      const {data:res} = await this.$http.get('rights/list')
      if(res.meta.status !== 200) return this.$message.console.error(('获取权限列表失败'));
      this.rightsList = res.data
      // console.log(this.rightsList);
      
    }
  }
}
</script>

<style>

</style>