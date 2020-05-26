<template>
  <div>
     <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb> -->
    <Dreadcrumb>
      <span slot="tow">活动管理</span>
      <span slot="three">分类参数</span>
    </Dreadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type='warning'
      :closable='false' show-icon />
      <el-row class="cat_top">
        <el-col>
          <span>选择商品分类: </span>
          <!-- 商品分类级联选择框 -->
           <el-cascader
          v-model="selecCatedKeys"
          :options="cateList"
          :props="{ expandTrigger: 'hover', value:'cat_id',
          label:'cat_name',children:'children'}"
          @change="parentCateChange" clearable>
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type='primary' size='mini' :disabled="isBtnDisbled"
          @click="dialogVisibleShow">添加参数</el-button>
           <el-table :data='manyList' border stripe>
            <el-table-column type='expand'>
              <template v-slot='scope'>
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key='index'
                closable @close='handleClose(index,scope.row)'>{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>

            </el-table-column>
            <el-table-column type='index'></el-table-column>
            <el-table-column :label='titleText' prop='attr_name'></el-table-column>
            <el-table-column label='操作'>
              <template v-slot='scope'>
                <el-tooltip effect="dark" :enterable='false' content="修改" placement="top">
                  <el-button type="primary" icon="el-icon-edit" size='mini'
                  @click="showeditDialog(scope.row.attr_id)">编辑</el-button>
                </el-tooltip>
                <el-tooltip effect="dark" :enterable='false' content="删除" placement="top">
                  <el-button type="danger" icon="el-icon-delete" 
                  size='mini' @click="removeParams(scope.row.attr_id)">删除</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
           </el-table>
           </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
           <el-button type='primary' size='mini' :disabled="isBtnDisbled"
           @click="dialogVisibleShow">添加属性</el-button>
            <el-table :data='onlyList' border stripe>
              <el-table-column type='expand'>
                <template v-slot='scope'>
                  <!-- 循环渲染Tag标签 -->
                  <el-tag v-for="(item,index) in scope.row.attr_vals" :key='index'
                  closable @close='handleClose(index,scope.row)'>{{item}}</el-tag>
                  <!-- 输入的文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!-- 添加的按钮 -->
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
              <el-table-column type='index'></el-table-column>
              <el-table-column :label='titleText' prop='attr_name'></el-table-column>
              <el-table-column label='操作'>
              <template v-slot='scope'>
                <el-tooltip effect="dark" :enterable='false' content="修改" placement="top">
                  <el-button type="primary" icon="el-icon-edit" size='mini'
                   @click="showeditDialog(scope.row.attr_id)">编辑</el-button>
                </el-tooltip>
                <el-tooltip effect="dark" :enterable='false' content="删除" placement="top">
                  <el-button type="danger" icon="el-icon-delete" 
                  size='mini' @click="removeParams(scope.row.attr_id)">删除</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
           </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
     
      <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="dialogVisible"
      width="50%" @close='addDialogClose'>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

      <!-- 修改对话框 -->
     <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%" @close='editDialogClose'>
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Dreadcrumb from 'components/content/breadcrumb/Dreadcrumb'
export default {
  name:'Params',
  data(){
    return{
      cateList:[],
      // 级联选择框保存的数组
      selecCatedKeys:[],
      activeName:'many',
      manyList:[],
      onlyList:[],
      dialogVisible:false,
      // 添加表单数据对象
      addForm:{
        attr_name:''
      },
      // 表单验证规则对象
      addFormRules:{
        attr_name:[{required: true, message: '请输入参数名称', trigger: 'blur'}]
      },
      editDialogVisible:false,
      // 修改的表单数据对象
      editForm:{},
    }
  },
  components:{
    Dreadcrumb
  },
  created(){
    this.getParamsList()
  },
  methods:{
    async getParamsList(){
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.$message.success('获取分类数据成功')
      // console.log(res);
      this.cateList = res.data
    },
    async getClick(){
       if (this.selecCatedKeys.length !== 3) {
        this.selecCatedKeys = []
        this.manyList = []
        this.onlyList = []
        return
      }
      // console.log(this.selecCatedKeys);
      // 根据所选分类的id和当前所处的面板获取对应的参数
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
        params:{sel:this.activeName}
      })
      
      if(res.meta.status !== 200) return  this.$message.error('获取参数失败')
      this.$message.success('获取参数成功')
      res.data.forEach(item => {item.attr_vals = item.attr_vals ? item.attr_vals.split(' '):[],
        // 控制文本显示与隐藏
      item.inputVisible=false
      // 文本框输入的值
      item.inputValue= ''
      });
      console.log(res.data);
      if(this.activeName === 'many'){
        this.manyList = res.data
      }else{
         this.onlyList = res.data
      }
    },
    parentCateChange(){
     this.getClick()
    },
    async handleTabClick(){
     this.getClick()
    },
    dialogVisibleShow(){
      this.dialogVisible = true
    },
    addDialogClose(){
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加参数
    addParams(){
      this.$refs.addFormRef.validate(async valid =>{
        if (!valid) return
        const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName
        })
        if(res.meta.status !== 201) return this.$message.error('添加参数失败')
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.getClick()
      })
    },
    async showeditDialog(id){
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/`+id,{
        params:{attr_sel:this.activeName}
      })
      // console.log(res);
      this.editForm = res.data
      this.editDialogVisible = true
      
     },
    editDialogClose(){
      this.$refs.editFormRef.resetFields()
    },
    async editParams(){
      const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
        attr_name:this.editForm.attr_name,
        attr_sel:this.activeName
      })
      // console.log(res);
      if(res.meta.status !== 200) return this.$message.error('修改'+this.titleText+'失败')
      this.$message.success('修改'+this.titleText+'成功')
      this.getClick()
      this.editDialogVisible = false
      
    },
    async removeParams(id){
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if(res.meta.status !== 200) return this.$message.error('删除'+this.titleText+'失败')
      this.$message.success('删除'+this.titleText+'成功')
      this.getClick()
    },
    async handleInputConfirm(row){
      if (row.inputValue.trim().length === 0) {
        row.inputValue='',
        row.inputVisible = false
        return
      }
      // 如果没有return,则证明输入了内容
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible=false
      this.saveAttrVals(row)
    },
    showInput(row){
      row.inputVisible = true
      // 让文本框自动获取焦点
      // .$nextTick方法的作用，就是当页面上的元素被重新渲染后，才会指定回调函数中的代码
       this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 删除对应可选项
    handleClose(i,row){
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row)
    },
    async saveAttrVals(row){
       const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name : row.attr_name,
        attr_sel : row.attr_sel,
        attr_vals : row.attr_vals.join(' ')
      })
      if(res.meta.status !==200) return this.$message.error('修改失败')
      this.$message.success('修改成功')
    }
  },
  computed:{
    isBtnDisbled(){
     return this.selecCatedKeys.length !==3
    },
    cateId(){
      if(this.selecCatedKeys.length === 3){
        return this.selecCatedKeys[2]
      }
      return null
    },
    titleText(){
      if (this.activeName === 'many') {
        return '参数名称'
      }else{
        return '属性名称'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_top{
  margin-top: 15px;
}
.input-new-tag{
  width: 120px;
}
</style>