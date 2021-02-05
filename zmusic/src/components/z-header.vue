<template>
  <div id="header">
    <div class="z-top-header">
      <div style="height: 90px;padding: 20px 0;box-sizing: border-box;">
        <img style="height: 100%;" src="../assets/logo.png" alt="" />
      </div>
      <el-menu :default-active="headerIndex" mode="horizontal" @select="switchPage">
        <el-menu-item index="zone">音乐馆</el-menu-item>
        <el-menu-item index="profile">我的音乐</el-menu-item>
        <el-menu-item index="3" disabled>客户端</el-menu-item>
        <el-menu-item index="4" disabled>开放平台</el-menu-item>
        <el-menu-item index="5" disabled>VIP</el-menu-item>
      </el-menu>
      <div class="z-search">
        <el-input v-model="searchText" placeholder="搜索音乐/MV/歌单/用户" @keyup.enter.native="search">
          <i slot="suffix" class="el-input__icon el-icon-search z-searchIcon" @click="search"></i>
        </el-input>
      </div>
      <div class="z-avatar">
        <el-dropdown v-if="$store.getters.isLogin" placement="top">
          <span class="el-dropdown-link">
            <el-avatar class="z-login" :size="40" :src="$store.getters.getUser.imgUrl" @error="error">
              <img src="../assets/music/img1.jpg" />
            </el-avatar>
          </span>
          <el-dropdown-menu slot="dropdown">
            <div class="z-userInfo">
              <el-avatar :size="40" :src="$store.getters.getUser.imgUrl" @error="error">
                <img src="../assets/music/img1.jpg" />
              </el-avatar>
              <p style="margin-left: 10px;">{{$store.getters.getUser.username}}</p>
            </div>
            <el-dropdown-item icon="el-icon-user-solid" @click.native="gotoProfile">个人中心</el-dropdown-item>
            <el-dropdown-item icon="el-icon-remove" @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <p v-else class="z-login" @click="openLoginBox">登录</p>
      </div>

    </div>
  </div>
</template>

<script>
  import search from '@/pages/center/z-create'
  export default {
    components: {
      'search': search
    },
    data() {
      return {
        headerIndex: 'zone',
        searchText: '',
      };
    },
    methods: {
      error() {
        this.$message.error('头像加载失败');
        return true
      },
      switchPage(val) {
        this.$parent.switchPage('/entry/' + val)
      },
      openLoginBox() {
        this.$parent.openLoginBox()
      },
      gotoProfile() {
        this.headerIndex = 'profile'
        this.$router.push({
          name: 'profile'
        })
      },
      search() {
        this.headerIndex = ''
        // console.log(this.headerIndex)
        this.$store.commit('setSearchText', this.searchText)
        if (this.searchText == '') this.$store.commit('setSearchText', '光')
        console.log(this.$store.getters.getSearchText)

        this.$parent.setSearchText()

        this.$router.push({
          name: 'search'
        })

        this.$parent.search()
      },
      logout() {
        this.$store.commit('setLogin', false)
        this.$store.commit('setUsername', '')
        this.$store.commit('setImgUrl', '')
        // this.$router.go(0);
      }
    },
    watch: {
      searchText(val) {
        this.$store.commit('setSearchText', val)
      }
    },
    mounted() {
      this.searchText = this.$store.getters.getSearchText
      // document.getElementsByClassName('z-search')[0].removeAttribute('tabindex')
      // document.getElementsByClassName('z-avatar')[0].removeAttribute('tabindex')
    }
  }
</script>

<style>
  #header .z-top-header {
    display: flex;
    justify-content: space-between;
    width: 1200px;
    margin: 0 auto;
    border-bottom: solid 1px #e6e6e6;
  }

  #header .el-menu.el-menu--horizontal {
    border-bottom: none;
  }

  #header .el-menu--horizontal>.el-menu-item {
    height: 90px;
    line-height: 90px;
    color: #000000;
    font-size: 18px;
  }

  #header .z-top-header .el-menu-item.is-active {
    background-color: #31c27c;
    border-bottom: none;
    color: #FFFFFF;
  }

  #header .z-search {
    display: flex;
    align-items: center;
    margin-left: 50px;
  }

  #header .z-searchIcon {
    cursor: pointer;
  }

  #header .z-searchIcon:hover {
    color: #31c27c;
  }

  #header .z-avatar {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }

  .z-userInfo {
    display: flex;
    align-items: center;
    padding: 10px 20px 20px;
  }

  .el-dropdown-menu__item {
    text-align: center;
  }

  #header .z-login:hover {
    color: #31c27c;
    cursor: pointer;
  }

  #header .z-content {
    min-height: 100%;
  }


  #header .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    color: #31c27c;
  }
</style>
