// pages/discounts/discounts.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    Tab: ['待使用', '已使用', '已过期'],
    couponList: [],
    usedcouponList: [],
    datedCouponList: [],
    
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
  },

  addBag() {
    wx.navigateTo({
      url: './getCoupon',
    })
  },

  // 时间戳转日期格式
  timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) +'-';
    var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
    var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
    var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) +':';
    var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
    return Y+M+D+h+m+s;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this

    let query = wx.createSelectorQuery().in(this)
    query.select('#tabCur').boundingClientRect((rect) => {
      if (rect) {
        let top = rect.top;
        this.setData({
          tabCurHeight: app.globalData.windowHeight - top,
        })
      }
    }).exec()
    query.select('#moneyBag').boundingClientRect((rect) => {
      if (rect) {
        this.setData({
          moneyBagHeight: rect.height
        })
      }
    }).exec()

    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/userCouponList',
      data: {
        token: wx.getStorageSync('token')
      },
      success: (res) => {

        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].reduce = Math.floor(res.data.data[i].reduce)
          res.data.data[i].achieve = Math.floor(res.data.data[i].achieve)
    
          res.data.data[i].created_time = new Date(parseInt(res.data.data[i].created_time) * 1000).toLocaleDateString()
          res.data.data[i].valid_period_time = _this.timestampToTime(res.data.data[i].valid_period_time)
          
        }

        _this.setData({
          couponLists: res.data.data
        })

        var current_time = Date.parse(new Date()).toString().substr(0,10);
        var couponList = []
        var datedCouponLists = []

        for (let i = 0; i < _this.data.couponLists.length; i++) {

          _this.data.couponLists[i].valid_period_time = Date.parse(new Date(_this.data.couponLists[i].valid_period_time)) / 1000;

          if (_this.data.couponLists[i].valid_period_time < current_time) {

            _this.data.couponLists[i].valid_period_time = _this.timestampToTime(_this.data.couponLists[i].valid_period_time)

            datedCouponLists.push(_this.data.couponLists[i]);

            _this.setData({
              datedCouponList: datedCouponLists
            })

          }else {

            _this.data.couponLists[i].valid_period_time = _this.timestampToTime(_this.data.couponLists[i].valid_period_time)

            couponList.push(_this.data.couponLists[i]);

            _this.setData({
              couponList: couponList
            })

          }

        }

        if (this.data.couponList.length > 1) {
          this.setData({
            moneyBag: true
          })
        }

        console.log(this.data.datedCouponList);
      },
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