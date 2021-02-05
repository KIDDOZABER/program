// pages/search/search.js
const app = getApp();
const apiServer = require('../../utils/requests')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchFlag: false,
    recordFlag: false,
    searchList: [],
    searchContent: '',
    page: 1,
    size: 10,
    isLoad: true,
    count: 0,
    recordList: [
      // { name: '记录1' },
      // { name: '记录2' },
      // { name: '记录3' },
      // { name: '记录4' },
      // { name: '记录5' },
      // { name: '记录6' },
      // { name: '记录7' }
    ],
    hotList: [
      { name: '沙发' },
      { name: '车厘子' },
      { name: '荣耀' }
    ]
  },
  scrollToBottom: function (e) {
    if (this.data.searchList.length < this.data.count) {
      setTimeout(() => {
        this.setData({
          page: this.data.page + 1
        })
        let param = {
          search: this.data.searchContent,
          page: this.data.page,
          size: this.data.size
        }
        apiServer.getGoodList(param).then(res => {
          if (res.data.code == 2000) {
            let result = res.data.data.data.filter(e => /^ktpd/.test(e.good_name))
            result.forEach(e => {
              this.getGoodsInfo(e)
            })
          }
        })
      }, 1000)
    } else {
      setTimeout(() => {
        this.setData({
          isLoad: false
        })
      }, 1000)
    }
  },
  isLoading: function (e) {
    this.setData({
      isLoad: e.detail.value
    })
  },
  clearRecord() {
    this.setData({
      recordList: [],
      recordFlag: false
    })
    wx.removeStorageSync('recordList')
  },
  setSearchContent(e) {
    this.setData({
      searchContent: e.detail.value
    })
    if (this.data.searchContent == '') {
      this.setData({
        searchFlag: false
      })
    }
  },
  search() {
    if (this.data.searchContent) {
      let list = [...this.data.recordList]
      if(list.every(e=>e.name!=this.data.searchContent)) {
        list.push({
          name: this.data.searchContent
        })
      }
      wx.setStorageSync('recordList', JSON.stringify(list))
      this.setData({
        recordFlag: true,
        searchList: [],
        isLoad: true,
        count: 0,
        recordList: list
      })

      let param = {
        search: this.data.searchContent,
        page: this.data.page,
        size: this.data.size
      }
      apiServer.getGoodList(param).then(res => {
        if (res.data.code == 2000) {
          let result = res.data.data.data.filter(e => /^ktpd/.test(e.good_name))
          result.forEach(e => {
            this.getGoodsInfo(e)
          })
          this.setData({
            count: res.data.data.count,
            searchFlag: true
          })
          if (res.data.data.count < this.data.size) {
            this.setData({
              isLoad: false
            })
          }
        }
      })
    }

  },
  async getGoodsInfo(goods) {
    let param = {
      good_id: goods.good_id
    }
    await apiServer.getGoodInfo(param).then(res => {
      let goodsArray = [...this.data.searchList]
      if (res.data.code == 2000) {
        let result = res.data.data
        result.price = res.data.data.price.split('.')
        let tip = JSON.parse(result.info[0].colour)
        result.tip = []
        for (let key in tip) {
          result.tip.push({
            label: key,
            value: tip[key]
          })
        }
        goodsArray.push(result)
        this.setData({
          searchList: goodsArray
        })
      }
    })
  },
  clickHot(e) {
    this.setData({
      searchContent: e.currentTarget.dataset.hot
    })
    this.search()
  },
  gotoInfo(e) {
    wx.navigateTo({
      url: '../info/info?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let query = wx.createSelectorQuery().in(this)
    query.select('#searchContent').boundingClientRect((rect) => {
      if (rect) {
        let top = rect.top
        this.setData({
          searchContentHeight: app.globalData.screenHeight - top
        })
      }
    }).exec()
    query.select('#searchRecord').boundingClientRect((rect) => {
      if (rect) {
        let top = rect.top
        this.setData({
          searchRecordHeight: app.globalData.screenHeight - top
        })
      }
    }).exec()

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
    if (wx.getStorageSync('recordList')) {
      this.setData({
        recordList: JSON.parse(wx.getStorageSync('recordList')).reverse(),
        recordFlag: true
      })
      console.log(this.data.recordList)
    }
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