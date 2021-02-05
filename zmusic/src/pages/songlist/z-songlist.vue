<template>
  <div id="songlist">
    <div style="width: 1200px;margin: 0 auto;">
      <div style="display: flex;">
        <div style="width: 250px;min-width: 250px;">
          <img v-if="songlist.coverImgUrl" style="width: 100%;" :src="songlist.coverImgUrl" :alt="songlist.name">
          <img v-else-if="songlist.name != '我喜欢'" style="width: 100%;" src="../../assets/songlist/cover_qzone.png" :alt="songlist.name">
          <img v-else style="width: 100%;" src="../../assets/songlist/cover_love.jpg" :alt="songlist.name">
        </div>
        <div style="padding: 20px 60px;display: flex;flex-direction: column;justify-content: space-between;">
          <div>
            <h1 style="margin-bottom: 10px;">{{songlist.name}}</h1>
            <p style="margin-bottom: 10px;">
              <i class="el-icon-user"></i>
              {{songlist.userName ? songlist.userName : '未知'}}
            </p>
            <p v-if="songlist.createTime"><i class="iconfont icon-icon_time" style="margin-right: 5px;"></i>{{songlist.createTime | timestampToTime}}</p>
            <p v-else><i class="iconfont icon-icon_time" style="margin-right: 5px;"></i></p>
          </div>
          <div>
            <el-button type="success" icon="el-icon-caret-right" @click="playAll">播放全部</el-button>
            <!-- <el-button icon="el-icon-edit-outline" @click="editAll">批量操作</el-button> -->
          </div>
        </div>
      </div>
      <div style="display: flex;margin-top: 50px;">
        <div style="flex-grow: 1;overflow: hidden;">
          <el-table :data="songs.slice((currentPage-1)*limit,currentPage*limit)" ref="songs" @selection-change="selectRow"
            stripe>
            <el-table-column type="selection" v-if="editVisible" width="50"></el-table-column>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="name" label="歌曲" width="400">
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
                        <el-dropdown-item v-for="songlist in $store.getters.getSonglists" :key="songlist.type_name"
                          :command="{type_user_id:songlist.type_user_id,music:scope.row}">{{songlist.type_name}}</el-dropdown-item>
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
            <el-table-column prop="alia" label="专辑">
              <template v-slot="scope">
                {{scope.row.alia ? scope.row.alia : '未知'}}
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时长" width="100">
              <template v-slot="scope">
                {{(scope.row.time/1000)|formatSeconds}}
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px;display: flex;align-items: center;" v-if="editVisible">
            <el-checkbox style="margin: 0 14px;" v-model="checked"></el-checkbox>
            <div style="margin-left: 65px;">
              <el-button icon="el-icon-caret-right">播放全部</el-button>
              <el-button icon="el-icon-circle-plus-outline" @click="addTo">添加到</el-button>
              <el-button icon="el-icon-delete" @click="deleteSongs">删除</el-button>
              <el-button icon="el-icon-edit-outline" @click="editVisible = false">取消批量操作</el-button>
            </div>
          </div>
          <el-pagination style="text-align: center;margin-top: 50px;" layout="prev, pager, next" :current-page.sync="currentPage"
            :page-size="limit" :total="songs.length" @current-change="changePage">
          </el-pagination>
        </div>
        <div style="margin-left: 50px;width: 300px;">
          <div style="margin-bottom: 50px;">
            <h2>简介</h2>
            <p style="font-size: 14px;margin-top: 10px;">{{songlist.description ? songlist.description : '嘿siri 请帮我删除他的联系方式 我不想等了 就当风没吹过 你没来过 我没爱过 从此以后 山高海阔 青山路远 你是你 我是我 祝你 历遍山河 依然觉得人生值得 敬我 往后余生 水源山长安适如常 封面：黑川智花'}}</p>
          </div>
          <div>
            <h2>TA的其他歌单</h2>
            <div style="margin-top: 10px;">
              <div v-if="songlists.length > 0" style="display: flex;flex-wrap: wrap;margin-left: -10px;margin-right: -10px;">
                <div class="z-songlist" style="width: 25%;padding: 10px;box-sizing: border-box;"
                  v-for="(songlist,index) in songlists.filter(e=>e.name!=songlist.name).slice(0,8)" :key="index" @click="openSonglist(songlist)">
                  <img style="width: 100%;" :src="songlist.coverImgUrl" :title="songlist.name">
                  <p style="margin-top: 10px;width: 100%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{songlist.name}}</p>
                </div>
              </div>
              <div v-else>
                <p>ta没有更多歌单了...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        songlist: {},
        songs: [],
        selectedSongs: [],
        songlists: [],
        editVisible: false,
        checked: true,
        limit: 10,
        total: 0,
        currentPage: 1,
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
      changePage(val) {
        this.currentPage = val
      },
      editAll() {
        this.editVisible = true
        this.songs.forEach(e => this.$refs.songs.toggleRowSelection(e, true))
      },
      selectRow(val) {
        this.selectedSongs = val
      },
      addTo() {

      },
      deleteSongs() {
        this.selectedSongs.forEach(e => {
          this.songs = this.songs.filter(ee => ee != e)
        })
      },
      openSonglist(songlist) {
        // this.$store.commit('setCurrentSonglist', songlist)
        this.$store.commit('setCurrentSonglistId', songlist.id)
        // this.$router.push({
        //   name: 'blank',
        //   params: {
        //     targetName: 'songlist'
        //   }
        // })
        this.getAllInfo()
      },
      playAll() {
        console.log(this.selectedSongs)
        this.$store.commit('setPlayLists', this.selectedSongs)
        this.$router.push({
          name: 'player'
        })
      },
      playOne(song) {
        console.log(song)
        let onesong = []
        onesong.push(song)
        this.$store.commit('setPlayLists', onesong)
        // this.$store.commit('setCurrentSonglistFlag', 1)
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
          music_url: val.music.url,
          music_time: val.music.time.toString(),
          album: val.music.alia,
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
      openLoginBox() {
        this.$parent.openLoginBox()
      },
      getSongDetail(ids) {
        this._axios({
          url: `/song/detail?ids=${ids.substr(0,ids.length - 1)}`,
        }).then(res => {
          this.songs = []
          res.data.songs.forEach(e => {
            this.songs.push({
              id: e.id,
              name: e.name,
              author: e.ar[0].name,
              alia: e.alia[0],
              time: e.dt,
              picUrl: e.al.picUrl,
            })
          })
          console.log(this.songs)
          this.selectedSongs = this.songs

          this.closeLoading()
        })
      },
      getAllInfo() {
        this.openLoading()
        if (this.$store.getters.getCurrentSonglistFlag == 1) {
          this._axios({
            url: `/playlist/detail?id=${this.$store.getters.getCurrentSonglistId}`,
          }).then(res => {
            this.songlist = res.data.playlist
            let ids = ''
            this.songlist.trackIds.forEach(e => {
              ids += `${e.id},`
            })
            this.getSongDetail(ids)

            this._axios({
              url: `/user/detail?uid=${this.songlist.userId}`
            }).then(res => {
              this.$set(this.songlist, 'userName', res.data.profile.nickname)
            })

            this._axios({
              url: `/user/playlist?uid=${this.songlist.userId}`
            }).then(res => {
              this.songlists = res.data.playlist
            })
          })
        } else {
          console.log(123)
          console.log(this.$store.getters.getCurrentSonglistId)
          this.$set(this.songlist, 'userName', this.$store.getters.getUser.username)
          this.$store.getters.getSonglists.forEach(e => {
            if (e.type_user_id == this.$store.getters.getCurrentSonglistId) {
              this.$set(this.songlist, 'name', e.type_name)
              this.$set(this.songlist, 'createTime', e.created_at * 1000)
            }
          })
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
                id: JSON.parse(e.remark).id
              })
            })

            this.songs = this.songs.filter(e => e.type_user_id == this.$store.getters.getCurrentSonglistId)

            this.selectedSongs = this.songs

            this.closeLoading()
          })
        }
      }
    },
    mounted() {
      this.getAllInfo()
    }
  }
</script>

<style>
  #songlist {
    background-color: #FAFAFA;
    padding: 60px 0;
  }

  #songlist .el-table th>.cell {
    padding-left: 14px;
    padding-right: 14px;
  }

  #songlist .z-songlist {
    cursor: pointer;
  }

  #songlist .z-songlist:hover {
    color: #31C27C;
  }

  #songlist .icon-icon_time::before {
    content: "\e604";
    font-size: 16px;
  }

  #songlist .z-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #songlist .z-op {
    display: flex;
  }

  #songlist .el-table__row:hover .z-opIcon {
    opacity: 1;
  }

  #songlist .z-opIcon {
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
