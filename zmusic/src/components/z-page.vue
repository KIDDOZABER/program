<template>
  <el-pagination style="text-align: center;margin-top: 50px;" layout="prev, pager, next" :current-page.sync="currentPage" :page-size="limit" :total="total"
    @current-change="changePage">
  </el-pagination>
</template>

<script>
  export default {
    data() {
      return {
        currentPage: 1,
        limit: 10,
        total: 0
      }
    },
    methods: {
      initData(data) {
        this.currentPage = data.currentPage
        this.total = data.total
      },
      changePage(page) {
        this.$parent.changePage(page)
      }
    }
  }
</script>

<style>
</style>
