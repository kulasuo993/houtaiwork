<template>
  <div class="userListPage">
    <el-form ref="ruleForm" :model="dialog.form" :rules="dialog.formRule" label-width="100px" class="demo-ruleForm">
      <el-form-item label="名称" prop="name">
        <el-input v-model="dialog.form.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="dialog.form.description" type="textarea" placeholder="请输入描述" />
      </el-form-item>

      <el-form-item label="权限">
        <div v-for="(item,index) in objNew" :key="index">
          <div class="moudle">
            <el-checkbox :key="item.label" v-model="item.isCheck" :label="item.name" @change="changeGroup(item)" />
            <el-checkbox v-model="item.checkAll" :disabled="item.checkAllDisabled" @change="changeAll(item)" />全选
          </div>
          <div class="node">
            <el-checkbox
              v-for="c in item.value"
              :key="c.label"
              v-model="c.isCheck"
              :label="c.name"
              :disabled="c.disabled"
              @change="itemChoose(c,item)"
            >
              {{ c.name }}
            </el-checkbox>
             
          </div>
        </div>
        <el-button type="primary" size="medium" class="send" @click.stop="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { apiGetAllPermissionCategory, apiCreatRole} from '@/api/authorize.js'
// import { thisExpression } from '@babel/types'

export default {
  name: 'RoleAdd',
  components: { },
  data() {
    return {
      objNew: [],
      permission: {},
      arr1: [],
      arr2: [],
      arr3: [],
      arr4: [],
      checkAll: false,
      checkAllDisabled: false,
      isCheck: false,
      disabled: false,
      dialog: {
        form: {
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
    getList() {
      apiGetAllPermissionCategory(this.permission).then(response => {
        //  console.log(response.data)
        for (const j in response.data) {
          this.arr1 = j
          this.arr2 = (response.data[j])
          var arr = []
          for (const i in this.arr2) {
            arr.push({ label: i, name: this.arr2[i], isCheck: this.isCheck, disabled: this.disabled })
          }
          this.objNew.push({ checkAll: this.checkAll,
            checkAllDisabled: this.checkAllDisabled, isCheck: this.isCheck,
            label: this.arr1, name: this.arr1, value: arr })
        }
        console.log(this.objNew)
      }).catch(err => {
        console.log(err)
      })
    },
    changeGroup(objNew){
      for(let i in objNew.value){
        if(objNew.isCheck == true){
          objNew.value[i].disabled = true
          objNew.value[i].isCheck = true
          objNew.checkAllDisabled = true
          objNew.checkAll = true
        }else{
          objNew.value[i].disabled = false
          objNew.value[i].isCheck = false
          objNew.checkAllDisabled = false
          objNew.checkAll = false
        }
      }
    },
    changeAll(objNew){
     
      for(let i in objNew.value){
        if(objNew.checkAll == true){
          this.arr4.push(objNew.value[i].name)
          objNew.value[i].isCheck = true
        }else{
          objNew.value[i].isCheck = false
          this.arr4 = this.arr4.filter(item => item =objNew.value[i].name)
        }
      }
    },
    itemChoose(c,item){
      let num = 0
      console.log(c.isCheck)
      if(c.isCheck){
        this.arr4.push(c.name)
      }else{
        this.arr4 = this.arr4.filter(item => item =c.name)
      }
      console.log(this.arr4)
      for(let i in item.value){
        // console.log(item.value[i].name)
          if(item.value[i].isCheck){
              num ++
          }
      }
      if(num === item.value.length){
        item.checkAll  = true
      }else{
        item.checkAll  = false
      }
    },
    onSubmit(){
      const req = JSON.parse(JSON.stringify(this.dialog.form))
      apiCreatRole(req).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.$router.push({
          name: 'RoleList'
        })
      }).catch(err =>{
        console.log(err)
      })
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
