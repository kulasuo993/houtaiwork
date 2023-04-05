<template>
  <div class="userListPage">
    <el-form :model="dialog.form" :rules="dialog.formRule" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="名称" prop="name">
        <el-input v-model="dialog.form.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="dialog.form.description" placeholder="请输入描述"></el-input>
      </el-form-item>


      <el-form-item label="权限" >
        <div v-for="(item,index) in objNew" :key="index">
          <div class="moudle">
            <el-checkbox :key="item.label" :label="item.name" v-model="item.isCheck"></el-checkbox>
            <el-checkbox v-model="item.checkAll" :disabled="item.checkAllDisabled">全选</el-checkbox>
          </div>
          <div class="node">
            <el-checkbox v-for="c in item.value" 
            :key="c.label" :label="c.name"
            v-model="c.isCheck" :disabled="c.disabled">{{ c.name }}</el-checkbox>
          </div>
        </div>
        <el-button type="primary" size="medium" @click.stop="onSubmit" class="send">立即创建</el-button>
      </el-form-item>
     

    </el-form>
    
  </div>
</template>

<script>
import { apiGetAllPermissionCategory,apiGetPermissionCategory} from '@/api/authorize.js'
import { thisExpression } from '@babel/types'
const formData = {
  name: '',
  description: ''
}
export default {
  name: 'RoleAdd',
  components: { },
  data() {
    return {
      checkAll: false,
      objNew:[],
      permission:{},
      arr1:[],
      arr2:[],
      arr3:[],
      checkAll:false,
      checkAllDisabled:false,
      isCheck:false,
      disabled:false,

      dialog:{
        form:{
          name: '',
          description: ''
        },
        formRule: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ]
        }
      }
    }
  },
  watch: {
  },
  created() {
    this.getList()
  },
  methods: {
    getList(){
      apiGetAllPermissionCategory(this.permission).then(response =>{
        // console.log(response.data)
        for (const j in response.data) {
           this.arr1 = j
           this.arr2=( response.data[j])
           var arr = []
            for (let i in this.arr2) {
            arr.push({label:i,name:this.arr2[i],isCheck:this.isCheck,disabled:this.disabled,})
            }
          this.objNew.push({checkAll:this.checkAll
            ,checkAllDisabled:this.checkAllDisabled,isCheck:this.isCheck,
            label:this.arr1,name:this.arr1,value:arr})
        }
        console.log(this.objNew)
      }).catch(err =>{
        console.log(err)
      })
    },
     handleCheckAllChange(val) {
        this.checkedCities = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      }
  }
}
</script>

<style scoped>
  .node{
    width: 95%;
    margin-left: 30px;
    margin-top: 5px;
  }
 
 .send{
  display: block;
  margin: 0 auto;
 }
</style>