<template>
  <div class="userListPage">
    <el-form :model="dialog.form" :rules="dialog.formRule" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="名称" prop="name">
        <el-input v-model="dialog.form.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="dialog.form.description" placeholder="请输入描述"></el-input>
      </el-form-item>
      <!-- <el-form-item label="权限">
          <el-checkbox v-for="item in objNew" :label="item.value" :value  ="item.value">
          </el-checkbox>
      </el-form-item> -->
      <!-- <el-checkbox >全选</el-checkbox> -->
      
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox  v-for="item in objNew" :label="item.value" :value="item.value" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
      </el-checkbox-group>
     
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        
        <el-checkbox v-for="item in objNew1" :label="item.label" :value="item.value"></el-checkbox>
      </el-checkbox-group>
    </el-form>
    
  </div>
</template>

<script>
import { apiGetAllPermissionCategory,apiGetPermissionCategory} from '@/api/authorize.js'
const cityOptions = ['上海', '北京', '广州', '深圳'];
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
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: true,
      objNew:[],
      objNew1:[],
      permission:{},
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
        for (const j in response.data) {
          this.objNew.push({ value: j, label: response.data[j] })
          for(const i in response.data[j]){
            // console.log(i)
            this.objNew1.push({ value: i, label: response.data[j][i] })
           
          }
          
        }
        console.log(this.objNew)
        // console.log(this.objNew)
       
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

