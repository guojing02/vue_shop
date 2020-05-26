<template>
<div>
  <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><slot name='tow'></slot></el-breadcrumb-item>
      <el-breadcrumb-item><slot name='three'></slot></el-breadcrumb-item>
      <el-breadcrumb-item><slot name='four'></slot></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name:'Dreadcrumb'
}
</script>

<style>

</style>