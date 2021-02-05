<template>
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
    <el-table-column prop="alia" label="专辑"></el-table-column>
    <el-table-column prop="time" label="时长" width="100">
      <template v-slot="scope">
        {{(scope.row.time/1000)|formatSeconds}}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        songs: [],
        selectSongs: [],
        editVisible: false
      }
    },
    methods: {
      initData(data) {
        this.songs = JSON.parse(JSON.stringify(data))
        this.selectSongs = JSON.parse(JSON.stringify(this.songs))
      },
      selectRow(songs) {
        this.selectSongs = JSON.parse(JSON.stringify(songs))
      },
      playOne(song) {
        console.log(song)
        let onesong = []
        onesong.push(song)
        this.$store.commit('setPlayLists', onesong)
        this.$store.commit('setCurrentSonglistFlag', 1)
        this.$router.push({
          name: 'player'
        })
      },
      openLoginBox() {
        this.$parent.openLoginBox()
      },
      addOneToSonglist(val) {
        let obj = {
          token: this.$store.getters.getUser.token,
          type_user_id: val.type_user_id,
          music_name: val.music.name,
          music_auth: val.music.author,
          music_path: val.music.picUrl,
          music_url: val.music.url,
          music_time: val.music.time.toString(),
          album: val.music.name,
          remark: JSON.stringify({
            id: val.music.id
          })
        }
        this.$axios.post('http://forumapi.com/api/addMusicUser', obj).then(res => {
          console.log(res)
          if (res.data.code == 2000) {
            this.$message('已成功添加到歌单');
          } else {
            this.$message(res.data.msg);
          }
        })
      }
    }
  }
</script>

<style>
</style>
