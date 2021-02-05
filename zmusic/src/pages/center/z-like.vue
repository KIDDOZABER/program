<template>
  <div id="like">
    <div style="width: 1200px;margin: 0 auto;">
      <div v-if="$store.getters.isLogin">
        <el-button icon="el-icon-video-play" style="background-color: #31C27C;color: #FFFFFF;margin-bottom: 20px;"
          @click="playAll">播放全部</el-button>
        <el-dropdown placement="top" trigger="click" @command="addToSonglist">
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
        <el-table :data="songs" stripe ref="songs" @selection-change="selectRow">
          <el-table-column type="selection" v-if="editVisible" width="50"></el-table-column>
          <el-table-column label="歌曲">
            <template v-slot="scope">
              <div class="z-row">
                <p>{{scope.row.name}}</p>
                <div class="z-op">
                  <el-tooltip effect="dark" content="播放" placement="top">
                    <div class="z-opIcon" @click="playOne(scope.row)"><i class="el-icon-caret-right" style="font-size: 24px;"></i></div>
                  </el-tooltip>
                  <el-dropdown placement="top" trigger="click" @command="addOneToSonglist">
                    <span class="el-dropdown-link">
                      <el-tooltip effect="dark" content="添加到歌单" placement="top">
                        <div class="z-opIcon"><i class="el-icon-plus"></i></div>
                      </el-tooltip>
                    </span>
                    <el-dropdown-menu slot="dropdown" v-if="$store.getters.isLogin">
                      <el-dropdown-item v-for="songlist in $store.getters.getSonglists" :key="songlist.type_name" :command="{type_user_id:songlist.type_user_id,music:scope.row}">{{songlist.type_name}}</el-dropdown-item>
                    </el-dropdown-menu>
                    <el-dropdown-menu v-else>
                      <el-dropdown-item @click.native="openLoginBox">登录后添加到歌单</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="author" label="歌手" width="200"></el-table-column>
          <el-table-column prop="alia" label="专辑" width="300"></el-table-column>
          <el-table-column label="时长" width="100">
            <template v-slot="scope">
              <div class="z-row">
                <p class="z-time">{{scope.row.time / 1000 | formatSeconds}}</p>
                <div class="z-op">
                  <el-tooltip effect="dark" content="删除" placement="top">
                    <div class="z-opIcon" @click="clickDeleteOne(scope.row)"><i class="el-icon-delete" style="font-size: 24px;"></i></div>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="text-align: center;margin-top: 50px;" layout="prev, pager, next" :total="songs.length"
          @current-change="changePage">
        </el-pagination>
      </div>
      <div v-else>
        <p>请先登录</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        songs: [],
        selectedSongs: [],
        editVisible: false,
        loading: null
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
      },
      closeLoading() {
        this.loading.close()
      },
      changePage() {

      },
      playAll() {
        this.$store.commit('setPlayLists', this.selectedSongs)
        this.$store.commit('setCurrentSonglistFlag', 2)
        this.$router.push({
          name: 'player'
        })
      },
      addToSonglist(val) {
        this.$message('暂无法添加所有歌曲，请尝试添加一首')
      },
      openLoginBox() {
        this.$parent.openLoginBox()
      },
      selectRow(val) {
        this.selectedSongs = val
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
      playOne(song) {
        let onesong = []
        onesong.push(song)
        this.$store.commit('setPlayLists', onesong)
        console.log(song)
        this.$store.commit('setCurrentSonglistFlag', 2)
        this.$router.push({
          name: 'player'
        })
      },
      addOneToSonglist(val) {
        console.log(val)
        let obj = {
          token: this.$store.getters.getUser.token,
          type_user_id: val.type_user_id,
          music_name: val.music.name,
          music_auth: val.music.author,
          music_path: val.music.picUrl,
          album: val.music.alia,
          music_time: val.music.time.toString(),
          remark: JSON.stringify({
            id: val.music.id
          })
        }
        this.$axios.post('http://forumapi.com/api/addMusicUser', obj).then(res => {
          console.log(res)
          if (res.data.code == 2000) {
            this.$message('已成功添加到歌单');
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      },
      clickDeleteOne(val) {
        this.openLoading()
        console.log(val)
        let obj = {
          token: this.$store.getters.getUser.token,
          id: val.music_user_id
        }
        this.$axios.post('http://forumapi.com/api/musicUserDelete', obj).then(res => {
          console.log(res)
          if (res.data.code == 2000) {
            this.songs = this.songs.filter(e => e != val)

            this.closeLoading()

            this.$message({
              message: '删除成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      }
    },
    mounted() {
      this.openLoading()

      let obj = {
        token: this.$store.getters.getUser.token
      }

      this.$axios.post('http://forumapi.com/api/musicUserList', obj).then(res => {
        console.log(res)
        res.data.data.forEach(e => {
          this.songs.push({
            name: e.music_name,
            author: e.music_auth,
            alia: e.album,
            time: e.music_time,
            url: e.music_url,
            picUrl: e.music_path,
            type_user_id: e.type_user_id,
            music_user_id: e.music_user_id,
            id: JSON.parse(e.remark).id
          })
        })

        this.closeLoading()

        // this.songs = this.songs.filter(e => e.type_user_id == this.$store.getters.getCurrentSonglistId)

        this.selectedSongs = this.songs
      })

      // this._axios({
      //   url: '/top/playlist?limit=10&order=new'
      // }).then(res => {
      //   console.log(res)
      // })
    }
  }
</script>

<style>
  #like {
    padding: 60px 0;
  }

  #like .el-table td,
  #like .el-table th.is-leaf {
    border-bottom: none;
  }

  #like .el-table::before {
    height: 0;
  }

  #like .el-table th>.cell {
    padding-left: 14px;
    padding-right: 14px;
  }

  #like .z-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #like .z-op {
    display: flex;
  }

  #like .el-table__row:hover .z-opIcon {
    opacity: 1;
  }

  #like .z-opIcon {
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

  #like .z-time {
    position: absolute;
  }

  #like .el-table__row:hover .z-time {
    opacity: 0;
  }


</style>
