<template>
  <div class="userListPage">
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
      <el-button v-if="$store.getters.permissions.button['user-medal_create']" type="success" style="float: right" @click="openDialog(null)">添加角色</el-button>
    </el-form>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="openDialog(scope.row.medal_id,scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="openDialog(scope.row.medal_id,scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="searchForm.page" :limit.sync="searchForm.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { apiAuthorizeList } from '@/api/authorize'
import Pagination from '@/components/Pagination'

const formData = {
  page: 0,
  page_size: '',
  name: '',
  description: ''
}
export default {
  name: 'RoleList',
  components: { Pagination },
  data() {
    return {
      searchForm: {
        page_size: 20,
        page: 1,
        name: '',
        description: ''
      },
      list: null,
      listLoading: false,
      total: 0
    }
  },
  watch: {
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      apiAuthorizeList(this.searchForm).then(response => {
        const data = response.data
        this.list = data.rows
        this.total = data.totalCount
        this.listLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    searchData() {
      this.getList()
    },
    openDialog() {
      this.$router.push({
        name: 'RoleAdd'
      })
    }
  }
}
</script>

