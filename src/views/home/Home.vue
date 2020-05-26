<template>
  <el-container class="home-comtainer">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="~assets/img/administ.svg" alt />
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '68px' : '300px'">
        <div class="toggle" @click="toggleClick">|||</div>
        <el-menu background-color="#333744" text-color="#fff"
         active-text-color="#409eff" :collapse='isCollapse'
         :collapse-transition='false' router :default-active='$route.path'>
          <el-submenu v-for="item in menulist" :key="item.id" :index="item.id + ''">
            <template slot="title" >
              <i :class="icondata[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item 
             text-color="#fff" 
             v-for="j in item.children" :key="j.id" :index="'/' + j.path"
             >
              <i class="el-icon-menu"></i>
              <span>{{j.authName}}</span>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data(){
    return{
      menulist:[],
      icondata:{
        '125':'el-icon-user-solid',
        '103':'el-icon-s-tools',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-order',
        '145':'el-icon-s-marketing',
      },
      isCollapse:false,
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.replace("/login");
    },
    async getMeulist(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status == !200) return this.$message.error(res.meta.msg);
      this.menulist = res.data
      // console.log(this.menulist);
      
    },
    toggleClick(){
      this.isCollapse = !this.isCollapse
    }
  },
  created(){
    this.getMeulist()
  }
};
</script>
<style lang='less' scoped>
.el-header {
  background-color: #2b4b6b;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 110px !important;
  div {
    display: flex;
    height: 100%;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
    font-size: 15px !important;
    .el-submenu{
      font-size: 15px !important;
      .el-menu-item{
        font-size: 15px !important;
      }
    }
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-comtainer {
  height: 100%;
}
.iconfont{
  margin-right: 10px;
}
.toggle{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>