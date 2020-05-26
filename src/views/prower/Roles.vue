<template>
  <div>
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <Dreadcrumb>
      <span slot="tow">权限管理</span>
      <span slot="three">角色列表</span>
    </Dreadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type='primary' @click="addClick">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data='roleslist' border stripe>
        <el-table-column type='expand'>
          <template v-slot='scope'>
            <el-row v-for="(item1,index) in scope.row.children" :key="item1.id"
            :class="['bdbottom',index === 0 ? 'bdtop':'','vcenter']">
              <!-- 一级权限 -->
              <el-col :span='5'>
                <el-tag closable  @close='removeRight(scope.row,item1.id)'>{{item1.authName}} </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span='19'>
                <!-- 二级权限 -->
                <el-row v-for="(item2,indey) in item1.children" :key='item2.id'
                :class="[indey == 0 ? '':'bdtop','vcenter']">
                  <el-col :span='6'>
                   <el-tag type='success' closable 
                   @close='removeRight(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                   <i class="el-icon-caret-right"></i>
                  </el-col>
                <!-- 三级权限 -->
                   <el-col :span='18' >
                   <el-tag type='warning' v-for="(item3,indez) in item2.children" :key='item3.id'
                :class="[indez == 0 ? '':'bdtop']" closable 
                @close='removeRight(scope.row,item3.id)'>{{item3.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
            {{scope.row}}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type='index'></el-table-column>
        <el-table-column label='角色名称' prop='roleName'></el-table-column>
        <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
        <el-table-column label='操作' width='360px'>
          <template v-slot='scope'>
          <el-tooltip effect="dark" :enterable='false' content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" size='mini'
            @click="showEditDialog(scope.row.id)">编辑</el-button>
           </el-tooltip>

          <el-tooltip effect="dark" :enterable='false' content="分配权限" placement="top">
             <el-button type="warning" icon="el-icon-setting" 
             size='mini' @click="showSetRight(scope.row)">分配权限</el-button>
          </el-tooltip>
          <el-tooltip effect="dark" :enterable='false' content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" 
            size='mini' @click="removeUserId(scope.row.id)">删除</el-button>
          </el-tooltip>
        </template>
        </el-table-column>
      </el-table>
    </el-card>

     <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%" @close='addDialogClosd'>

        <!-- 内容主题 -->
        <el-form :model="FromList" ref="addFormRef" label-width="90px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="FromList.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="FromList.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close='editDialogClosed'
      center>
      <el-form :model="editForm"
      ref="editFormRef" label-width="90px">
     <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配权限"
      :visible.sync="setRightVisible"
      width="50%" @close='setRightDiaClosed'>

        <!-- 内容主题树形控件 -->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox
        node-key='id' default-expand-all :default-checked-keys='defkeys'
         ref="treeRef"></el-tree>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import Dreadcrumb from '../../components/content/breadcrumb/Dreadcrumb'


export default {
  name:'Roles',
  data(){
    return{
      roleslist:[],
      addDialogVisible:false,
      FromList:{
        roleName:'',
        roleDesc:'',
      },
      editForm:{},
      editDialogVisible:false,
      setRightVisible:false,
      rightsList:[],
      // 树形控件的绑定对象
      treeProps:{
        children: 'children',
        label: 'authName'
      },
      // 默认显示的节点id
      defkeys:[],
      roleId:''
    }
  },
  components:{
    Dreadcrumb
  },
  created(){
    this.getRolesList()
  },
  methods:{
    async getRolesList(){
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !== 200) return this.$message.error('获取角色列表失败');
      this.roleslist = res.data
      this.$message.success('获取角色列表成功')
      console.log(this.roleslist);
    },
    addClick(){
      this.addDialogVisible = true
    },
     addDialogClosd(){
      this.$refs.addFormRef.resetFields()
    },
    async addUser(){
      const {data:res} = await this.$http.post('roles',this.FromList)
      // console.log(res);
      if(res.meta.status !== 201) return this.$message.error('添加用户失败')
      this.$message.success('添加用户成功')
      
      
        //  隐藏对话框
         this.addDialogVisible = false
        //  重新获取用户列表
         this.getRolesList()
    },
    async showEditDialog(id){
      const {data:res} = await this.$http.get('roles/'+ id)
      if(res.meta.status !== 200) return this.$message.error('查询用户信息失败')
      console.log(res);
      
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    async editUserInfo(){
       const {data:res} = await this.$http.put('roles/'+ this.editForm.roleId,{
         roleDesc:this.editForm.roleDesc,
         roleName:this.editForm.roleName
       })
       console.log(res);
       
       if(res.meta.status != 200) return this.$message.error('修改用户失败')
       this.$message.success('修改成功')
       this.editDialogVisible = false
       this.getRolesList()
    },
    async removeUserId(id){
      const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
          // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        // console.log(confirmResult);
        if (confirmResult !== "confirm") return this.$message.info('已取消删除')
       const {data:res} = await this.$http.delete('roles/'+id)
      //  console.log(res);
       if(res.meta.status !== 200) this.$message.error('删除失败')
       this.$message.success('删除成功')
       this.getRolesList()
    },
    // 根据id删除对应权限
    async removeRight(role,id){
      const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if (confirmResult !== "confirm") return this.$message.info('已取消删除')
      const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      //  console.log(res);
      if(res.meta.status !== 200) this.$message.error('删除失败')
      this.$message.success('删除成功')
      // this.getRolesList()
      role.children = res.data
      
    },
    // 展示分配权限的对话框
    async showSetRight(role){
      // 获取所有的权限的数据
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200) return this.$message.error('获取权限数据失败')
      this.rightsList = res.data
      this.getLeafKeys(role,this.defkeys)
      // console.log(this.defkeys);
      this.roleId = role.id
      this.setRightVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node,arr){
      // 如果当前nede节点中不包含children属性则是三级节点
      if(!node.children) return arr.push(node.id)
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setRightDiaClosed(){
     this.defkeys = []
    },
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const strId = keys.join(',')
      // console.log(strId);
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:strId})
      if(res.meta.status !== 200) return this.$message.error('修改权限失败')
      this.$message.success('修改权限成功')
      this.getRolesList()
      this.setRightVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: solid 1px #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style> 