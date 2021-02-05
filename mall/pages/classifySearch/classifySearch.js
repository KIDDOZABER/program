// pages/search/search.js
const app = getApp();
const apiServer = require("../../utils/requests");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    searchFlag: false,
    recordFlag: true,
    searchList: [],
    searchContent: "",
    page: 1,
    size: 10,
    isLoad: true,
    recordList: [
      { name: "记录1" },
      { name: "记录2" },
      { name: "记录3" },
      { name: "记录4" },
      { name: "记录5" },
      { name: "记录6" },
      { name: "记录7" },
    ],
    hotList: [{ name: "沙发" }, { name: "车厘子" }, { name: "荣耀" }],
  },
  scrollToBottom: function (e) {
    if (this.data.num <= 20) {
      setTimeout(() => {
        this.setData({
          num: this.data.num + 5,
        });
      }, 1000);
    } else {
      setTimeout(() => {
        this.setData({
          isLoad: false,
        });
      }, 1000);
    }
  },
  isLoading: function (e) {
    this.setData({
      isLoad: e.detail.value,
    });
  },
  clearRecord() {
    this.setData({
      recordList: [],
      recordFlag: false,
    });
  },
  setSearchContent(e) {
    this.setData({
      searchContent: e.detail.value,
    });
    if (this.data.searchContent == "") {
      this.setData({
        searchFlag: false,
      });
    }
  },
  search() {
    this.setData({
      searchList: [],
      isLoad: true,
    });

    let param = {
      search: this.data.searchContent,
      page: this.data.page,
      size: this.data.size,
    };
    apiServer.getGoodList(param).then((res) => {
      console.log(res);
      if (res.data.code == 2000) {
        let result = res.data.data.data.filter((e) =>
          /^ktpd/.test(e.good_name)
        );
        result.forEach((e) => {
          this.getGoodsInfo(e);
        });
        this.setData({
          searchFlag: true,
        });
        if (res.data.data.count < this.data.size) {
          this.setData({
            isLoad: false,
          });
        }
      }
    });
  },
  async getGoodsInfo(goods) {
    let param = {
      good_id: goods.good_id,
    };
    await apiServer.getGoodInfo(param).then((res) => {
      let goodsArray = [...this.data.searchList];
      if (res.data.code == 2000) {
        let result = res.data.data;
        result.price = res.data.data.price.split(".");
        let tip = JSON.parse(result.info[0].colour);
        result.tip = [];
        for (let key in tip) {
          result.tip.push({
            label: key,
            value: tip[key],
          });
        }
        goodsArray.push(result);
        this.setData({
          searchList: goodsArray,
        });
      }
    });
  },
  clickHot(e) {
    this.setData({
      searchContent: e.currentTarget.dataset.hot,
    });
    console.log(e);
    this.search();
  },
  gotoInfo(e) {
    wx.navigateTo({
      url: "../info/info?id=" + e.currentTarget.dataset.id,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ title: options.title });
    console.log(options);
    let query = wx.createSelectorQuery().in(this);
    query
      .select("#searchContent")
      .boundingClientRect((rect) => {
        if (rect) {
          let top = rect.top;
          this.setData({
            searchContentHeight: app.globalData.screenHeight - top,
          });
        }
      })
      .exec();
    query
      .select("#searchRecord")
      .boundingClientRect((rect) => {
        if (rect) {
          let top = rect.top;
          this.setData({
            searchRecordHeight: app.globalData.screenHeight - top,
          });
        }
      })
      .exec();

    apiServer.getGoodType().then((res) => {
      if (res.data.code == 2000) {
        let re = new RegExp("^.*" + "ktpd" + options.title + ".*$");
        let result = res.data.data.filter((e) => re.test(e.type_name));
        result.forEach((item) => {
          res.data.data.forEach((ite) => {
            if (ite.parent_id == item.good_type_id) {
              let param = {
                good_type: ite.good_type_id,
                page: this.data.page,
                size: this.data.size,
              };
              apiServer.getGoodList(param).then((res) => {
                if (res.data.code == 2000) {
                  this.data.searchList.push(res.data.data.data[0]);
                  this.setData({
                    searchList: this.data.searchList,
                  });
                 }
                if (res.data.data.count < this.data.size) {
                  this.setData({
                    isLoad: false
                  })
                }
              });
            }
          });
        });
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
