<template>
  <div class="login-container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="~assets/vx.svg" alt="">
      </div>
      <el-form ref="loginRef" :rules='loginRules' :model="loginForm" label-width="" class="loginForm">
        <!-- 用户名 -->
        <el-form-item  class="text_input" prop='username'>
          <el-input v-model='loginForm.username' prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item  class="text_input" prop='password'>
          <el-input type='password' v-model='loginForm.password' prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginClick">登录</el-button>
          <el-button type="info" @click="resetClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name:'Login',
  data(){
    return{
      loginForm:{username:'admin',password:'123456'},
      // 表单验证规则
      loginRules:{
        username:[
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 13, message: '长度在 5 到 13 个字符', trigger: 'blur' }
          ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur' }
        ]
        }
    }
  },
  methods:{
    resetClick(){
      this.$refs.loginRef.resetFields()
    },
    loginClick(){
      this.$refs.loginRef.validate( async valid => {
        if(!valid) return;
        // request({
        //   url:'login',
        //   post,
        //   params:this.loginForm
        // }).then(res => {
        //   console.log(res);
          
        // })

        const {data: res} = await this.$http.post('login',this.loginForm)
        console.log(res);
        
        if(res.meta.status !== 200) return this.$message.error("登录失败!")
        this.$message.success('登录成功!')
        
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.replace('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box{
  width:800px;
  height:500px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0px -15px 15px 0px;
}
.avatar_box{
  display: flex;
    flex-direction: row;
    height: 45%;
    justify-content: center;
    transform: translate(0px, -50%);
  img{
    box-shadow: -1px -6px 20px 0px;
    height: 100%;
    border-radius: 50%;
    background: #fff;
  }
}
.btns{
  display: flex;
  justify-content: flex-end;
}
.loginForm{
  padding: 0 10%;
  transform: translate(0px, -20%);
}
</style>