<template>
  <div id="create">
    <div style="width: 1200px;margin: 0 auto;">

      <div v-if="$store.getters.getSonglists.length > 0">

        <div style="display: flex;justify-content: space-between;">
          <el-button icon="el-icon-plus" style="background-color: #FFFFFF;color: #000000;margin-bottom: 20px;" @click="songlistBoxVisible = true">新建歌单</el-button>
          <el-button-group>
            <el-button icon="el-icon-menu" style="background-color: #FFFFFF;color: #000000;font-size: 20px;padding: 8px;"
              @click="type = 'item'"></el-button>
            <el-button icon="el-icon-s-fold" style="background-color: #FFFFFF;color: #000000;font-size: 20px;padding: 8px;"
              @click="type = 'list'"></el-button>
          </el-button-group>
        </div>
        <div v-if="type == 'list'">
          <el-table :data="songlists" stripe>
            <el-table-column label="歌单">
              <template v-slot="scope">
                <div class="z-row">
                  <div class="z-songlistname" style="display: flex;align-items: center;" @click="openSonglist(scope.row.type_user_id)">
                    <img v-if="scope.row.type_name == '我喜欢'" style="width: 50px;margin-right: 20px;" src="../../assets/songlist/cover_love.jpg"
                      alt="">
                    <img v-else style="width: 50px;margin-right: 20px;" src="../../assets/songlist/cover_qzone.png" alt="">
                    <p>{{scope.row.type_name}}</p>
                  </div>
                  <div class="z-op">
                    <el-tooltip effect="dark" content="播放" placement="top">
                      <div class="z-opIcon" @click="playRedict(scope.row.type_user_id)"><i class="el-icon-caret-right"
                          style="font-size: 24px;"></i></div>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="添加到歌单" placement="top">
                      <div class="z-opIcon"><i class="el-icon-plus"></i></div>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="music_num" label="曲目数" width="300"></el-table-column>
            <el-table-column prop="count" label="收听" width="100">
              <template v-slot="scope">
                <p>0</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else style="display: flex;flex-wrap: wrap;margin-left: -10px;margin-right: -10px;">
          <div style="width: 20%;padding: 10px;box-sizing: border-box;" v-for="(songlist,index) in $store.getters.getSonglists"
            :key="index">
            <div class="z-playBox" @click="openSonglist(songlist.type_user_id)">
              <img v-if="songlist.type_name == '我喜欢'" style="width: 100%;" src="../../assets/songlist/cover_love.jpg"
                alt="">
              <img v-else style="width: 100%;" src="../../assets/songlist/cover_qzone.png" alt="">
              <div class="z-play">
                <i class="el-icon-video-play" style="font-size: 48px;" @click.stop="$router.push({name:'player'})"></i>
                <el-popconfirm v-if="songlist.type_name != '我喜欢'" :title="'确定删除 '+songlist.type_name+' 吗？'" @confirm="deleteSonglist(songlist)">
                  <i @click.stop class="el-icon-delete" style="font-size: 48px;margin-left: 20px;" slot="reference"></i>
                </el-popconfirm>
              </div>
            </div>
            <p>{{songlist.type_name}}</p>
          </div>
        </div>
        <!-- <el-pagination style="text-align: center;margin-top: 50px;" layout="prev, pager, next" :total="$store.getters.getSonglists.length"
          @current-change="changePage">
        </el-pagination> -->
      </div>
      <div v-else style="display: flex;">
        <p>您还没有歌单，</p>
        <el-link type="success" style="font-size: 16px;" @click="songlistBoxVisible = true">点击创建</el-link>
      </div>

      <el-dialog title="创建新歌单" :visible.sync="songlistBoxVisible" width="600px" center>
        <div style="display: flex;align-items: center;">
          <p style="width: 80px;">歌单名</p>
          <el-input v-model="songlistName" placeholder="">
            <div slot="suffix" style="display: flex;align-items: center;">
              <p style="margin-right: 10px;">{{20 - songlistName.length}}</p>
              <i class="el-icon-edit el-input__icon"></i>
            </div>
          </el-input>
        </div>
        <div style="display: flex;justify-content: flex-end;margin-top: 30px;">
          <el-button @click="songlistBoxVisible = false">取消</el-button>
          <el-button type="success" @click="addComplete">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        type: 'list',
        songlistBoxVisible: false,
        songlistName: '',
        songlists: [],
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
      addComplete() {
        if (this.songlistName) {
          let obj = {
            token: this.$store.getters.getUser.token,
            type_name: this.songlistName
          }

          this.openLoading()
          this.$axios.post('http://forumapi.com/api/addTypeUserSort', obj).then(res => {
            if (res.data.code == 2000) {
              this.$store.commit('addSonglist', {
                type_name: this.songlistName,
                img: require("@/assets/songlist/cover_qzone.png"),
                music_num: 0,
                count: 0
              })

              this.songlistName = ''
              this.songlistBoxVisible = false

              if (this.$store.getters.isLogin) {
                let token = this.$store.getters.getUser.token
                this.$axios.post('http://forumapi.com/api/typeUserList', {
                  token: token
                }).then(res => {
                  if (res.data.code == 2000) {
                    this.$store.commit('setSonglists', res.data.data)
                  } else if (res.data.code == 3002) {
                    this.$message({
                      message: '您的登录已过期，请重新登录',
                      type: 'warning'
                    });
                    this.$store.commit('setLogin', false)
                  } else {
                    this.$message({
                      message: res.data.msg,
                      type: 'warning'
                    });
                  }

                  this.closeLoading()
                })
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
        } else {
          this.$message({
            message: '请输入歌单名',
            type: 'info'
          });
        }
      },
      deleteSonglist(songlist) {
        let obj = {
          token: this.$store.getters.getUser.token,
          id: songlist.type_user_id
        }
        this.openLoading()
        this.$axios.post('http://forumapi.com/api/typeUserDelete', obj).then(res => {
          if (res.data.code == 2000) {
            this.$store.commit('deleteSonglist', songlist)
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
          this.closeLoading()
        })
      },
      openSonglist(id) {
        this.$store.commit('setCurrentSonglistId', id)
        this.$store.commit('setCurrentSonglistFlag', 2)
        this.$router.push({name: 'songlist'})
      },
      playRedict(id) {
        this.$store.commit('setCurrentSonglistId', id)
        this.$store.commit('setCurrentSonglistFlag', 2)

        this.openLoading()
        let obj = {
          token: this.$store.getters.getUser.token
        }
        this.$axios.post('http://forumapi.com/api/musicUserList', obj).then(res => {
          console.log(res)
          let tempSongs = []
          res.data.data.forEach(e => {
            tempSongs.push({
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

          tempSongs = tempSongs.filter(e => e.type_user_id == this.$store.getters.getCurrentSonglistId)

          this.$store.commit('setPlayLists', tempSongs)
          this.$router.push({
            name: 'player'
          })

          this.closeLoading()
        })
      }
    },
    watch: {
      songlistName(val1, val2) {
        if (val1.length > 20) this.songlistName = val2
      }
    },
    mounted() {
      this.songlists = this.$store.getters.getSonglists
      let obj = {
        token: this.$store.getters.getUser.token
      }
      this.$axios.post('http://forumapi.com/api/musicUserList', obj).then(res => {
        this.songlists.forEach(e => {

          let music_num = res.data.data.filter(ee => ee.type_user_id == e.type_user_id).length


          this.$set(e, 'music_num', music_num)
        })

      })
    }
  }
</script>

<style>
  #create {
    padding: 60px 0;
  }

  #create .el-table td,
  #create .el-table th.is-leaf {
    border-bottom: none;
  }

  #create .el-table::before {
    height: 0;
  }

  #create .z-row {
    display: flex;
    justify-content: space-between;
  }

  #create .z-songlistname {
    cursor: pointer;
  }

  #create .z-songlistname:hover {
    color: #31C27C;
  }

  #create .z-op {
    display: flex;
    opacity: 0;
  }

  #create .z-row:hover .z-op {
    opacity: 1;
  }

  #create .z-opIcon {
    width: 40px;
    height: 40px;
    border: 1px solid black;
    border-radius: 50%;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  #create .z-playBox {
    position: relative;
    cursor: pointer;
    overflow: hidden;
    margin-bottom: 10px;
  }

  #create .z-playBox:hover .z-play {
    opacity: 1;
  }

  #create .z-playBox:hover img {
    transform: scale(1.2);
  }

  #create .z-playBox img {
    transition: all .3s ease-in-out;
  }

  #create .z-play {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .1);
    opacity: 0;
    transition: all .3s ease-in-out;
  }
</style>
