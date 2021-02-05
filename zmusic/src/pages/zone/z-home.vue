<template>
  <div id="home">
    <div style="padding-bottom: 60px;">
      <h2 class="z-title">歌单推荐</h2>
      <!-- <ul class="z-typelist">
        <li v-for="type in typeList" :key="type.label" @click="switchSonglist">{{type.label}}</li>
      </ul> -->
      <el-carousel class="z-carousel" :interval="4000" type="card" height="300px">
        <el-carousel-item v-for="songlist in songList" :key="songlist.name" @click.native="openSonglist(songlist.id)">
          <div class="z-songlist">
            <img :src="songlist.coverImgUrl" alt="">
            <div class="z-songInfo">
              <p>{{songlist.name}}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div style="background-color: #f2f2f2;padding: 60px 0;">
      <div style="width: 1200px;margin: 0 auto;">
        <h2 class="z-title">每日15首</h2>
        <el-button icon="el-icon-video-play" @click="playAll">播放全部</el-button>
        <div style="display: flex;flex-wrap: wrap;margin-top: 40px;margin-left: -10px;margin-right: -10px;">
          <div style="display: flex;width: 33.33%;padding: 10px;box-sizing: border-box;" v-for="(song,index) in songs"
            :key="index">
            <div class="z-songpic" @click="playOne(song)">
              <div class="z-songinnerpic">
                <img style="width: 100%;" :src="song.picUrl" alt="">
              </div>
              <div class="z-songplay">
                <i class="el-icon-video-play" style="font-size: 48px;color: #FFFFFF;"></i>
              </div>
            </div>
            <div style="flex-grow: 1;display: flex;padding: 0 10px;justify-content: space-between;align-items: center;background-color: #FFFFFF;color: #8C939D;">
              <div>
                <p style="margin: 0;color: #000000;">{{song.name}}</p>
                <p style="margin: 0;">{{song.song.artists[0].name}}</p>
              </div>
              <p>{{song.song.duration/1000 | formatSeconds}}</p>
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
        typeList: [{
            label: '为你推荐'
          },
          {
            label: '官方歌单'
          },
          {
            label: '情歌'
          },
          {
            label: '网络歌曲'
          },
          {
            label: '经典'
          },
          {
            label: 'KTV热歌'
          }
        ],
        songList: [
          // {
          //   img: require('@/assets/music/img1.jpg'),
          //   name: '华语女声：深夜里的那丝温柔',
          //   author: '小众又怎样',
          //   amountOfPlay: 1351000
          // },
          // {
          //   img: require('@/assets/music/img2.jpg'),
          //   name: '催泪系列 | 失恋时建议不要去听',
          //   author: '小众又怎样',
          //   amountOfPlay: 25101000
          // },
          // {
          //   img: require('@/assets/music/img3.jpg'),
          //   name: '『流行电音』 洗去一切回想',
          //   author: '小众又怎样',
          //   amountOfPlay: 38000
          // },
          // {
          //   img: require('@/assets/music/img4.jpg'),
          //   name: '即使再难的路，也无畏闯荡',
          //   author: '小众又怎样',
          //   amountOfPlay: 3389000
          // },
          // {
          //   img: require('@/assets/music/img5.jpg'),
          //   name: '上班上课挤公交逛街都听不腻的韩语歌',
          //   author: '小众又怎样',
          //   amountOfPlay: 2099000
          // }
        ],
        songs: [
          // {
          //   img: require('@/assets/music/img6.jpg'),
          //   name: 'KIDS',
          //   author: '马伯骞',
          //   time: '03:18'
          // },
          // {
          //   img: require('@/assets/music/img6.jpg'),
          //   name: 'KIDS',
          //   author: '马伯骞',
          //   time: '03:18'
          // },
          // {
          //   img: require('@/assets/music/img6.jpg'),
          //   name: 'KIDS',
          //   author: '马伯骞',
          //   time: '03:18'
          // },
          // {
          //   img: require('@/assets/music/img6.jpg'),
          //   name: 'KIDS',
          //   author: '马伯骞',
          //   time: '03:18'
          // },
          // {
          //   img: require('@/assets/music/img6.jpg'),
          //   name: 'KIDS',
          //   author: '马伯骞',
          //   time: '03:18'
          // }
        ],
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
      switchSonglist() {
        this.$message("暂无该歌单分类")
      },
      openSonglist(val) {
        this.$store.commit('setCurrentSonglistId',val)
        this.$store.commit('setCurrentSonglistFlag', 1)
        this.$router.push({name:'songlist'})
      },
      playAll() {
        let allSongs = []
        this.songs.forEach(song => {
          allSongs.push({
            alia: song.alg,
            author: song.song.artists[0].name,
            id: song.id,
            name: song.name,
            picUrl: song.picUrl,
            time: song.song.duration
          })
        })
        this.$store.commit('setPlayLists', allSongs)
        this.$store.commit('setCurrentSonglistFlag', 1)
        this.$router.push({
          name: 'player'
        })
      },
      playOne(song) {
        console.log(song)
        let onesong = []
        onesong.push({
          alia: song.alg,
          author: song.song.artists[0].name,
          id: song.id,
          name: song.name,
          picUrl: song.picUrl,
          time: song.song.duration
        })
        this.$store.commit('setPlayLists', onesong)
        this.$store.commit('setCurrentSonglistFlag', 1)
        this.$router.push({
          name: 'player'
        })
      },
    },
    mounted() {
      this.openLoading()
      this._axios({
        url: '/top/playlist/highquality?limit=5'
      }).then(res => {
        console.log(res)

        this.songList = res.data.playlists

        this.closeLoading()
      })

      this._axios({
        url: '/personalized/newsong?limit=15'
      }).then(res => {
        console.log(res)

        this.songs = res.data.result

      })
    }
  }
</script>

<style>
  #home {
    padding: 60px 0 0;
    background-color: #fafafa;
  }

  #home .z-title {
    text-align: center;
    margin-bottom: 20px;
  }

  #home .z-typelist {
    max-width: 600px;
    list-style: none;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    margin-bottom: 50px;
  }

  #home .z-typelist li {
    cursor: pointer;
  }

  #home .z-typelist li:hover {
    color: #31c27c;
  }

  #home .z-carousel {
    margin: 0 auto;
    max-width: 1200px;
  }

  #home .z-songlist {
    width: 100%;
    position: relative;
  }

  #home .z-songlist img {
    width: 100%;
  }

  #home .z-songInfo {
    width: 100%;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    padding: 20px 0;
    color: #FFFFFF;
    position: absolute;
    top: 40%;
  }

  #home .z-songpic {
    width: 80px;
    height: 80px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
  }

  #home .z-songinnerpic {
    width: 100%;
    transition: all .3s ease-in-out;
  }

  #home .z-songpic:hover .z-songplay {
    opacity: 1;
  }

  #home .z-songpic:hover .z-songinnerpic {
    width: 120%;
    margin-top: -10%;
    margin-left: -10%;
  }

  #home .z-songplay {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .3);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: all .3s ease-in-out;
  }
</style>
