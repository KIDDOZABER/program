<template>
  <div id="search">
    <div class="z-search-header">
      <el-input v-model="searchText" class="z-searchbox" placeholder="搜索音乐/MV/歌单/用户" @keyup.enter.native="changePage(1)">
        <i slot="suffix" class="el-input__icon el-icon-search z-searchIcon" @click="changePage(1)"></i>
      </el-input>
    </div>
    <div class="z-search-content">
      <div style="width: 1200px;margin: 0 auto;">
        <el-button icon="el-icon-video-play" style="margin-bottom: 20px;" @click="playAll">播放全部</el-button>
        <el-dropdown placement="top" trigger="click" @command="addAllToSonglist">
          <span class="el-dropdown-link">
            <el-button icon="el-icon-plus">添加到</el-button>
          </span>
          <el-dropdown-menu slot="dropdown" v-if="$store.getters.isLogin">
            <el-dropdown-item v-for="songlist in $store.getters.getSonglists" :key="songlist.type_name">{{songlist.type_name}}</el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu v-else>
            <el-dropdown-item @click.native="openLoginBox">登录后添加到歌单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button icon="el-icon-edit-outline" @click="editAll">{{editVisible?'取消':''}}批量操作</el-button> -->
        <z-list ref="list"></z-list>
        <z-page ref="page"></z-page>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchText: '',
        songs: [],
        selectedSongs: [],
        editVisible: false,
        loading: null,
        loadingTimeout: null
      }
    },
    methods: {
      openLoading() {
        this.loading = this.$loading({
          lock: true,
          text: '休息一下',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        });
        // this.loadingTimeout = setTimeout(() => {
        //   this.$router.push({
        //     name: 'blank',
        //     params: {
        //       targetName: 'search'
        //     }
        //   })
        // },2000)
      },
      closeLoading() {
        // clearTimeout(this.loadingTimeout)
        this.loading.close()
      },
      addAllToSonglist() {
        this.$message('暂无法添加所有歌曲，请尝试添加一首')
      },
      editAll() {
        if (this.editVisible) {
          this.editVisible = false
          this.songs.forEach(e => this.$refs.songs.toggleRowSelection(e, false))
        } else {
          this.editVisible = true
          this.songs.forEach(e => this.$refs.songs.toggleRowSelection(e, true))
        }
      },
      changePage(page) { //初始化和翻页共用
        this.$parent.setSearchText()
        this.openLoading()
        let keywords = this.$store.getters.getSearchText
        let limit = this.$refs.page.$data.limit
        let offset = (page - 1) * limit
        this._axios({
          url: `/cloudsearch?keywords=${keywords}&limit=${limit}&offset=${offset}`
        }).then(res => {
          console.log(res.data)
          this.$store.commit('setSearchResult', res.data.result)

          let result = this.$store.getters.getSearchResult
          let songCount = result.songCount
          let songs = result.songs
          let tempSongs = []

          if (result && songs) {
            songs.forEach(e => {
              tempSongs.push({
                id: e.id,
                name: e.name,
                author: e.ar[0].name,
                alia: e.al.name,
                time: e.dt,
                picUrl: e.al.picUrl
              })
            })

            this.$refs.list.initData(tempSongs)
            this.$refs.page.initData({
              currentPage: page,
              total: songCount
            })

            // this.selectedSongs = this.songs
          }

          this.closeLoading()
        })
      },
      playAll() {
        let playLists = JSON.parse(JSON.stringify(this.$refs.list.$data.selectSongs))
        this.$store.commit('setPlayLists', playLists)
        this.$router.push({
          name: 'player'
        })
      },
      openLoginBox() {
        this.$parent.openLoginBox()
      },
    },
    watch: {
      searchText(val) {
        this.$store.commit('setSearchText', val)
      }
    },
    mounted() {
      this.searchText = this.$store.getters.getSearchText ? this.$store.getters.getSearchText : '光'
      // this.$parent.searchKeyWords(this.searchText)
      this.changePage(1)
    }
  }
</script>

<style>
  #search .z-search-header {
    padding: 100px 0;
    background-image: url(../assets/bg/bg_search.jpg);
    background-position: center top;
    display: flex;
    justify-content: center;
  }

  #search .z-searchbox {
    width: 790px;
  }

  #search .z-searchbox .el-input__inner {
    height: 50px;
  }

  #search .z-searchIcon {
    cursor: pointer;
  }

  #search .z-search-content {
    padding: 60px 0;
  }

  #search .el-table td,
  #search .el-table th.is-leaf {
    border-bottom: none;
  }

  #search .el-table::before {
    height: 0;
  }

  #search .el-table th>.cell {
    padding-left: 14px;
    padding-right: 14px;
  }

  #search .z-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #search .z-op {
    display: flex;
  }

  #search .el-table__row:hover .z-opIcon {
    opacity: 1;
  }

  #search .z-opIcon {
    width: 35px;
    height: 35px;
    border: 1px solid #000000;
    border-radius: 50%;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    opacity: 0;
    z-index: 99;
  }
</style>
