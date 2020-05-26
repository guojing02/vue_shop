<template>
  <div>
   <Dreadcrumb>
      <span slot="tow">活动管理</span>
      <span slot="three">商品分类</span>
    </Dreadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type='primary' @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table class="treeTable" :data='catelist' :columns='columns'
      :selection-type='false' :expand-type='false' show-index
      index-text='#' border>
      <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color:lightgreen;"
          v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color:red;" v-else></i>
        </template>
        <!--排序  -->
        <template slot='order' slot-scope="scope">
          <el-tag size='mini' 
          v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type='success' size='mini'
          v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type='warning' size='mini' v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
         <template slot='opt' slot-scope="scope">
           
          <el-button type='primary' size='mini' icon="el-icon-edit"
          @click="editDialogShow(scope.row)">编辑</el-button>
          <el-button type='danger' size='mini' icon="el-icon-delete"
          @click="removeCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total='total'>
    </el-pagination> 
    </el-card>
     
     <el-dialog
      title="添加分类"
      :visible.sync="CateDialogVisble"
      width="50%" 
      center @close='addCateDialogClose'>
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef"
       label-width="120px" class="demo-ruleForm">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
           <el-cascader
          v-model="selectedKeys"
          :options="parentCate"
          :props="{ expandTrigger: 'hover', value:'cat_id',
          label:'cat_name',children:'children',checkStrictly: true}"
          @change="parentCateChange" clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="CateDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑分类名称"
      :visible.sync="editDialogVisible"
      width="50%" 
      center @close='editDialogClosed'>
      <el-form :model="addCateForm"
      ref="editCateRef" label-width="90px">
      <el-form-item label="分类名称">
        <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCatName">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Dreadcrumb from '../../components/content/breadcrumb/Dreadcrumb'

export default {
  name:'Cate',
  data(){
    return{
      // 商品分类的数据列表
      catelist:[],
      // 查询条件
      querInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      // 总数据条数
      total:0,
      columns:[{
        label:'分类名称',
        prop:'cat_name'
      },
      {
        label:'是否有效',
        // 表示当前列为模板
        type:'template',
        // 表示当前这一列的模板名称
        template:'isok'
      },
      {
        label:'排序',
        // 表示当前列为模板
        type:'template',
        // 表示当前这一列的模板名称
        template:'order'
      },
       {
        label:'操作',
        // 表示当前列为模板
        type:'template',
        // 表示当前这一列的模板名称
        template:'opt'
      }],
      CateDialogVisble:false,
      addCateForm:{
        // 分类名称
        cat_name:'',
        // 父级分类
        cat_pid:0,
        // 分类层级
        cat_level:0,
        cat_id:''
      },
      addCateRules:{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      parentCate:[],
      selectedKeys:[],
      editDialogVisible:false,
    }
  },
  components:{
    Dreadcrumb
  },
  created(){
    this.getCateList()

  },
  methods:{
    // 获取商品分类数据
    async getCateList(){
      const {data:res} = await this.$http.get('categories',{params:this.querInfo})
      if(res.meta.status !== 200) return this.$message.error('请求分类数据失败')
      this.$message.success('请求分类数据成功')
      console.log(res);
      this.total = res.data.total
      this.catelist = res.data.result
    },
     handleSizeChange(newSize){
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听页码改变
    handleCurrentChange(newPage){
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog(){
      this.getParentCate()
      this.CateDialogVisble = true
    },
    // 获取父级分类数据
    async getParentCate(){
      const {data:res} = await this.$http.get('categories',{params:{type:2}})
      if(res.meta.status !==200) return this.$message.error('获取父级分类失败')
      console.log(res.data);
      this.parentCate = res.data
    },
    parentCateChange(){
      console.log(this.selectedKeys);
      if(this.selectedKeys.length > 0){
        // 父级分类的id
       this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
      //  为当前等级赋值
       this.addCateForm.cat_level = this.selectedKeys.length
      }else{
          this.addCateForm.cat_pid = 0
      //  为当前等级赋值
       this.addCateForm.cat_level = 0
      }
    },
    addCate(){
     this.$refs.addCateRef.validate(async valid=>{
       if(!valid) return
       const {data:res} = await this.$http.post('categories',this.addCateForm)
       if(res.meta.status !== 201) return this.$message.error('添加分类失败')
       this.$message.success('添加分类成功')
       this.getCateList()
       this.CateDialogVisble = false
     })      
    },
    addCateDialogClose(){
      this.$refs.addCateRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid=0
      this.addCateForm.cat_level=0
    },
    async editDialogShow(id){
      const {data:res} = await this.$http.get('categories/'+id.cat_id)
      if(res.meta.status !== 200) return this.$message.error('获取分类名称失败')
      this.addCateForm.cat_name=res.data.cat_name
      this.addCateForm.cat_id =res.data.cat_id
      this.editDialogVisible=true
    },
    editDialogClosed(){
      this.$refs.editCateRef.resetFields()
    },
    async editCatName(){
      const {data:res} = await this.$http.put('categories/'+this.addCateForm.cat_id,{
        cat_name:this.addCateForm.cat_name
      })
      if(res.meta.status !==200) return this.$message.error('修改分类名称失败')
      this.$message.success('修改分类名称成功')
      this.getCateList()
      this.editDialogVisible = false
    },
    async removeCate(id){
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        console.log(confirmResult);
        
      if(confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const {data:res} = await this.$http.delete('categories/'+id)
      if(res.meta.status !== 200) return this.$message.error('删除分类失败')
      this.$message.success('删除分类成功')
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable{
  margin-top: 15px;
}
</style>