<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <div class="RoleEdit">
    <rolelist :id="id" :objNew="objNew" :dialog="dialog" @onSubmit="onSubmit" />
  </div>
</template>

<script>
import { apiGetAllPermissionCategory, apiUpdateRole, apiGetRole } from '@/api/authorize.js'
import rolelist from '@/components/RoleAddEdit/rolelist.vue'

export default {
  name: 'RoleEdit',
  components: {
    rolelist
  },
  data() {
    return {
      id: this.$route.params.id,
      objNew: [],
      permission: {},
      arr1: [],
      arr2: [],
      obj: [],
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
    const _this = this
    setTimeout(() => {
      _this.getRole()
    }, 500)
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
    getRole() {
      const req = {
        id: this.id
      }
      apiGetRole(req).then(response => {
        const currentAttr = response.data.exist_permissions
        for (let i = 0; i < currentAttr.length; i++) {
          for (let j = 0; j < this.objNew.length; j++) {
            if (currentAttr[i] === this.objNew[j].label) {
              this.objNew[j].isCheck = true
              this.objNew[j].checkAllDisabled = true
              for (let k = 0; k < this.objNew[j].value.length; k++) {
                this.objNew[j].value[k].disabled = true
              }
            }
            for (let k = 0; k < this.objNew[j].value.length; k++) {
              if (currentAttr[i] === this.objNew[j].value[k].label) {
                this.objNew[j].value[k].isCheck = true
              }
            }
          }
        }
        this.dialog.form.name = response.data.name
        this.dialog.form.description = response.data.description
      })
    },
    onSubmit(req) {
      apiUpdateRole(req).then(res => {
        this.$message({
          message: '修改成功',
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
