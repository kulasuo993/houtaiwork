<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <div class="userListPage">
    <rolelist :objNew="objNew" :dialog="dialog" @onSubmit="onSubmit" />
  </div>
</template>

<script>
import { apiGetAllPermissionCategory, apiCreatRole } from '@/api/authorize.js'
import rolelist from '@/components/RoleAddEdit/rolelist.vue'

export default {
  name: 'RoleAdd',
  components: {
    rolelist
  },
  data() {
    return {
      objNew: [],
      permission: {},
      arr1: [],
      arr2: [],
      checkAll: false,
      checkAllDisabled: false,
      isCheck: false,
      disabled: false,
      dialog: {
        form: {
          name: '',
          description: '',
          selected_permissions: {}
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
      }).catch(err => {
        console.log(err)
      })
    },
    onSubmit(req) {
      apiCreatRole(req).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.$router.push({
          name: 'RoleList'
        })
      }).catch(err => {
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
