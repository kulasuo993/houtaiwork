<template>
  <div class="userListPage" style="padding: 20px;">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="">
        <el-input v-model="searchForm.name" clearable placeholder="名称" />
      </el-form-item>
      <el-form-item label="">
        <el-input v-model="searchForm.description" clearable placeholder="描述" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
      </el-form-item>
      <el-button v-if="$store.getters.permissions.button['user-medal_create']" type="primary" style="float: right" @click="openDialog(null)">添加权限</el-button>
    </el-form>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="类型" align="center" prop="type" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="openDialog(scope.row.name,scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="DialogDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="searchForm.page" :limit.sync="searchForm.page_size" @pagination="getList" />

    <el-dialog
      ref="formDialog"
      :title="(dialog.form.id?'编辑权限':'添加权限')"
      :visible.sync="dialog.status"
      width="540px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      @close="closeDialog"
    >
      <el-form ref="form" :rules="dialog.formRule" :model="dialog.form" label-width="100px" size="small">
        <el-form-item label="类型" prop="category">
          <el-select v-if="dialog.form.id" v-model="dialog.form.category" disabled placeholder="请选择类型" style="width: 100%">
            <el-option v-for="item in objNew" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-else-if="!dialog.form.id" v-model="dialog.form.category" placeholder="请选择类型" style="width: 100%">
            <el-option v-for="item in objNew" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="权限名称" prop="name">
          <el-input v-model="dialog.form.name" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="dialog.form.description" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="position: relative; right: 80px;top: 32px;">
        <el-button type="primary" size="small" @click.stop="onSubmit">确 认</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.stop="closeDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { apiPermissionList, apiPermissionCreat, apiPermissionEdit,
  apiGetPermission, apiDeletePermission, apiGetPermissionCategory } from '@/api/authorize'
import Pagination from '@/components/Pagination'

const formData = {
  name: '',
  description: '',
  category: '', // 权限分类
  id: ''
}
export default {
  name: 'PermissionList',
  components: { Pagination },
  data() {
    return {
      searchForm: {
        page_size: 20,
        page: 1,
        name: '',
        description: ''
      },
      permission: {},
      list: null,
      listLoading: false,
      total: 0,
      objNew: [],
      dialog: {
        status: false,
        loading: null,
        form: formData,
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
    this.getPermission()
  },
  methods: {
    getList() {
      this.listLoading = true
      apiPermissionList(this.searchForm).then(response => {
        const data = response.data
        this.list = data.rows
        this.total = data.totalCount
        this.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    getPermission() {
      this.objNew = []
      apiGetPermissionCategory(this.permission).then(res => {
        for (const j in res.data) {
          this.objNew.push({ value: j, label: res.data[j] })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    searchData() {
      this.getList()
    },
    // 获取当前权限信息
    getPermissionInfo(id) {
      this.dialog.status = true
      const data = {
        id: id
      }
      apiGetPermission(data).then(response => {
        this.dialog.form.category = response.data.category
        this.dialog.form.name = response.data.name
        this.dialog.form.description = response.data.description
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 打开 创建/修改的Dialog
     * @param id 虚拟ID（修改才会有）
     * @param item 物品信息
     */
    openDialog(id, item) {
      this.getPermission()
      this.dialog.status = true
      if (!id) {
        return false
      }
      this.dialog.status = true
      this.getPermissionInfo(id)
      this.dialog.form.id = id
    },
    closeDialog() {
      this.dialog.form = formData
      this.dialog.form.id = ''
      this.dialog.loading = null
      this.$refs['form'].resetFields()
      this.dialog.status = false
    },
    onSubmit() {
      new Promise((resolve, reject) => {
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            reject(new Error())
            return
          }
          resolve(true)
        })
      }).then(() => {
        if (!this.dialog.form.id) {
          const req = JSON.parse(JSON.stringify(this.dialog.form))
          delete req.id
          apiPermissionCreat(req).then(res => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            delete req.id
            this.closeDialog()
            this.getList()
            this.getPermission()
          }).catch(err => {
            console.log(err)
          })
        }
        if (this.dialog.form.id) {
          const req = JSON.parse(JSON.stringify(this.dialog.form))
          apiPermissionEdit(req).then(res => {
            this.$message({
              message: '成功修改',
              type: 'success'
            })
            this.closeDialog()
            this.getList()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    DialogDelete(item) {
      this.dialog.form = {
        id: item.name
      }
      const req = JSON.parse(JSON.stringify(this.dialog.form))
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiDeletePermission(req).then(res => {
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
    }
  }
}
</script>

