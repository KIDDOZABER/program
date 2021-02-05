<template>
  <div id="register">
    <div class="z-bg">
      <img :src="autoPic" alt="">
    </div>
    <div class="z-registerBox">
      <div class="z-backgroundImg">
        <img :src="autoPic" alt="">
      </div>
      <div class="z-registerForm">
        <div v-if="step == 1">
          <p style="margin-bottom: 20px;">注册账号</p>
          <el-alert :closable="false" title="注意：用户名（4-12位）必须以英文字母开头，不允许除字母数字下划线以外的字符，密码（6-16位）不能为纯数字纯字母" type="info"
            show-icon>
          </el-alert>
          <el-form class="z-form" label-position="right" :model="registerForm" :rules="rules" ref="registerForm">
            <el-form-item prop="account">
              <el-input v-model="registerForm.account" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="pwd">
              <el-input v-model="registerForm.pwd" placeholder="请输入密码" :type="passwordType">
                <i v-if="showPassword" class="iconfont icon-icon_eyes" slot="suffix" @click="clickShowPassword"></i>
                <i v-else class="iconfont icon-icon_eyesclose" slot="suffix" @click="clickShowPassword"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="checkpwd">
              <el-input v-model="registerForm.checkpwd" placeholder="请再次输入密码" :type="passwordType2">
                <i v-if="showPassword2" class="iconfont icon-icon_eyes" slot="suffix" @click="clickShowPassword2"></i>
                <i v-else class="iconfont icon-icon_eyesclose" slot="suffix" @click="clickShowPassword2"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="z-loginButton" type="success" @click="nextStep">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="step == 2">
          <p style="margin-bottom: 20px;">添加头像</p>
          <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
            :on-progress="uploading" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeUpload">
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button class="z-loginButton" type="success" @click="preStep">上一步</el-button>
          <el-button style="margin-top: 20px;" class="z-loginButton" type="success" @click="complete">{{nextFlag ? '下一步' : '跳过'}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      var checkAccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('用户名不能为空'));
        } else {
          if (/^([^a-zA-Z].*|.*[^a-zA-Z0-9_].*|.{1,3}|.{13,})$/.test(value)) {
            callback(new Error('用户名格式错误'));
          } else {
            callback();
          }
        }
      };
      var checkPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不能为空'));
        } else {
          if (/^(\d+|[a-zA-Z]+|.{1,5}|.{17,})$/.test(value)) {
            callback(new Error('密码格式错误'));
          } else {
            if (this.registerForm.checkpwd != '') {
              this.$refs.registerForm.validateField('checkpwd')
            }
            callback();
          }
        }
      };
      var checkPwdAgain = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else {
          if (value !== this.registerForm.pwd) {
            callback(new Error('两次密码不一致'));
          } else {
            callback();
          }
        }
      };
      return {
        autoPic: require('@/assets/register/bg3.jpg'),
        picList: [
          require('@/assets/register/bg1.jpg'),
          require('@/assets/register/bg2.jpg'),
          require('@/assets/register/bg3.jpg')
        ],
        registerForm: {
          account: '',
          pwd: '',
          checkpwd: ''
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
          checkpwd: [{
            validator: checkPwdAgain,
            trigger: 'blur'
          }],
        },
        step: 1,
        imgUrl: '',
        loading: null,
        showPassword: false,
        passwordType: 'password',
        showPassword2: false,
        passwordType2: 'password',
        nextFlag: false
      }
    },
    methods: {
      nextStep() {
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            this.$store.commit('setUsername', this.registerForm.account)
            this.step = 2
          } else {
            return false;
          }
        });
      },
      preStep() {
        this.step = 1
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
        this.$store.commit('setImgUrl', this.imgUrl)
        this.nextFlag = true
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
        let obj = {
          name: this.registerForm.account,
          pw: this.registerForm.pwd
        }
        this.$axios.post('http://forumapi.com/api/register', obj).then(res => {
          console.log(res)
          if (res.data.code == 2000) {
            // this.$store.commit('setLogin', true)
            this.$router.push({
              path: '/entry'
            })
          } else {
            this.$message(res.data.msg);
          }
        })
        // this._zaxios({
        //   url: '/api/register',
        //   method: 'post',
        //   data: {
        //     name: this.registerForm.account,
        //     pw: this.registerForm.pwd
        //   }
        // }).then(res => {
        //   console.log(res)
        //   if (res.data.code == 2000) {
        //     this.$store.commit('setLogin', true)
        //     this.$router.push({
        //       path: '/entry'
        //     })
        //   } else {
        //     this.$message({
        //       message: '未注册成功，请检查相关信息',
        //       type: 'warning'
        //     });
        //   }
        // })


      },
      clickShowPassword() {
        this.showPassword = !this.showPassword
        this.passwordType = this.showPassword ? 'text' : 'password'
      },
      clickShowPassword2() {
        this.showPassword2 = !this.showPassword2
        this.passwordType2 = this.showPassword2 ? 'text' : 'password'
      }
    },
    mounted() {
      let num = 0
      setInterval(() => {
        this.autoPic = this.picList[num++]
        if (num >= this.picList.length) num = 0
      }, 5000)
    }
  }
</script>

<style>
  #register {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #register .z-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -1;
  }

  #register .z-bg img {
    width: 120%;
    margin-left: -10%;
    margin-top: -10%;
    filter: blur(10px);
  }

  #register .z-registerBox {
    display: flex;
  }

  #register .z-backgroundImg {
    max-width: 300px;
  }

  #register .z-backgroundImg img {
    height: 100%;
  }

  #register .z-registerForm {
    width: 400px;
    background-color: #FFFFFF;
    padding: 20px;
    text-align: center;
  }

  #register .z-form {
    margin-top: 20px;
  }

  #register .avatar-uploader .el-upload {
    border: 1px solid #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  #register .avatar-uploader .el-upload:hover {
    border-color: #31C27C;
  }

  #register .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }

  #register .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }

  #register .icon-icon_eyes::before {
    content: "\e607";
    font-size: 24px;
    color: #999999;
  }

  #register .icon-icon_eyesclose::before {
    content: "\e602";
    font-size: 24px;
    color: #999999;
  }
</style>
