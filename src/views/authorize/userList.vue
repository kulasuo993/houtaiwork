<template>
  <div class="userListPage" style="padding: 20px;">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="">
        <el-input v-model="searchForm.username" clearable placeholder="用户名" />
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="searchForm.nickname" clearable placeholder="昵称" />
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="searchForm.email" clearable placeholder="邮箱" />
      </el-form-item>
      <el-form-item label="">
        <el-select  v-model="searchForm.status" clearable placeholder="请选择类型" style="width: 100%">
            <!-- <el-option label="用户状态" :value="200" /> -->
            <el-option label="正常" :value="200" />
            <el-option label="异常" :value="100" />
        </el-select>
      </el-form-item>
     
      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
      </el-form-item>
      <el-button v-if="$store.getters.permissions.button['user-medal_create']" type="success" style="float: right" @click="openDialog(null)">添加用户</el-button>
      <!-- <el-button v-if="$store.getters.permissions.button['user-medal_create']" type="primary" style="float: right" @click="openDialog(null)">添加权限</el-button> -->
    </el-form>
    
    <el-table  v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="ID" align="center" prop="user_id" min-width="40%"/>
      <el-table-column label="用户名" align="center" prop="username" min-width="40%" />
      <el-table-column label="昵称" align="center" prop="nickname" min-width="40%" />
      <el-table-column label="电子邮箱" align="center" prop="email" min-width="40%"/>
      <el-table-column label="状态" align="center" prop="status" min-width="40%">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='200'" >正常</span>
          <span v-if="scope.row.status==='100'">异常</span>
        </template>
      </el-table-column>
      <el-table-column label="OA用户" align="center" prop="is_oa" min-width="40%">
        <template slot-scope="scope">
          <span v-if="scope.row.is_oa==='1'" >是</span>
          <span v-if="scope.row.is_oa==='2'">否</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="openDialog(scope.row.user_id,scope.row)">
            编辑
          </el-button>
          <el-button type="success" size="small" @click="editUser(scope.row.user_id)">设置角色</el-button>
          <el-button type="info" size="small" @click="editPssword">修改密码</el-button>
          <el-button type="danger" size="small" @click="DialogDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="searchForm.page" :limit.sync="searchForm.page_size" @pagination="getList" />
      
        <el-dialog
          :title="'设置用户角色'"
          v-loading="listLoading"
          :visible.sync="isOpen"
          width="400px"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :destroy-on-close="true"
          @close="closeDialog1"
        >
        <el-checkbox-group v-model="arr2">
          <el-checkbox  
            v-for="item in arr" 
            :key="item.description" 
            :label="item.name"
          >
            {{ item.description }}
          </el-checkbox>
        </el-checkbox-group>
        
        <div class="btn">
          <el-button type="primary" @click="setRole()">确认</el-button>
          <el-button @click="closeDialog1">取消</el-button>
        </div>
        
        </el-dialog>
      
     

      <el-dialog
        ref="formDialog"
        :title="(dialog.form.user_id?'修改用户':'添加用户')"
        :visible.sync="dialog.status"
        width="540px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        @close="closeDialog"
      >
      <el-form ref="form" :rules="dialog.formRule" :model="dialog.form" label-width="100px" size="small">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="dialog.form.username" placeholder="用户名"/>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="dialog.form.nickname" placeholder="用户昵称" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="dialog.form.email" placeholder="电子邮箱" style="width: 100%">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="dialog.form.mobile" placeholder="手机号码" style="width: 100%">
          </el-input>
        </el-form-item>
        <el-form-item v-if="!dialog.form.user_id" label="用户密码" prop="password">
          <el-input v-model="dialog.form.password" placeholder="用户密码" style="width: 100%">
          </el-input>
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-radio-group v-model="dialog.form.status">
            <el-radio :label="'200'">正常</el-radio>
            <el-radio :label="'100'">异常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="OA用户" prop="is_oa">
          <el-radio-group v-model="dialog.form.is_oa">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'2'">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click.stop="onSubmit">确 认</el-button>
      </div>
      </el-dialog>
  </div>
</template>

<script>
import {apiAdminUserList,apiAdminUserCreat,
  apiAdminUserCUpdata,apiAdminUserDelete,
  apiGetUserRole,apiGetAllRole,
  apiSetUserRole} from '@/api/authorize.js'

import Pagination from '@/components/Pagination'
const formData = {
  username: '', //no 搜索条件(模糊搜索),用户名
  nickname: '', //搜索条件(模糊搜索),昵称
  email:'', //搜索条件(模糊搜索),邮箱
  status:'200',//搜索条件(精确搜索),用户状态,100-异常,200-正常
  password:'',
  mobile:'',
  is_oa:'1',
  user_id: ''
}

