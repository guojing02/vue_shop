<template>
  <div>
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <Dreadcrumb>
      <span slot="tow">权限管理</span>
      <span slot="three">权限列表</span>
    </Dreadcrumb>

    <el-card class="box-card">
      <!-- 搜索添加 -->
      <el-row :gutter='20'>
      <el-col :span='7'>
        <el-input placeholder="请输入内容" clearable @clear='getList' v-model="queryInfo.query">
        
        <el-button slot="append" @click="getList" icon="el-icon-search"></el-button>
      </el-input>
      </el-col>
      <el-col :span='4'>
        <el-button type='primary' @click="addDialogVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表 -->
    <el-table :data='userList' border stripe>
      <el-table-column type='index'></el-table-column>
      <el-table-column label='姓名' prop='username'></el-table-column>
      <el-table-column label='邮箱' prop='email'></el-table-column>
      <el-table-column label='电话' prop='mobile'></el-table-column>
      <el-table-column label='角色' prop='role_name'></el-table-column>
      <el-table-column label='状态'>
        <template v-slot="scope">
          <el-switch
            @change="userStateChanged(scope.row)"
            v-model="scope.row.mg_state">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label='操作' width='180px'>
        <template v-slot='scope'>
          <el-tooltip effect="dark" :enterable='false' content="修改" placement="top">
            <el-button type="primary" icon="el-icon-edit" size='mini' circle
            @click="showEditDialog(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" :enterable='false' content="分配角色" placement="top">
             <el-button type="warning" icon="el-icon-setting" size='mini' circle
             @click="distributionClick(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" :enterable='false' content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" 
            size='mini' @click="removeUserId(scope.row.id)" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>          
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total='total'>
    </el-pagination> 
    </el-card>
    
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%" @close='addDialogClosd'>
      <!-- 内容主题 -->
      <el-form :model="addForm" :rules="addFormRules"
      ref="addFormRef" 
      label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item  label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
     </span> 
  </el-dialog>
<!-- 修改用户的对话框 -->
<el-dialog
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="50%" @close='editDialogClosed'
  center>
  <el-form :model="editForm" :rules="addFormRules"
   ref="editFormRef" label-width="80px">
  <el-form-item label="用户名">
    <el-input v-model="editForm.username"
    disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop='email'>
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop='mobile'>
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="分配角色"
  :visible.sync="distributionVisible"
  width="50%" @close='distributionClosed'
  center>
  <!-- @close='distributionClosed' -->
  <div>
    <p>当前用户：{{userinfo.username}}</p>
    <p>当前角色：{{userinfo.role_name}}</p>
  </div>
  <p>分配新角色：
   <el-select v-model="distributionId" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
  </p>
  <span slot="footer" class="dialog-footer">
    <el-button @click="distributionVisible = false">取 消</el-button>
    <el-button type="primary" @click="distribution">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import Dreadcrumb from '../../components/content/breadcrumb/Dreadcrumb'

export default {
  name:'User',
  data(){
    // 验证邮箱规则
    var checkEmail = (rule,value,cb)=>{
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    }
    // 验证手机号规则
    var checkMobile = (rule,value,cb)=>{
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return{
      
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:2
      },
      total:0,
      userList:[],
      // 控制添加用户的显示与隐藏
      addDialogVisible:false,
      // 添加用户表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:'',
      },
      // 添加表单验证规则
      addFormRules:{
        username:[
          { 
            required:true,
            message:'请输入用户名',
            trigger:'blur'
          },
          {
            min:3,
            max:10,
            message:'用户名在3~10个字符之间',
            trigger:'blur'
          }
        ],
        password:[
           { 
            required:true,
            message:'请输入密码',
            trigger:'blur'
          },
          {
            min:6,
            max:12,
            message:'用户名在6~12个字符之间',
            trigger:'blur'
          }
        ],
        email:[
           { 
            required:true,
            message:'请输入邮箱',
            trigger:'blur'
          },
          {
            validator:checkEmail,
            trigger:'blur'
          }
        ],
        mobile:[
           { 
            required:true,
            message:'请输入手机号码',
            trigger:'blur'
          },
          {
            validator:checkMobile,
            trigger:'blur'
          }
        ]
      },
        // 控制修改用户对话框显示
        editDialogVisible:false,
        // 查询到的用户信息
        editForm:{},
        distributionVisible:false,
        distributionId:'',
        // 需要被分配角色的用户信息
        userinfo:{},
        rolesList:{}
    }
  },
  components:{
    Dreadcrumb
  },
  created(){
    this.getUserList()
  },
  methods:{
    async getUserList(){
      const {data: res} = await this.$http.get('users',{params:this.queryInfo})
      // console.log(res);
      if(res.meta.status !== 200) return this.$message.error('获取用户列表失败');
      this.userList = res.data.users
      this.total = res.data.total
      
    },
    // 监听pagesize事件的改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged(userinfo){
      // console.log(userinfo);
      const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200){
        return this.$message.error('更新用户状态失败')
        userinfo.mg_state = !userinfo.mg_state
      }
      this.$message.success('更新用户状态成功')
    },
    getList(){
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    // 监听用户对话框的关闭事件
    addDialogClosd(){
      this.$refs.addFormRef.resetFields()
    },
    addUser(){
       this.$refs.addFormRef.validate( async valid =>{
         console.log(valid);
         if (!valid) return //验证不通过
         const {data:res} = await this.$http.post('users',this.addForm)
         if (res.meta.status !== 201) return this.$message.error('添加用户失败')
         this.$message.success('添加用户成功')
        //  隐藏对话框
         this.addDialogVisible = false
        //  重新获取用户列表
         this.getUserList()
       })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id){
      const {data:res} = await this.$http.get('users/'+ id)
      if(res.meta.status !== 200) return this.$message.error('查询用户信息失败')
      this.editForm = res.data
      this.editDialogVisible = true
      console.log(res);
    },
    // 监听用户对话框关闭事件
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息请求
        const {data:res} = await this.$http.put('users/' + this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
        if(res.meta.status !== 200) return this.$message.error('修改失败')
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改成功')
      })
    },
    // 根据id删除对应的用户
    async removeUserId(id){
     const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        // console.log(confirmResult);
        if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
        const {data:res} = await this.$http.delete('users/' + id)
        if(res.meta.status !== 200) return this.$message.error('删除用户失败')
        this.$message.success('删除用户成功')
        this.getUserList()
    },
    async distributionClick(userinfo){
      this.distributionVisible = true
      this.userinfo = userinfo
      const {data:res} = await this.$http.get(`roles`)
      if(res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.$message.success('获取角色列表成功')
      this.rolesList = res.data
      console.log(this.rolesList);
      console.log(this.userinfo);
    },
    // 点击按钮分配角色
    async distribution(){
      if (!this.distributionId) return this.$message.error('您还没有选择新的角色')
      const {data:res} = await this.$http.put(`users/${this.userinfo.id}/role`,
      {rid:this.distributionId})
      console.log(this.userinfo.id);
      console.log(this.distributionId);
      if(res.meta.status !== 200) return this.$message.error('修改角色失败')
      this.$message.success('修改角色成功')
      this.getUserList()
      this.distributionVisible = false
    },
    distributionClosed(){
      this.userinfo = []
      this.distributionId = ''
    } 
  }
}
</script>

<style lang='less' scoped>
</style>
