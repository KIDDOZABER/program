// pages/orderFormList/allOrderFormList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 3,
    Tab: ['待付款', '待收货', '待评价', '全部订单'],
    allOrdersList: [],    // 全部订单
    payOrdersList: [],    // 待付款
    takeOrdersList: [],   // 待收货
    refOrdersList: [],    // 待评价
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
  },
  gotoPl() {
    wx.showToast({
      title: '商家已关闭评论功能',
      icon: 'none'
    })
  },
  gotoInfo(e) {
    wx.navigateTo({
      url: '../info/info?id=' + e.currentTarget.dataset.id,
    })
  },
  buyAgain(e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    let children = item.childern
    console.log(children)
    let orderForm = []
    let shopping_car_ids = JSON.parse(item.shopping_car_ids)
    shopping_car_ids.forEach((e,i) => {
      orderForm.push({
        shopping_car_id: e,
        user_id: children[i].user_id,
        good_id: children[i].good_id,
        num: children[i].num,
        price: children[i].price,
        money: children[i].money,
        sku: JSON.parse(children[i].sku),
        good_name: children[i].good_name,
        img: children[i].img
      })
    })
    console.log(orderForm)
    wx.setStorageSync('orderform', orderForm)
    wx.navigateTo({
      url: '../orderForm/orderForm',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      TabCur: options.index
    })

    let query = wx.createSelectorQuery().in(this)
    query.select('#tabCur').boundingClientRect((rect) => {
      if (rect) {
        let top = rect.top;
        this.setData({
          tabCurHeight: app.globalData.windowHeight - top,
        })
      }
    }).exec()

    var _this = this
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/orderList',
      data: {
        token: wx.getStorageSync('token'),
      },
      success(res) {
        console.log(res);
        var notpayOrdersList = []

        for (let i = 0; i < res.data.data.data.length; i++) {

          if (res.data.data.data[i].status == "1") {
            res.data.data.data[i].status = "未付款"

            notpayOrdersList.push(res.data.data.data[i])

            _this.setData({
              payOrdersList: notpayOrdersList
            })
          } else if (res.data.data.data[i].status == "2" || res.data.data.data[i].status == "5") {
            res.data.data.data[i].status = "已付款"
          }
        }

        _this.setData({
          allOrdersList: res.data.data.data
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