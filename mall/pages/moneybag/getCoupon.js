// pages/moneybag/getCoupon.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getCouponList: []
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

  getCoupon(e) {

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    
    var couponList = []
    couponList.push(this.data.getCouponList[e.currentTarget.dataset.index])

    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/userCouponAdd',
      data: {
        token: wx.getStorageSync('token'),
        coupon_id: couponList[0].coupon_id
      },
      success: (res) => {
        console.log(res);
      },
    })
  
    prevPage.onLoad();
  
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let query = wx.createSelectorQuery().in(this);
    query.select('#getcoupon').boundingClientRect((rect) => {
      let top = rect.top
      this.setData({
        getcouponHeight: app.globalData.screenHeight - top
      })
    }).exec();


    var _this = this
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/couponList', 
      data: {
      },
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      success (res) {

        console.log(res);

        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].reduce = Math.floor(res.data.data[i].reduce)
          res.data.data[i].achieve = Math.floor(res.data.data[i].achieve)
    
          res.data.data[i].created_time = new Date(parseInt(res.data.data[i].created_time) * 1000).toLocaleDateString()
          res.data.data[i].valid_period_time = _this.timestampToTime(res.data.data[i].valid_period_time)
          
        }

        _this.setData({
          getCouponList: res.data.data
        })
        
      }
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