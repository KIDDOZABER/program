<template>
  <div id="playlist">
    <div style="width: 1200px;margin: 0 auto;">
      <div class="z-classifyList">
        <div style="width: 200px;" v-for="classify in classifyList" :key="classify.label">
          <p style="color: #999999;">{{classify.label}}</p>
          <div style="width: 100%; display: flex;flex-wrap: wrap;">
            <p v-for="item in classify.children.slice(0,8)" class="z-itemname" @click="switchSonglists(item.name)">{{item.name}}</p>
            <p v-if="classify.children.length > 8" class="z-itemname" style="color: #31C27C;" @click="showAllclassify(classify.children)">更多</p>
          </div>
        </div>
        <div class="z-classifyListMore" ref="moreclassify">
          <p v-for="item in moreClassify" @click="switchSonglists(item.name)">{{item.name}}</p>
        </div>
      </div>
      <div class="z-options">
        <div style="font-size: 24px;color: #000000;padding: 10px;">
          {{tag}}
        </div>
        <el-button-group>
          <el-button :type="order == 'hot' ? 'success' : ''" size="small" @click="switchOrder('hot')">推荐</el-button>
          <el-button :type="order == 'new' ? 'success' : ''" size="small" @click="switchOrder('new')">最新</el-button>
        </el-button-group>
      </div>
      <div>
        <ul class="z-musicList">
          <li class="z-music" v-for="music in musicList">
            <el-image :src="music.coverImgUrl" @click="gotoSonglist(music.id)" style="cursor: pointer;">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <div class="z-musicInfo">
              <p class="z-musicname" @click="gotoSonglist(music.id)">{{music.name}}</p>
              <p style="color: #999999;padding: 5px 0;">{{music.userName ? music.userName : '未知'}}</p>
              <p style="color: #999999;">播放量：{{music.subscribedCount > 9999 ? (music.subscribedCount/10000).toFixed(1) + '万' : music.subscribedCount}}</p>
            </div>
          </li>
        </ul>

        <el-pagination style="text-align: center;margin-top: 50px;" layout="prev, pager, next" :current-page.sync="currentPage"
          :page-size="limit" :total="total" @current-change="changePage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        classifyList: [],
        moreClassify: [],
        tag: '全部',
        order: 'hot',
        limit: 20,
        total: 0,
        currentPage: 1,
        musicList: [],
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
      showAllclassify(val) {
        this.moreClassify = val.slice(8, val.length)
        this.$refs.moreclassify.style.display = 'flex'
      },
      switchSonglists(name) {
        this.openLoading()
        this.order = 'hot'
        this.tag = name
        this.currentPage = 1
        this.getSonglists()
      },
      switchOrder(val) {
        this.openLoading()
        this.order = val
        this.currentPage = 1
        this.getSonglists()
      },
      getSonglists() {
        this._axios({
          url: `/top/playlist?cat=${this.tag}&order=${this.order}&limit=${this.limit}&offset=${(this.currentPage-1)*this.limit}`,
          withCredentials: true
        }).then(res => {
          this.total = res.data.total
          this.musicList = res.data.playlists

          // console.log(this.musicList)
          // for(let i = 0;i < this.musicList.length;i++) {
          //   // this.getUserName(this.musicList[i].userId,i)
          //   this._axios({
          //     url: `/user/detail?uid=${this.musicList[i].userId}`
          //   }).then(res => {
          //     this.$set(this.musicList[i], 'userName', res.data.profile.nickname)
          //   })
          // }

          this.musicList.forEach(e => {
            this._axios({
              url: `/user/detail?uid=${e.userId}`
            }).then(res => {
              this.$set(e, 'userName', res.data.profile.nickname)
            })
          })


          this.closeLoading()

          this.$refs.moreclassify.style.display = 'none'
        })
      },
      // async getUserName(userId,index) {
      //   // for(let i = 0;i < this.musicList.length;i++) {
      //     let res = await this.getEachUserName(userId,index)
      //     return res
      //   // }
      //   // this.musicList.forEach((e,i) => {
      //   // })
      // },
      // getEachUserName(userId,index) {
      //   console.log(2)
      //   return new Promise((resolve,reject) => {
      //     this._axios({
      //       url: `/user/detail?uid=${userId}`
      //     }).then(res => {
      //       this.$set(this.musicList[index], 'userName', res.data.profile.nickname)
      //     })
      //   }).then(res => {
      //     resolve(res)
      //   }).catch(error => {
      //     reject(error)
      //   })
      // },
      gotoSonglist(val) {
        this.$store.commit('setCurrentSonglistId', val)
        this.$store.commit('setCurrentSonglistFlag', 1)
        this.$router.push({
          name: 'songlist',
          params: {
            id: val
          }
        })
      },
      changePage(val) {
        this.openLoading()
        this.currentPage = val
        this.getSonglists()
      }
    },
    mounted() {
      document.addEventListener('click', e => {
        if (e.target.className !== undefined && e.target.className !== 'z-classifyListMore' && e.target.className !==
          'z-itemname') {
          this.$refs.moreclassify.style.display = 'none'
        }
      })

      this.openLoading()
      this._axios({
        url: '/playlist/catlist'
      }).then(res => {
        for (let key in res.data.categories) {
          this.classifyList.push({
            label: res.data.categories[key],
            children: []
          })
        }
        res.data.sub.forEach(e => {
          this.classifyList[e.category].children.push(e)
        })

        this.getSonglists()
      })
    }
  }
</script>

<style>
  #playlist {
    padding: 60px 0;
    background-color: #f6f6f6;
  }

  #playlist .z-classifyList {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 32px;
    position: relative;
  }

  #playlist .z-itemname {
    width: 33.3%;
    margin: 10px 0 10px 0;
    box-sizing: border-box;
    cursor: pointer;
  }

  #playlist .z-itemname:hover {
    color: #31C27C;
  }

  #playlist .z-classifyListMore {
    position: absolute;
    top: 100%;
    width: 100%;
    box-shadow: 0 0 10px rgba(183, 183, 183, .65);
    background-color: #fff;
    padding: 20px 15px;
    z-index: 1;
    box-sizing: border-box;
    display: flex;
    display: none;
  }

  #playlist .z-classifyListMore p {
    margin-right: 40px;
    cursor: pointer;
  }

  #playlist .z-classifyListMore p:hover {
    color: #31C27C;
  }

  #playlist .z-options {
    display: flex;
    justify-content: space-between;
  }

  #playlist .el-tag {
    margin-right: 10px;
  }

  #playlist .z-musicList {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    margin-left: -10px;
    margin-right: -10px;
    flex-wrap: wrap;
  }

  #playlist .z-music {
    width: 20%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  #playlist .z-musicInfo {
    margin-top: 20px;
  }

  #playlist .z-musicInfo p {
    font-size: 14px;
    margin: 0;
  }

  #playlist .z-musicname {
    cursor: pointer;
  }

  #playlist .z-musicname:hover {
    color: #31C27C;
  }
</style>
