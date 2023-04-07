<!-- eslint-disable no-const-assign -->
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
              :label="c.label"
              :disabled="c.disabled"
              @change="itemChoose(c,item)"
            >
              {{ c.name }}
            </el-checkbox>
          </div>
        </div>
        <el-button type="primary" size="medium" class="send" @click.stop="onSubmit">
          <span v-if="id1">提交</span>
          <span v-else-if="!id1">立即创建</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Rolelist',
  components: {},
  // eslint-disable-next-line vue/require-prop-types
  props: ['objNew', 'dialog', 'id'],
  data() {
    return {
      id1: this.id
    }
  },
  created() {
  },
  methods: {
    changeGroup(objNew) {
      for (var i in objNew.value) {
        if (objNew.isCheck === true) {
          objNew.value[i].disabled = true
          // objNew.value[i].isCheck = true
          objNew.checkAllDisabled = true
          // objNew.checkAll = true
        } else {
          objNew.value[i].disabled = false
          // objNew.value[i].isCheck = false
          objNew.checkAllDisabled = false
          // objNew.checkAll = false
        }
      }
    },
    changeAll(objNew) {
      for (var i in objNew.value) {
        if (objNew.checkAll === true) {
          objNew.value[i].isCheck = true
        } else {
          objNew.value[i].isCheck = false
        }
      }
    },
    itemChoose(c, item) {
      let num = 0
      for (var i in item.value) {
        // console.log(item.value[i].name)
        if (item.value[i].isCheck) {
          num++
        }
      }
      if (num === item.value.length) {
        item.checkAll = true
      } else {
        item.checkAll = false
      }
    },
    onSubmit() {
      console.log(this.objNew)
      var tmp = []
      // eslint-disable-next-line no-const-assign
      for (let i = 0; i < this.objNew.length; i++) {
        if (this.objNew[i].isCheck === true) {
          tmp.push(this.objNew[i].label)
        } else {
          for (let j = 0; j < this.objNew[i].value.length; j++) {
            if (this.objNew[i].value[j].isCheck === true) {
              tmp.push(this.objNew[i].value[j].label)
            }
          }
        }
      }
      this.dialog.form.selected_permissions = tmp.join(',')
      this.dialog.form.id = this.id1
      var req = JSON.parse(JSON.stringify(this.dialog.form))
      console.log(req)
      new Promise((resolve, reject) => {
        this.$refs['ruleForm'].validate((valid) => {
          if (!valid) {
            reject(new Error())
            return
          }
          if (req.selected_permissions === '') {
            this.$message({
              message: '权限选项不能为空',
              type: 'error'
            })
            return
          }
          resolve(true)
        })
      }).then(() => {
        if (!this.id1) {
          delete req.id
          this.$emit('onSubmit', req)
        }
        if (this.id1) {
          this.$emit('onSubmit', req)
        }
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