export default {
  name: 'AuthorizeUser',
  components: { Pagination},
  data() {
    return {
      user_id: '',
      isOpen: false,
      searchForm: {
        page_size: 20,
        page: 1,
        username: '', //no 搜索条件(模糊搜索),用户名
        nickname: '', //搜索条件(模糊搜索),昵称
        email:'', //搜索条件(模糊搜索),邮箱
        status:'',//搜索条件(精确搜索),用户状态,100-异常,200-正常
        is_oa:'',
      },
      list:null,
      list2:null,
      arr:[],
      arr2:[],
      arr3:[],
      obj:{},
      listLoading: false,
      total: 0,
      dialog: {
        status: false,
        loading: null,
        form: formData,
        formRule: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          nickname: [
            { required: true, message: '请输入用户昵称', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入用户手机号码', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不少于6位，必须包含数字和大小写字母和一个特殊字符，特殊字符可包含($,@,#,!,%,*,?,&,.)', trigger: 'blur' }
          ],
        }
      }
    }
  },
  watch: {
  },
  created() {
    this.getList()
    this.getAllRole()
  },
  methods: {
    getList() {
      this.listLoading = true
      apiAdminUserList(this.searchForm).then(response => {
        const data = response.data
        this.list = data.rows
        this.total = data.totalCount
        this.listLoading = false
        // for(let i in this.list){
        //   this.arr3.push(this.list[i].user_id)
        // }
      }).catch(err => {
        console.log(err)
      })
    },
    getUserRole(req){
      apiGetUserRole(req).then(response => {
        for(const i in response.data){
          this.arr2.push(response.data[i].name)
          this.arr3=req.user_id
        }
        console.log(this.arr2)
      }).catch(err => {
        console.log(err)
      })
    },
    setRole(){
      this.obj = this.arr2.join(",")
      this.dialog.form = {
        user_id: this.arr3,
        selected_roles:this.obj
      }
      const req = JSON.parse(JSON.stringify(this.dialog.form))
      apiSetUserRole(req).then(res => {
        this.$message({
          message:"成功修改",
          type:'success'
        })
        this.closeDialog1()
        this.getList()
      })
    },
    editUser(id){
      this.isOpen = true
      this.getAllRole()
      const req ={
        user_id:id,
      }
     this.getUserRole(req)
    },
    getAllRole(){
      this.arr=[]
      this.arr2=[]
      apiGetAllRole(this.searchForm).then(res=>{
      //  this.list2 = res.data
      for(const i in res.data){
        this.arr.push({name:i,description:res.data[i].description})
      }
      // console.log(this.arr)
      }).catch(err => {
        console.log(err)
      })
    },
    searchData(){
      this.getList()
    },
    closeDialog() {
      this.dialog.form = formData
      this.dialog.loading = null
      this.$refs['form'].resetFields()
      this.dialog.status = false
    },
    closeDialog1(){
      this.arr=[],
      this.isOpen= false
    },
     /**
     * 打开 创建/修改的Dialog
     * @param id 虚拟ID（修改才会有）
     * @param item 物品信息
     */
    openDialog(id,item){
      this.dialog.status = true
      if(!id){
        return false
      }
      this.dialog.form ={
        user_id:item.user_id,
        username:item.username,
        nickname:item.nickname,
        email:item.email,
        status:item.status,
        mobile:item.mobile,
        is_oa:item.is_oa,
      }
    },
    onSubmit(){
      new Promise((resolve, reject) => {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            reject(new Error())
            return
          }
          resolve(true)
        })
        if(this.dialog.form.username == 'aa'){
          alert(111)
        }
      }).then(()=>{
        if(!this.dialog.form.user_id){
          const req = JSON.parse(JSON.stringify(this.dialog.form))
          apiAdminUserCreat(req).then(res =>{
              this.$message({
                message:"成功创建",
                type:'success'
              })
              this.closeDialog()
              this.getList()
          }).catch(err =>{
            console.log(err)
          })
        }
        if(this.dialog.form.user_id){
          const req = JSON.parse(JSON.stringify(this.dialog.form))
          apiAdminUserCUpdata(req).then(res =>{
              this.$message({
                message:"成功修改",
                type:'success'
              })
              this.closeDialog()
              this.getList()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    DialogDelete(item){
      this.dialog.form ={
        user_id:item.user_id,
        username:item.username,
        nickname:item.nickname,
        email:item.email,
        status:item.status,
        mobile:item.mobile,
        is_oa:item.is_oa,
      }
      const req = JSON.parse(JSON.stringify(this.dialog.form))
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiAdminUserDelete(req).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getList()
          this.closeDialog()
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editPssword(){
      this.$message({
          type: 'success',
          message: '没有api，但也算你修改密码成功'
        })
    }
  }
}
</script>

<style scoped>
  .btn{
    margin-top: 30px;
    margin-left: 200px;
  }
</style>