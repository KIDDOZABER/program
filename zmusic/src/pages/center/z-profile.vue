<template>
  <div id="profile">
    <div class="z-profile-header">
      <div v-if="isEdit" style="text-align: center;">
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
          :on-progress="uploading" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeUpload">
          <img v-if="imgUrl" :src="imgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div style="display: flex;">
          <el-input style="margin-right: 10px;" v-model="username"></el-input>
          <el-button @click="complete">确定</el-button>
        </div>
      </div>
      <div v-else style="text-align: center;">
        <el-avatar :size="110" :src="$store.getters.getUser.imgUrl" @error="error">
          <img v-if="$store.getters.isLogin" src="../../assets/music/img1.jpg"/>
        </el-avatar>
        <div class="z-user-edit" v-if="$store.getters.isLogin">
          <p style="">{{$store.getters.getUser.username}}</p>
          <!-- <el-tooltip effect="dark" content="修改个人信息" placement="top" style="margin-left: 20px;">
            <i class="el-icon-edit-outline z-editIcon" @click="isEdit = true"></i>
          </el-tooltip> -->
        </div>
        <div class="z-user-edit" v-else>
          <p class="z-loginp" @click="openLoginBox">立即登录</p>
        </div>
      </div>
      <div style="width: 100%;" class="z-tab">
        <el-tabs style="width: 1200px;margin: 0 auto;" v-if="$store.getters.isLogin" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="我喜欢" name="like"></el-tab-pane>
          <el-tab-pane label="我的已购" name="" disabled></el-tab-pane>
          <el-tab-pane label="我创建的歌单" name="create"></el-tab-pane>
          <el-tab-pane label="关注" name="" disabled></el-tab-pane>
          <el-tab-pane label="粉丝" name="" disabled></el-tab-pane>
          <el-tab-pane label="我上传的视频" name="" disabled></el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <router-view v-if="this.$store.getters.isLogin"></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        imgUrl: '',
        username: '',
        isEdit: false,
        activeName: 'like',
        loading: null
      }
    },
    methods: {
      error() {
        this.$message.error('头像加载失败');
        return true
      },
      uploading(event, file, fileList) {
        console.log(event, file, fileList)
        this.loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        });
      },
      uploadSuccess(res, file) {
        this.loading.close()
        this.$message({
          message: '头像上传成功',
          type: 'success'
        });
        console.log(res)
        console.log(file)
        this.imgUrl = URL.createObjectURL(file.raw);
        console.log(this.imgUrl)
      },
      uploadError(error, file, fileList) {
        this.loading.close()
        this.$message.error('头像上传失败，请重试');
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      complete() {
        this.isEdit = false
        this.$store.commit('setImgUrl', this.imgUrl)
        this.$store.commit('setUsername', this.username)
      },
      openLoginBox() {
        this.$parent.openLoginBox()
      },
      handleClick(tab, event) {
        this.$router.push({name:tab.name})
        console.log(tab.name);
      }
    },
    mounted() {
      this.imgUrl = this.$store.getters.getUser.imgUrl
      this.username = this.$store.getters.getUser.username
    }
  }
</script>

<style>
  #profile .z-profile-header {
    width: 100%;
    height: 380px;
    background-image: url("../../assets/bg/bg_profile.jpg");
    background-position: center top;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #FFFFFF;
    font-size: 24px;
    position: relative;
  }

  #profile .z-user-edit {
    display: flex;
    align-items: baseline;
    justify-content: center;
  }

  #profile .z-loginp {
    cursor: pointer;
  }

  #profile .z-loginp:hover {
    color: #31C27C;
  }

  #profile .z-editIcon:hover {
    cursor: pointer;
    color: #31C27C;
  }

  #profile .avatar-uploader .el-upload {
    border: 1px solid #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  #profile .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  #profile .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 110px;
    height: 110px;
    line-height: 110px;
    text-align: center;
  }

  #profile .avatar {
    width: 110px;
    height: 110px;
    display: block;
  }

  #profile .z-tab {
    position: absolute;
    bottom: 0;
  }

  #profile .el-tabs__header {
    margin: 0;
    color: #FFFFFF;
  }

  #profile .el-tabs__active-bar {
    height: 0;
    background-color: transparent;
  }

  #profile .el-tabs__item {
    color: #FFFFFF;
  }

  #profile .el-tabs__item.is-active {
    color: #31C27C;
  }

  #profile .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
</style>
