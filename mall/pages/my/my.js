// pages/about/home/home.js
const { $Toast } = require('../../dist/base/index');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: [
      { name: 'like', text: '收藏' },
      { name: 'moneybag', text: '优惠券' },
      { name: 'location', text: '收货地址' },
      { name: 'newshot', text: '我的足迹' },
    ],
    icons: [
      { name: 'pay', text: '待付款' },
      { name: 'send', text: '待收货' },
      { name: 'comment', text: '待评价' },
      { name: 'form', text: '全部订单' },
    ],
    nickName: '',
    loginStatus: false,
    avatarUrl: '',
    token: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      navHeight: app.globalData.navHeight,
    });
    var _this = this

    this.setData({
      token: wx.getStorageSync('token')
    })

    let query = wx.createSelectorQuery().in(this);
    query.select("#myInfo").boundingClientRect((rect) => {
      let top = rect.top;
      this.setData({
        myInfoHeight: app.globalData.windowHeight - top,
      });
    }).exec();

    // wx.request({
    //   url: 'http://api_devs.wanxikeji.cn/api/refreshToken',
    //   data: {
    //     openid: wx.getStorageSync('openid')
    //   },
    //   success: (result) => {
    //     console.log(result);
    //   },
    // })

    if (_this.data.token != '') {
      wx.getUserInfo({
        success: function (res) {
          console.log(res)

          _this.setData({
            avatarUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName,
            loginStatus: true
          })
        }
      })
    }

    wx.getSetting({
      success(res) {
        console.log(res);

        if (res.authSetting['scope.userInfo'] == true) {

          wx.getUserInfo({
            success: function (res) {
              console.log(res)

              if (_this.data.token != '') {
                _this.setData({
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName,
                  loginStatus: true
                })
              }
            }
          })

        }
      }
    })
  },

  // 登录/退出当前账号
  loginID() {
    if (this.data.loginStatus == false) {

      var _this = this
      wx.login({
        success(res) {
          if (res.code) {
            wx.request({
              url: 'http://api_devs.wanxikeji.cn/api/codeExchangeOpenid',
              data: {
                code: res.code
              },
              success: (result) => {
                console.log(result);

                if(result.data.code == 2000) {
                  _this.setData({
                    openid: result.data.data.openid ? result.data.data.openid : '',
                    token: result.data.data.info ? result.data.data.info.token : '',
                    info: result.data.data.info ? result.data.data.info : '',
                  })
  
                  console.log(_this.data.info)
  
                  if (_this.data.info == '') {
                    wx.navigateTo({
                      url: './myLogin?openid=' + _this.data.openid + '&info=' + _this.data.info,
                    })
                  } else {
  
                    console.log(_this.data.info)
  
                    _this.setData({
                      avatarUrl: _this.data.info.icon,
                      nickName: _this.data.info.nick_name,
                      loginStatus: true
                    })
  
                    $Toast({
                      content: '登录成功',
                      icon: 'success',
                      duration: 0,
                      mask: false
                    });
  
                    wx.setStorageSync('token', _this.data.token);
                    wx.setStorageSync('openid', _this.data.openid);
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 1];
                    $Toast.hide();
                    prevPage.onLoad();
  
  
                  }
                } else {
                  wx.showToast({
                    title: result.data.msg,
                    icon: 'none'
                  })
                }
              },
            })
          }
        }
      })

    } else {
      $Toast({
        content: '已退出登录',
        icon: 'success',
        duration: 0,
        mask: false
      });
      setTimeout(() => {
        wx.removeStorageSync('token');
        $Toast.hide();
        this.setData({
          loginStatus: false,
        });
      }, 2000);

    }
  },
  // 我的功能跳转
  goMyFunction(e) {
    if (wx.getStorageSync('token')) {
      var name = e.currentTarget.dataset.name;
      if (name == 'location') {
        wx.setStorageSync("mySite", true);
        wx.navigateTo({
          url: "../" + name + "/" + name,
        });
      } else if (name == 'like') {
        wx.showToast({
          title: '商家已关闭此功能',
          icon: 'none'
        })
      } else if (name == 'newshot') {
        wx.showToast({
          title: '商家已关闭此功能',
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: "../" + name + "/" + name,
        });
      }

    } else {
      wx.navigateTo({
        url: '../my/myLogin',
      })
    }
  },
  goMyOrderFormList(e) {
    if (wx.getStorageSync('token')) {
      var index = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: "../orderFormList/allOrderFormList?index=" + index,
      });
    } else {
      wx.navigateTo({
        url: '../my/myLogin',
      })
    }
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
    let _this = this

    this.setData({
      token: wx.getStorageSync('token')?wx.getStorageSync('token'):'',
      avatarUrl: wx.getStorageSync('icon')?wx.getStorageSync('icon'):'',
      nickName: wx.getStorageSync('nick_name')?wx.getStorageSync('nick_name'):''
    })

    console.log(_this.data.token)

    if (_this.data.token != '') {
      wx.getUserInfo({
        success: function (res) {
          console.log(res)

          _this.setData({
            avatarUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName,
            loginStatus: true
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
    wx.getSetting({
      success(res) {
        console.log(res);

        if (res.authSetting['scope.userInfo'] == true) {

          wx.getUserInfo({
            success: function (res) {
              console.log(res)

              if (_this.data.token != '') {
                _this.setData({
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName,
                  loginStatus: true
                })
              }
            }
          })

        }
      }
    })
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