<template>
  <div id="z-zone-header">
    <el-menu class="z-zone-header" router :default-active="headerIndex" mode="horizontal" @select="switchPage">
      <el-menu-item index="home">首页</el-menu-item>
      <el-menu-item index="2" disabled>歌手</el-menu-item>
      <el-menu-item index="3" disabled>新碟</el-menu-item>
      <el-menu-item index="4" disabled>排行榜</el-menu-item>
      <el-menu-item index="playlist">分类歌单</el-menu-item>
      <el-menu-item index="6" disabled>电台</el-menu-item>
      <el-menu-item index="7" disabled>MV</el-menu-item>
      <el-menu-item index="8" disabled>数字专辑</el-menu-item>
      <el-menu-item index="9" disabled>票务</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        headerIndex: 'home'
      }
    },
    methods: {
      switchPage(val) {
        this.$parent.switchPage(val)
      },
    }
  }
</script>

<style>
  #z-zone-header .el-menu.el-menu--horizontal {
    display: flex;
    justify-content: center;
    border: none;
  }
  
  #z-zone-header .el-menu--horizontal>.el-menu-item {
    color: #000000;
    font-size: 15px;
  }

  #z-zone-header .el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
  #z-zone-header .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
    color: #31c27c;
  }

  #z-zone-header .el-menu-item.is-active {
      color: #31c27c;
  }

  #z-zone-header .el-menu--horizontal>.el-menu-item.is-active {
      border-bottom: 2px solid #31c27c;
      color: #31c27c;
  }
</style>
