<template>
  <div id="player">
    <div class="z-bg">
      <img class="z-b" :src="songs[index] ? songs[index].picUrl : ''" alt="">
    </div>
    <div class="z-shadow" v-if="songs[index]"></div>
    <div class="z-shadow-bx" v-else></div>
    <div class="z-playerheader">
      <router-link :to="{name:'home'}">
        <img style="height: 40px;" src="../assets/logo.png" alt="">
      </router-link>
      <div style="display: flex;align-items: center;">
        <router-link v-if="$store.getters.isLogin" style="display: flex;align-items: center;text-decoration: none;" :to="{name:'profile'}">
          <el-avatar :size="40" :src="$store.getters.getUser.imgUrl" @error="error">
            <img src="../assets/music/img1.jpg"/>
          </el-avatar>
          <p class="z-top-header-item">{{$store.getters.getUser.username}}</p>
        </router-link>
        <p v-else class="z-top-header-item" @click="openLoginBox">登录</p>
        <!-- <p class="z-top-header-item">设置</p> -->
        <p v-if="$store.getters.isLogin" class="z-top-header-item z-exit" @click="logout">退出</p>
      </div>
    </div>
    <div class="z-playcontent">
      <div>
        <el-button icon="el-icon-star-off" class="z-player-btn" @click="clickCollectSome">收藏</el-button>
        <el-dropdown placement="top" trigger="click" @command="addToSonglist">
          <span class="el-dropdown-link">
            <el-button icon="el-icon-circle-plus-outline" class="z-player-btn">添加到</el-button>
          </span>
          <el-dropdown-menu slot="dropdown" v-if="$store.getters.isLogin">
            <el-dropdown-item v-for="songlist in $store.getters.getSonglists" :key="songlist.type_name" :command="{type_user_id:songlist.type_user_id}">{{songlist.type_name}}</el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu v-else>
            <el-dropdown-item @click.native="loginBoxVisible = true">登录后添加到歌单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button icon="el-icon-delete" class="z-player-btn" @click="clickDeleteSome">删除</el-button>
      </div>
      <div style="display: flex;">
        <el-table :data="songs" ref="songs" :height="500" @selection-change="selectRow" style="background: transparent;margin-top: 50px;color: #e1e1e1;min-width: 670px;">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column type="index" width="50">
            <template v-slot="scope">
              <img v-if="songs.indexOf(scope.row) == index && playFlag" src="../assets/wave.gif" alt="">
              <p v-else>{{songs.indexOf(scope.row) + 1}}</p>
            </template>
          </el-table-column>
          <el-table-column label="歌曲" width="300">
            <template v-slot="scope">
              <div class="z-row">
                <p>{{scope.row.name}}</p>
                <div class="z-op">
                  <el-tooltip effect="dark" content="播放" placement="top">
                    <div class="z-opIcon" @click="clickPlayOne(songs.indexOf(scope.row))"><i class="el-icon-caret-right"
                        style="font-size: 24px;"></i></div>
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
                      <el-dropdown-item @click.native="loginBoxVisible = true">登录后添加到歌单</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="author" label="歌手"></el-table-column>
          <el-table-column prop="alia" label="专辑">
            <template v-slot="scope">
              {{scope.row.alia ? scope.row.alia : '未知'}}
            </template>
          </el-table-column>
          <el-table-column label="时长" width="100">
            <template v-slot="scope">
              <div class="z-row">
                <p class="z-time">{{(scope.row.time/1000)|formatSeconds}}</p>
                <div class="z-op">
                  <el-tooltip effect="dark" content="删除" placement="top">
                    <div class="z-opIcon" @click="clickDeleteOne(scope.row)"><i class="el-icon-delete" style="font-size: 24px;"></i></div>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-left: 250px;">
          <div style="width: 200px;height: 200px;position: relative;filter: blur(.5px);margin: 0 auto;">
            <div style="width: 100%;height: 100%;border-radius: 50%;overflow: hidden;background: #FFFFFF;">
              <img style="width: 100%;height: 100%;" :src="songs[index] ? songs[index].picUrl : ''" alt="" ref="cd"
                class="z-rotate">
            </div>
            <div style="width: 100%;height: 100%;position: absolute;top: 0;left: 50px;z-index: -1;filter: blur(20px);">
              <img style="width: 100%;height: 100%;border-radius: 50%;" :src="songs[index] ? songs[index].picUrl : ''"
                alt="">
            </div>
          </div>
          <div style="color: #FFFFFF;text-align: center;margin: 20px 0 50px 0;font-size: 14px;">
            <p>歌曲名：{{songs[index] && songs[index].name ? songs[index].name : '未知'}}</p>
            <p>歌手名：{{songs[index] && songs[index].author ? songs[index].author : '未知'}}</p>
            <p>专辑名：{{songs[index] && songs[index].alia ? songs[index].alia : '未知'}}</p>
          </div>
          <div style="width: 500px;height: 300px;position: relative;overflow: hidden;">
            <div v-if="songs.length">
              <div v-if="lyric.length > 0" style="width: 100%;position: absolute;top: 55px;transition: all .3s ease-in-out;"
                ref="lyricBox">
                <p class="eachLyric" style="text-align: center;color: #FFFFFF;margin-top: 20px;" v-for="(item,index) in lyric" :key="index">
                  <span v-if="item.text==''" style="width: 300px;">&emsp;</span>
                  <span v-else-if="index==lyricIndex" style="width: 300px;color: #31C27C;transform: scale(1.5);display: inline-block;transition: all .3s ease-in-out;">{{item.text}}</span>
                  <span v-else style="width: 300px;transform: scale(.9);display: inline-block;transition: all .3s ease-in-out;">{{item.text}}</span>
                </p>
              </div>
              <div v-else>
                <p style="color: #31C27C;font-size: 14px;text-align: center;margin-top: 50px;">此歌曲为没有填词的纯音乐，请您欣赏</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="position: fixed;bottom: 50px;width: 100%;padding: 0 120px;box-sizing: border-box;">
      <audio style="display: none;" ref="audio" :src="src" controls="controls" @timeupdate="updateTime">
      </audio>
      <div style="display: flex;width: 100%;align-items: center;">
        <div style="width: 120px;display: flex;justify-content: space-between;">
          <i class="iconfont icon-icon_prev" @click="clickPrev"></i>
          <i class="iconfont icon-icon_pause" v-if="playFlag" @click="pause"></i>
          <i class="iconfont icon-icon_play" v-else @click="play"></i>
          <i class="iconfont icon-icon_next" @click="clickNext"></i>
        </div>

        <div style="display: flex;flex-direction: column;width: 70%;margin: 0 50px;">
          <div style="display: flex;justify-content: space-between;color: rgba(255, 255, 255, .5);">
            <p>{{songs.length ? songs[index].name + ' - ' + songs[index].author : '该歌单无音乐'}}</p>
            <p>
              <span v-if="songs.length">{{currentTime|formatSeconds}}</span>
              <span v-else>00 : 00</span> /
              <span v-if="songs.length">{{songTime|formatSeconds}}</span>
              <span v-else>00 : 00</span>
            </p>
          </div>
          <el-slider class="" :min="0" :max="songTime" v-model="currentTime" :show-tooltip="false" @change="currentTimeChange"></el-slider>
        </div>
        <div style="display: flex;align-items: center;width: 300px;justify-content: space-between;">
          <div @click="changeModule">
            <i class="iconfont icon-icon_circu" v-if="module == 1"></i>
            <i class="iconfont icon-icon_order" v-else-if="module == 2"></i>
            <i class="iconfont icon-icon_random" v-else-if="module == 3"></i>
            <i class="iconfont icon-icon_self" v-else></i>
          </div>
          <div @click="addTolikelist">
            <i class="iconfont icon-icon_collect" v-if="like"></i>
            <i class="iconfont icon-icon_uncollect" v-else></i>
          </div>
          <div style="display: flex;width: 200px;align-items: center;">
            <div>
              <i class="iconfont icon-icon_banvoice" v-if="voiceFlag == true" @click="muted"></i>
              <i class="iconfont icon-icon_voice" v-else @click="muted"></i>
            </div>
            <el-slider style="flex-grow: 1;margin-left: 10px;" :min="0.0" :max="1.0" :step="0.01" v-model="currentVoice"
              :show-tooltip="false" @input="currentVoiceChange"></el-slider>
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
        songs: [],
        songsUrls: [],
        lyric: [],
        lyricIndex: 0,
        selectedSongs: [],
        src: '',
        index: 0,
        songTime: 0,
        currentTime: 0,
        currentVoice: 1.0,
        playFlag: false,
        voiceFlag: false,
        module: 1, //1列表循环 2列表顺序 3列表随机 4单曲循环
        like: false,
        tap: false,
        refresh: false, //刚打开页面的标识
        angleNum: 0,
        rotateInterval: null
      }
    },
    methods: {
      error() {
        this.$message.error('头像加载失败');
        return true
      },
      openLoginBox() {
        this.$parent.openLoginBox()
      },
      logout() {
        this.$store.commit('setLogin', false)
        this.$store.commit('setUsername', '')
        // this.$router.go(0);
      },
      selectRow(val) {
        this.selectedSongs = val
      },
      clickCollectSome() {
        if (this.selectedSongs.length > 0) {
          this.$message('试试直接添加单曲到歌单');
        } else {
          this.$message('请选择要收藏的歌曲');
        }
      },
      addToSonglist(val) {
        this.$message('暂无法添加所有歌曲，请尝试添加一首')
      },
      clickDeleteSome() {
        if (this.selectedSongs.length > 0) {
          this.$confirm('确定要删除这' + this.selectedSongs.length + '首歌曲?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            if (this.selectedSongs.some(e => e == this.songs[this.index])) {
              this.pause()
              this.selectedSongs.forEach(e => {
                this.songs = this.songs.filter(ee => ee != e)
              })
              this.index = 0
              this.refresh = true
              this.$nextTick(() => {
                this.tap = !this.tap
              })
            } else {
              let tempSong = this.songs[this.index]
              this.selectedSongs.forEach(e => {
                this.songs = this.songs.filter(ee => ee != e)
              })
              this.songs.forEach((e, i) => {
                if (e == tempSong) this.index = i
              })
            }
          })
        } else {
          this.$message('请选择要删除的歌曲');
        }

      },
      play() {
        // let tempDeg = 72 * this.currentTime
        // this.$refs.cd.style.transform = 'rotate(' + tempDeg +'deg)'
        if (this.songs.length) {
          this.$refs.audio.play()
          this.playFlag = true

          // this.rotateInterval = setInterval(() => {
          //   this.angleNum = this.angleNum + 1
          //   if (this.$refs.cd) {
          //     this.$refs.cd.style.transform = 'rotate(' + this.angleNum * 90 + 'deg)'
          //   }
          // }, 1000)
        } else {
          this.$confirm('当前歌单无音乐，是否打开我的歌单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            this.$router.push({
              name: 'create'
            })
          })
        }


      },
      pause() {
        this.$refs.audio.pause()
        this.playFlag = false

        if(this.rotateInterval) {
          clearInterval(this.rotateInterval)
        }
      },
      muted() {
        if (this.currentVoice != 0) {
          this.$refs.audio.muted = !this.$refs.audio.muted
          this.voiceFlag = this.$refs.audio.muted
        }
      },
      updateTime() {
        if (this.$refs.audio) {
          this.$refs.audio.loop = false
          this.currentTime = this.$refs.audio.currentTime
        }
        // console.log(this.currentTime)
        this.lyric.forEach((e, i) => {
          if (e.time == Math.round(this.currentTime)) {
            this.lyricIndex = i
            // console.log(this.$refs.lyricBox.style.top)

          }
        })
        // let tempDeg = 72 * this.currentTime
        // this.$refs.cd.style.transform = 'rotate(' + tempDeg +'deg)'
        if (this.$refs.audio && this.$refs.audio.ended) {
          if (this.module == 1) {
            this.index = this.index + 1
            if (this.index >= this.songs.length) this.index = 0
            this.refresh = true
            this.$nextTick(() => {
              this.tap = !this.tap
            })
          } else if (this.module == 2) {
            this.index = this.index + 1
            if (this.index < this.songs.length) {
              this.refresh = true
              this.$nextTick(() => {
                this.tap = !this.tap
              })
            } else {
              this.index = this.songs.length - 1
              this.pause()
            }
          } else if (this.module == 3) {
            var tempIndex = Math.floor(Math.random() * this.songs.length)
            while (tempIndex == this.index) {
              tempIndex = Math.floor(Math.random() * this.songs.length)
            }
            this.index = tempIndex
            this.refresh = true
            this.$nextTick(() => {
              this.tap = !this.tap
            })
          } else {
            this.$refs.audio.loop = true
            this.refresh = true
            this.$nextTick(() => {
              this.tap = !this.tap
            })
          }
        }
      },
      currentTimeChange(val) {
        this.$refs.audio.currentTime = val
      },
      currentVoiceChange(val) {
        this.$refs.audio.volume = val
        if (val == 0) {
          this.voiceFlag = true
        } else {
          this.voiceFlag = false
        }
      },
      changeModule() {
        this.module = this.module + 1
        if (this.module > 4) this.module = 1
      },
      addTolikelist() {
        if (this.songs.length > 0) {
          this.like = !this.like
          if (this.like) {
            this.$message('已收藏至我喜欢')
          } else {
            this.$message('已取消收藏')
          }
        } else {
          this.$confirm('当前歌单无音乐，是否打开我的歌单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            this.$router.push({
              name: 'create'
            })
          })
        }
      },
      clickPrev() {
        if (this.songs.length) {
          this.pause()
          this.index = this.index - 1 < 0 ? this.songs.length - 1 : this.index - 1
          this.refresh = true
          this.$nextTick(() => {
            this.tap = !this.tap
          })
        } else {
          this.$confirm('当前歌单无音乐，是否打开我的歌单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            this.$router.push({
              name: 'create'
            })
          })
        }
      },
      clickNext() {
        if (this.songs.length) {
          this.pause()
          this.index = this.index + 1 >= this.songs.length ? 0 : this.index + 1
          this.refresh = true
          this.$nextTick(() => {
            this.tap = !this.tap
          })
        } else {
          this.$confirm('当前歌单无音乐，是否打开我的歌单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            this.$router.push({
              name: 'create'
            })
          })
        }
      },
      clickPlayOne(val) {
        this.pause()
        this.index = val

        this.angleNum = 0
        this.$refs.cd.style.transition = 'none'
        this.$refs.cd.style.transform = 'rotate(0deg)'
        setTimeout(() => {
          this.$refs.cd.style.transition = 'all 1s linear'
        }, 100)

        this.refresh = true
        this.$nextTick(() => {
          this.tap = !this.tap
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
      clickDeleteOne(val) {
        let tempIndex = this.songs.indexOf(val)
        this.songs = this.songs.filter(e => e != val)

        if (tempIndex < this.index) {
          this.index = this.index - 1
        } else if (tempIndex == this.index) {
          this.pause()
          if (tempIndex < this.songs.length) {
            this.index = tempIndex

            this._axios({
              url: `/lyric?id=${this.songs[this.index].id}`
            }).then(res => {

              this.formatLyric(res.data.lrc.lyric)
            })
          } else {
            this.index = 0
          }

          this.angleNum = 0
          this.$refs.cd.style.transition = 'none'
          this.$refs.cd.style.transform = 'rotate(0deg)'
          setTimeout(() => {
            this.$refs.cd.style.transition = 'all 1s linear'
          }, 100)

          if (this.songs.length) {
            this.refresh = true
            this.$nextTick(() => {
              this.tap = !this.tap
            })
          } else { // 删除最后一首
            this.src = ''
            this.$refs.audio.load(); // 每一次动态改变aduio的src后，都要load一次
            this.currentTime = 0
            this.songTime = 0
          }
        }
      },
      async getSongUrl(id) {
        await this._axios({
          url: `/song/url?id=${id.substr(0,id.length - 1)}`,
        }).then(res => {
          this.songsUrls = res.data.data

          if (this.$store.getters.getPlayLists) {
            this.$store.getters.getPlayLists.forEach(e => {
              this.songsUrls.forEach(ee => {
                if (e.id == ee.id) {
                  this.songs.push({
                    id: e.id,
                    url: ee.url,
                    name: e.name,
                    author: e.author,
                    time: e.time,
                    alia: e.alia,
                    picUrl: e.picUrl
                  })
                }
              })
            })
          }

          if (this.songs.length > 0) {
            this._axios({
              url: `/lyric?id=${this.songs[0].id}`
            }).then(res => {
              if (res.data.lrc) {
                this.formatLyric(res.data.lrc.lyric)
              } else {
                this.formatLyric('')
              }
            })
          }

          this.$nextTick(() => {
            this.tap = !this.tap
          })
        })
      },
      getLyric() {
        this._axios({
          url: `/lyric?id=${this.songs[this.index].id}`
        }).then(res => {
          this.formatLyric(res.data.lrc.lyric)
        })
      },
      formatLyric(text) {
        this.lyric = []
        let arr = text.split("\n"); //原歌词文本已经换好行了方便很多，直接通过换行符“\n”进行切割
        let row = arr.length; //获取歌词行数
        for (let i = 0; i < row; i++) {
          let temp_row = arr[i]; //现在每一行格式大概就是这样"[00:04.302][02:10.00]hello world";
          let temp_arr = temp_row.split("]"); //可以通过“]”对时间和文本进行分离
          let text = temp_arr.pop(); //把歌词文本从数组中剔除出来，获取到歌词文本了！
          //再对剩下的歌词时间进行处理
          temp_arr.forEach(element => {
            let obj = {};
            let time_arr = element.substr(1, element.length - 1).split(":"); //先把多余的“[”去掉，再分离出分、秒
            let s = parseInt(time_arr[0]) * 60 + Math.ceil(time_arr[1]); //把时间转换成与currentTime相同的类型，方便待会实现滚动效果
            obj.time = s;
            obj.text = text;
            this.lyric.push(obj); //每一行歌词对象存到组件的lyric歌词属性里
          });
        }
        this.lyric.sort(this.sortRule); //由于不同时间的相同歌词我们给排到一起了，所以这里要以时间顺序重新排列一下
        // this.$store.commit("setLyric", this.lyric); //把歌词提交到store里，为了重新进入该组件时还能再次渲染

      },
      sortRule(a, b) { //设置一下排序规则
        return a.time - b.time;
      }
    },
    watch: {
      tap() {
        if (this.songs.length > 0) {
          this.src = this.songs[this.index].url
          this.$refs.audio.load(); // 每一次动态改变aduio的src后，都要load一次
          this.$refs.audio.oncanplay = () => {
            this.songTime = this.$refs.audio.duration // 这个caculateTime() 只是为了把音频的的时间格式化
            this.play()
          }
        }
      },
      index(newV, oldV) {
        if(this.rotateInterval) {
          clearInterval(this.rotateInterval)
        }

        this.rotateInterval = setInterval(() => {
          this.angleNum = this.angleNum + 1
          if (this.$refs.cd) {
            this.$refs.cd.style.transform = 'rotate(' + this.angleNum * 90 + 'deg)'
          }
        }, 1000)

        if (newV > oldV) {
          this.angleNum = 0
          this.$refs.cd.style.transition = 'none'
          this.$refs.cd.style.transform = 'rotate(0deg)'
          setTimeout(() => {
            this.$refs.cd.style.transition = 'all 1s linear'
          }, 100)

        } else if (newV == oldV && this.songs.length == 1) {
          this.lyricIndex = 0
        }

        this.lyricIndex = 0
        if (this.songs[newV].id) {
          console.log(newV)
          this._axios({
            url: `/lyric?id=${this.songs[newV].id}`
          }).then(res => {
            if (res.data.lrc) {
              this.formatLyric(res.data.lrc.lyric)
            } else {
              this.formatLyric('')
            }
          })
        }
      },
      lyricIndex(newV, oldV) {
        if (newV == 0) {
          this.$refs.lyricBox.style.top = '55px'
        } else {
          let top = this.$refs.lyricBox.style.top
          let height = document.querySelectorAll('.eachLyric')[oldV].offsetHeight
          this.$refs.lyricBox.style.top = parseInt(top.substr(0, top.length - 2)) - (20 + height) * (newV - oldV) + 'px'
        }
      }
    },
    created() {
      var that = this
      //当前页面监视键盘输入
      document.onkeydown = function(e) { //事件对象兼容
        let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
        //键盘按键判断:左箭头-37;上箭头-38；右箭头-39;下箭头-40
        //左
        if (e1 && e1.keyCode == 32) {
          if (that.playFlag) {
            that.pause()
          } else {
            that.play()
          }
        }
      }
    },
    mounted() {

      let that = this

      // document.onvisibilitychange = function() {
      //   if (document.visibilityState == "visible") {
      //     console.log(1)
      //     that.rotateInterval = setInterval(() => {
      //       that.angleNum = that.angleNum + 1
      //       if (that.$refs.cd) {
      //         that.$refs.cd.style.transform = 'rotate(' + that.angleNum * 90 + 'deg)'
      //       }
      //     }, 1000)
      //   } else {
      //     console.log(2)
      //     clearInterval(that.rotateInterval);
      //   }
      // }

      let id = ''
      console.log(this.$store.getters.getPlayLists)
      if (this.$store.getters.getPlayLists) {
        this.$store.getters.getPlayLists.forEach(e => {
          id += `${e.id},`
        })
      }
      this.getSongUrl(id)

      if(this.rotateInterval) {
        clearInterval(this.rotateInterval)
      }

      this.rotateInterval = setInterval(() => {
        this.angleNum = this.angleNum + 1
        if (this.$refs.cd) {
          this.$refs.cd.style.transform = 'rotate(' + this.angleNum * 90 + 'deg)'
        }
      }, 1000)


      // if (this.$store.getters.getCurrentSonglistFlag == 1) {
      //   let id = ''
      //   if (this.$store.getters.getPlayLists) {
      //     this.$store.getters.getPlayLists.forEach(e => {
      //       id += `${e.id},`
      //     })
      //   }
      //   this.getSongUrl(id)
      // } else {
      //   console.log(55)
      //   console.log(this.$store.getters.getPlayLists)

      //   this.$store.getters.getPlayLists.forEach(e => {
      //     this.songs.push({
      //       url: e.url,
      //       name: e.name,
      //       author: e.author,
      //       time: e.time,
      //       picUrl: e.picUrl
      //     })
      //   })

      //   this.$nextTick(() => {
      //     this.tap = !this.tap
      //   })
      // }
    }
  }
</script>

<style>
  #player {
    height: 100%;
  }

  #player .z-bg {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  #player img.z-b {
    width: 120%;
    margin-left: -10%;
    margin-top: -10%;
    filter: blur(50px);
  }

  #player .z-shadow {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
    position: absolute;
    z-index: -1;
  }

  #player .z-shadow-bx {
    width: 100%;
    height: 100%;
    background-color: #000000;
    position: absolute;
    z-index: -1;
  }

  #player .z-playerheader {
    padding: 20px 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #player .z-top-header-item {
    padding: 0 10px;
    color: #FFFFFF;
    opacity: .3;
    cursor: pointer;
  }

  #player .z-top-header-item:hover {
    opacity: 1;
  }

  #player .z-exit {
    visibility: hidden;
  }

  #player .z-playerheader:hover .z-exit {
    visibility: visible;
  }

  #player .el-dialog__body {
    padding: 25px 120px 0px;
  }

  #player .z-loginButton {
    width: 100%;
  }

  #player .z-regsiter {
    text-align: center;
    cursor: pointer;
  }

  #player .z-regsiter:hover {
    text-decoration: underline;
  }

  #player .z-playcontent {
    padding: 20px 120px;
  }

  #player .z-player-btn {
    background: transparent;
    color: rgba(255, 255, 255, .5);
    border: 1px solid rgba(255, 255, 255, .5);
  }

  #player .z-player-btn:hover {
    color: #FFFFFF;
    border: 1px solid #FFFFFF;
  }

  #player .el-table th>.cell {
    padding-left: 14px;
    padding-right: 14px;
  }

  #player .el-table th,
  #player .el-table tr {
    background-color: transparent;
  }

  #player .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: transparent;
  }

  #player .el-table td,
  #player .el-table th.is-leaf {
    border-bottom: 1px solid rgba(255, 255, 255, .1);
  }

  #player .el-table::before {
    height: 0;
  }

  #player .el-table td,
  #player .el-table th {
    padding: 5px 0;
  }

  #player .el-checkbox__inner {
    border: 1px solid rgba(255, 255, 255, .5);
    background-color: transparent;
  }

  #player .el-table thead {
    color: #e1e1e1;
    font-weight: 500;
  }

  #player .z-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #player .z-op {
    display: flex;
  }

  #player .el-dropdown {
    color: #FFFFFF;
  }

  #player .z-time {
    position: absolute;
  }

  #player .el-table__row:hover .z-time {
    opacity: 0;
  }

  #player .el-table__row:hover .z-opIcon {
    opacity: 1;
  }

  #player .z-opIcon {
    width: 35px;
    height: 35px;
    border: 1px solid #FFFFFF;
    border-radius: 50%;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    opacity: 0;
    z-index: 99;
  }

  #player .icon-icon_pause::before {
    content: "\e619";
    font-size: 24px;
    color: #FFFFFF;
  }

  #player .icon-icon_play::before {
    content: "\e60f";
    font-size: 24px;
    color: #FFFFFF;
  }

  #player .icon-icon_minvoice::before {
    content: "\e662";
    font-size: 24px;
    color: #FFFFFF;
  }

  #player .icon-icon_voice::before {
    content: "\e663";
    font-size: 24px;
    color: #FFFFFF;
  }

  #player .icon-icon_banvoice::before {
    content: "\e664";
    font-size: 24px;
    color: #FFFFFF;
  }

  #player .icon-icon_prev::before {
    content: "\e611";
    font-size: 24px;
    color: #FFFFFF;
  }

  #player .icon-icon_next::before {
    content: "\e612";
    font-size: 24px;
    color: #FFFFFF;
  }

  #player .icon-icon_circu::before {
    content: "\e61f";
    font-size: 24px;
    color: #FFFFFF;
  }

  #player .icon-icon_order::before {
    content: "\e632";
    font-size: 24px;
    color: #FFFFFF;
  }

  #player .icon-icon_random::before {
    content: "\e61e";
    font-size: 24px;
    color: #FFFFFF;
  }

  #player .icon-icon_self::before {
    content: "\e61d";
    font-size: 24px;
    color: #FFFFFF;
  }

  #player .icon-icon_uncollect::before {
    content: "\e600";
    font-size: 24px;
    color: #FFFFFF;
  }

  #player .icon-icon_collect::before {
    content: "\e634";
    font-size: 24px;
    color: #d56464;
  }

  #player .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #FFFFFF;
    color: #31c27c;
  }

  #player .el-slider__runway {
    height: 2px;
  }

  #player .el-slider__bar {
    height: 2px;
    background-color: #31c27c;
  }

  #player .el-slider__button-wrapper {
    top: -17px;
  }

  #player .el-slider__button {
    width: 8px;
    height: 8px;
    border-color: #31c27c;
  }

  #player .z-rotate {
    transition: all 1s linear;
  }

  /* 滚动条的宽度 */
  #player /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 3px;
    /* 横向滚动条 */
    height: 3px;
    /* 纵向滚动条 必写 */
  }

  /* 滚动条的滑块 */
  #player /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: rgba(49, 194, 124, .5);
    border-radius: 3px;
  }

  #player .z-lyric-color {
    color: #31C27C;
  }
</style>
