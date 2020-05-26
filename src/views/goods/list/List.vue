<template>
  <div>
    <Dreadcrumb>
      <span slot="tow">商品管理</span>
      <span slot="three">商品列表</span>
    </Dreadcrumb>
    <card :show='show'></card>
    
  </div>
</template>

<script>
import Dreadcrumb from "components/content/breadcrumb/Dreadcrumb";
import Card from "./children/Card";


export default {
  name: "List",
  data(){
    return{
      show:true
    }
  },
  created(){
    
  },
  methods:{
    
  },
  components: {
    Dreadcrumb,
    Card
  }
};
</script>

<style lang="less" scoped>
</style>