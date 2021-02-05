// pages/my/myLogin.js
const { $Toast } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('view.open-type.getUserInfo'),
    name: '',
    pw: '',
    topText: '登录'
  },

  gotoReg() {
    this.setData({
      topText: '注册'
    })
  },

  // 微信登录/注册
  wxReg() {

    var _this = this

    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'http://api_devs.wanxikeji.cn/api/codeExchangeOpenid',
            data: {
              code: res.code
            },
            success(res) {
              console.log(res)
              wx.setStorageSync('openid', res.data.data.openid)
              if (res.data.data.info) {
                wx.showToast({
                  title: '该账号已注册',
                })
              } else {
                wx.getUserInfo({
                  success: function (res) {

                    _this.setData({
                      name: res.userInfo.nickName,
                      nick_name: res.userInfo.nickName,
                      icon: res.userInfo.avatarUrl,
                    })

                    wx.request({
                      url: 'http://api_devs.wanxikeji.cn/api/register',
                      data: {
                        name: _this.data.name,
                        pw: _this.data.pw,
                        openid: _this.data.openid,
                        nick_name: _this.data.nick_name,
                        icon: _this.data.icon,
                      },
                      success(res) {
                        wx.showToast({
                          title: res.data.msg,
                        })
                      }
                    })

                  }
                })

              }
            }
          })
        }
      }
    })



  },

  wxLogin() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    let _this = this
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'http://api_devs.wanxikeji.cn/api/codeExchangeOpenid',
            data: {
              code: res.code
            },
            success(res) {
              if (!res.data.data.openid) {
                wx.showToast({
                  title: '授权失败',
                  icon: 'none'
                })
              } else {
                wx.setStorageSync('openid', res.data.data.openid)
                console.log(res)
                if (res.data.data.info) {
                  wx.setStorageSync('token', res.data.data.info.token)
                  console.log(2)
                  wx.navigateBack({
                    delta: 1
                  });
                } else {
                  wx.getUserInfo({
                    success: function (res) {

                      _this.setData({
                        name: res.userInfo.nickName,
                        nick_name: res.userInfo.nickName,
                        icon: res.userInfo.avatarUrl,
                      })

                      wx.request({
                        url: 'http://api_devs.wanxikeji.cn/api/register',
                        data: {
                          name: _this.data.name,
                          pw: _this.data.pw,
                          openid: _this.data.openid,
                          nick_name: _this.data.nick_name,
                          icon: _this.data.icon,
                        },
                        success: (res) => {
                          console.log(res)
                          console.log(res.data.token)
                          wx.setStorageSync('token', res.data.data.token)
                          wx.setStorageSync('icon', res.data.data.icon)
                          wx.setStorageSync('nick_name', res.data.data.nick_name)
                          wx.navigateBack({
                            delta: 1
                          });
                        }
                      })

                    }
                  })
                }
              }

            }
          })
        }
      }
    })

    // if (this.data.info != '') {
    //   $Toast({
    //     content: '登录成功',
    //     icon: 'success',
    //     duration: 0,
    //     mask: false
    //   });

    //   setTimeout(() => {
    //     wx.setStorageSync('token', this.data.token);
    //     wx.setStorageSync('openid', this.data.openid);
    //     $Toast.hide();
    //     prevPage.onLoad();
    //     wx.navigateBack();
    //   }, 2000);
    // } else {

    //   $Toast({
    //     content: '当前账号未注册',
    //     icon: 'prompt',
    //     duration: 0,
    //     mask: false
    //   });
    //   setTimeout(() => {
    //     $Toast.hide();
    //   }, 2000);
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid: options.openid,
      info: options.info,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})