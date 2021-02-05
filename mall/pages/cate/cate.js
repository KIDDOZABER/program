// pages/component/home/home.js
const app = getApp();
const apiServer = require("../../utils/requests"); //
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cateIndex: 0,
    stairClassify: [], //一级分类
    twoClassify: "", //二级分类
    classifyData: [], //商品分类
  },
  gotoSearch() {
    wx.navigateTo({
      url: "../search/search",
    });
  },
  clickCate(e) {
    console.log(e);
    this.setData({
      cateIndex: e.currentTarget.dataset.index,
    });
  },
  //页面跳转到详情页面
  gotoInfo(e) {
    wx.navigateTo({
      url: "../info/info?id=" + e.currentTarget.dataset.id,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let query = wx.createSelectorQuery().in(this);
    query
      .select("#cateAll")
      .boundingClientRect((rect) => {
        let top = rect.top;
        this.setData({
          cateContentHeight: app.globalData.windowHeight - top,
        });
        console.log(this.data.cateContentHeight);
      })
      .exec();

    var that = this;
    // 商品分类
    apiServer.getGoodType().then((res) => {
      //过滤
      res.data.data = res.data.data.filter((item) =>
        /^ktpd/.test(item.type_name)
      );
      //列表分成
      let stair = [];
      res.data.data.forEach((item) => {
        if (item.parent_id == 0) {
          stair.push(item); //一级分类
        } else {
          stair.forEach((ite) => {
            if (ite.good_type_id == item.parent_id) {
              if (!ite.children) {
                ite.children = [];
              }
              ite.children.push(item); //二级分类
              //商品列表
              ite.children.forEach((e) => {
                //请求商品列表
                let goodlist = {
                  good_type: e.good_type_id,
                };
                apiServer.getGoodList(goodlist).then((re) => {
                  if (re.data.code == 2000) {
                    if (!e.children) {
                      e.children = [];
                    }
                    e.children = re.data.data.data;
                    that.setData({ classifyData: stair });
                  }
                });
              });
            }
          });
        }
      });
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
