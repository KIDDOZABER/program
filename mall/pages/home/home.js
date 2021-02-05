// pages/basics/home/home.js
const app = getApp();
const apiServer = require("../../utils/requests");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardCur: 0,
    swiperList: [], //轮播图数据
    homecClassify: [
      {
        title: "生鲜",
        url: "https://s3.ax1x.com/2021/01/20/sWHwq0.png",
      },
      {
        title: "手机",
        url: "https://s3.ax1x.com/2021/01/20/sWHyiF.png",
      },
      {
        title: "银饰",
        url: "https://s3.ax1x.com/2021/01/20/sWHcRJ.png",
      },

      {
        title: "电脑",
        url: "https://s3.ax1x.com/2021/01/20/sWHRMR.png",
      },
      {
        title: "服饰",
        url: "https://s3.ax1x.com/2021/01/20/sWHfqx.png",
      },
      {
        title: "家电",
        url: "https://s3.ax1x.com/2021/01/20/sWHTiD.png",
      },
      {
        title: "美妆",
        url: "https://s3.ax1x.com/2021/01/20/sWHbzd.png",
      },
    ],
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value,
    });
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current,
    });
  },
  gotoSearch() {
    wx.navigateTo({
      url: "../search/search",
    });
  },
  ClassifySkip(e) {
    let title = e.currentTarget.dataset.item.title;
    console.log(title);
    wx.navigateTo({
      url: "../classifySearch/classifySearch?title=" + title,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let query = wx.createSelectorQuery().in(this);
    query
      .select("#homeContent")
      .boundingClientRect((rect) => {
        let top = rect.top;
        this.setData({
          homeContentHeight: app.globalData.windowHeight - top,
        });
        console.log(this.data.homeContentHeight);
      })
      .exec();
    this.setData({
      navHeight: app.globalData.navHeight,
    });
    //请求商品列表
    apiServer.getBannerList().then((res) => {
      if (res.data.code == 2000) {
        this.setData({ swiperList: res.data.data });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
