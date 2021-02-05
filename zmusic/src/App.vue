<template>
  <div id="app">
    <router-view></router-view>
    <el-dialog id="applogin" title="账号密码登录" :visible.sync="loginBoxVisible" width="600px" center>
      <el-form label-position="right" :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item prop="account">
          <el-input v-model="loginForm.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input v-model="loginForm.pwd" placeholder="请输入密码" :type="passwordType">
            <i v-if="showPassword" class="iconfont icon-icon_eyes" slot="suffix" @click="clickShowPassword"></i>
            <i v-else class="iconfont icon-icon_eyesclose" slot="suffix" @click="clickShowPassword"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="z-loginButton" type="success" @click="clickLogin">登录</el-button>
        </el-form-item>
      </el-form>
      <p class="z-regsiter" @click="reg">注册新账号</p>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      var checkAccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('你还没有输入账号'));
        } else {
          callback();
        }
      };
      var checkPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('你还没有输入密码'));
        } else {
          callback();
        }
      };
      return {
        loginBoxVisible: false,
        loginForm: {
          account: '',
          pwd: ''
        },
        rules: {
          account: [{
            validator: checkAccount,
            trigger: 'blur'
          }],
          pwd: [{
            validator: checkPwd,
            trigger: 'blur'
          }],
        },
        showPassword: false,
        passwordType: 'password',
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
      openLoginBox() {
        this.loginBoxVisible = true
      },
      clickLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.openLoading()
            let obj = {
              name: this.loginForm.account,
              pw: this.loginForm.pwd
            }
            this.$axios.post('http://forumapi.com/api/login', obj).then(res => {
              console.log(res)
              if (res.data.code == 2000) {
                this.$store.commit('setLogin', true)
                this.$store.commit('setUsername', res.data.data.user_account)
                this.$store.commit('setToken', res.data.data.token)
                this.loginBoxVisible = false

                if (this.$store.getters.isLogin) {
                  let token = this.$store.getters.getUser.token
                  this.$axios.post('http://forumapi.com/api/typeUserList', {
                    token: token
                  }).then(res => {
                    if (res.data.code == 2000) {
                      this.$store.commit('setSonglists', res.data.data)
                      this.loginForm = {
                        account: '',
                        pwd: ''
                      }

                    } else if (res.data.code == 3002) {
                      this.$message('您的登录已过期，请重新登录');
                      this.$store.commit('setLogin', false)
                    } else {
                      this.$message(res.data.msg);
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
            // this.$router.go(0);
          } else {
            return false;
          }
        });
      },
      clickShowPassword() {
        this.showPassword = !this.showPassword
        this.passwordType = this.showPassword ? 'text' : 'password'
      },
      reg() {
        this.loginBoxVisible = false
        this.$router.push({
          path: '/register'
        })
      }
    },
    created() {
      //在页面加载时读取sessionStorage里的状态信息
      if (sessionStorage.getItem("store")) {
        this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
        // let store = JSON.parse(sessionStorage.getItem("store"))
        // this.$store.commit('setLogin', store.login)
        // this.$store.commit('setImgUrl', store.user.imgUrl)
        // this.$store.commit('setUsername', store.user.username)
        // this.$store.commit('setPlayLists', store.playLists)
      }

      //在页面刷新时将vuex里的信息保存到sessionStorage里
      window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("store", JSON.stringify(this.$store.state))
        // let store = {
        //   login: this.$store.getters.isLogin,
        //   user: this.$store.getters.getUser,
        //   playLists: this.$store.getters.getPlayLists
        // }
        sessionStorage.setItem("store", JSON.stringify(store))
      })
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  html,
  body {
    height: 100%;
  }

  #app {
    height: 100%;
  }

  img {
    display: block;
  }

  @font-face {
    font-family: 'iconfont';
    /* project id 2300661 */
    src: url('//at.alicdn.com/t/font_2300661_4pg82qv3kad.eot');
    src: url('//at.alicdn.com/t/font_2300661_4pg82qv3kad.eot?#iefix') format('embedded-opentype'),
      url('//at.alicdn.com/t/font_2300661_4pg82qv3kad.woff2') format('woff2'),
      url('//at.alicdn.com/t/font_2300661_4pg82qv3kad.woff') format('woff'),
      url('//at.alicdn.com/t/font_2300661_4pg82qv3kad.ttf') format('truetype'),
      url('//at.alicdn.com/t/font_2300661_4pg82qv3kad.svg#iconfont') format('svg');
  }

  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    cursor: pointer;
  }

  ::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }

  /* 滚动条的滑块 */
  ::-webkit-scrollbar-thumb {
    background-color: rgba(49, 194, 124, .5);
    border-radius: 3px;
  }

  .el-icon-loading::before {
    color: #31C27C;
    font-size: 72px;
  }

  .el-loading-spinner .el-loading-text {
    color: #31C27C;
    font-size: 24px;
  }

  .el-button--success {
    color: #FFF;
    background-color: #31C27C;
    border-color: #31C27C;
  }

  #applogin .el-dialog__body {
    padding: 25px 120px 30px;
  }

  #applogin .z-loginButton {
    width: 100%;
  }

  #applogin .z-regsiter {
    text-align: center;
    cursor: pointer;
  }

  #applogin .z-regsiter:hover {
    text-decoration: underline;
  }

  #applogin .icon-icon_eyes::before {
    content: "\e607";
    font-size: 24px;
    color: #999999;
  }

  #applogin .icon-icon_eyesclose::before {
    content: "\e602";
    font-size: 24px;
    color: #999999;
  }

  .el-button:focus,
  .el-button:hover {
    color: #31C27C;
    border-color: #31C27C;
    background-color: #FFFFFF;
  }
</style>
