// pages/info/info.js
const app = getApp()
const apiServer = require('../../utils/requests')
const WxParse = require('../../wxParse/wxParse')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    TabCur: 0,
    topNav: [
      { name: '商品' },
      { name: '详情' },
      { name: '推荐' }
    ],
    scrollView: '',
    tabShow: false,
    goodsInfo: {},
    imgs: [],
    coupons: [],
    spu: [],
    sku: [],
    skuIndex: 0,
    num: 1,
    statusBarHeight: 0,
    navTop: 0,
    navHeight: 0,
    showShadow: false,
    chooseMoreBottom: '-100%',
    chooseCouponBottom: '-100%',
    clickFlag: true
  },
  BackPage() {
    wx.navigateBack({
      delta: 1
    });
  },
  changeNum(e) {
    if (e.currentTarget.dataset.num != 0) {
      this.setData({
        num: e.currentTarget.dataset.num
      })
    }
  },
  openChooseMoreBox(e) {
    if (e.currentTarget.dataset.flag == 'true') {
      this.setData({
        showShadow: true,
        chooseMoreBottom: '0'
      })
    } else {
      this.setData({
        showShadow: false,
        chooseMoreBottom: '-100%'
      })
    }
  },
  openChooseCouponBox(e) {
    if (e.currentTarget.dataset.flag == 'true') {
      this.setData({
        showShadow: true,
        chooseCouponBottom: '0'
      })
    } else {
      this.setData({
        showShadow: false,
        chooseCouponBottom: '-100%'
      })
    }
  },
  changeSku(e) {
    this.setData({
      skuIndex: e.currentTarget.dataset.index,
      num: 1
    })
  },
  tabSelect(e) {
    if (e.currentTarget.dataset.id == 0) {
      this.setData({
        scrollView: 'goodsImgContent'
      })
    } else if (e.currentTarget.dataset.id == 1) {
      this.setData({
        scrollView: 'briefContent'
      })
    } else if (e.currentTarget.dataset.id == 2) {
      this.setData({
        scrollView: 'recommendContent'
      })
    }
  },
  scroll(e) {
    this.setData({
      tabShow: e.detail.scrollTop >= 200 ? true : false
    })
    if (e.detail.scrollTop < this.data.briefContentTop) {
      this.setData({
        TabCur: 0
      })
    } else if (e.detail.scrollTop >= this.data.briefContentTop && e.detail.scrollTop < this.data.recommendContentTop) {
      this.setData({
        TabCur: 1
      })
    } else {
      this.setData({
        TabCur: 2
      })
    }
  },
  gotoHome() {
    wx.switchTab({
      url: '../home/home',
    })
  },
  gotoCart() {
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  getCoupon(e) {
    console.log(e.currentTarget.dataset.id)
    console.log(wx.getStorageSync('token'));
    if (wx.getStorageSync('token')) {
      let param = {
        token: wx.getStorageSync('token'),
        coupon_id: e.currentTarget.dataset.id
      }
      apiServer.userCouponAdd(param).then(res => {
        if (res.data.code == 2010) {
          wx.showToast({
            title: '不可重复领取',
            icon: 'error'
          })
        } else {
          wx.showToast({
            title: res.data.msg
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../my/myLogin',
      })
    }

  },
  addToCart() {
    if(this.data.clickFlag) {
      this.setData({
        clickFlag: false
      })
      if (wx.getStorageSync('token')) {
        let param = {
          token: wx.getStorageSync('token'),
          good_id: this.data.goodsInfo.good_id,
          num: this.data.num,
          price: this.data.sku[this.data.skuIndex].price,
          money: this.data.num * this.data.sku[this.data.skuIndex].price,
          sku: this.data.sku[this.data.skuIndex]
        }
  
        this.data.cartList.data.forEach(e => {
          if (this.data.goodsInfo.good_id == e.good_id && this.data.sku[this.data.skuIndex].sku == JSON.parse(e.sku).sku) {
            param.num = this.data.num + e.num
            param.money = param.num * param.price
            param.shopping_car_id = e.shopping_car_id
          }
        })
        apiServer.shoppingCarAddModify(param).then(res => {
          if (res.data.code == 2000) {
            this.setData({
              clickFlag: true
            })
            wx.showToast({
              title: '已添加至购物车',
            })
            let param = {
              token: wx.getStorageSync('token')
            }
  
            apiServer.getCartList(param).then(res => {
              console.log(res)
              if (res.data.code == 2000) {
                this.setData({
                  cartList: res.data.data
                })
              }
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '../my/myLogin',
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let param = {
      good_id: options.id
    }
    apiServer.getGoodInfo(param).then(res => {
      let obj = res.data.data

      obj.price = res.data.data.price.split('.')
      let imgs = JSON.parse(obj.info[0].imgs)
      let colour = JSON.parse(obj.info[0].colour)
      let edition = JSON.parse(obj.info[0].edition)
      let info = JSON.parse(obj.info[0].info)


      this.setData({
        goodsInfo: obj,
        imgs: imgs,
        spu: colour,
        sku: edition,
        info: info
      })

      let _self = this
      WxParse.wxParse('info_html', 'html', _self.data.info, _self, 5)

      apiServer.getCouponList().then(res => {
        if (res.data.code == 2000) {
          let result = res.data.data.filter(e => this.data.goodsInfo.type_id == e.type_id)
          result.forEach(e => {
            e.achieve = parseInt(e.achieve)
            e.reduce = parseInt(e.reduce)
            e.created_time = new Date(parseInt(e.created_time * 1000)).toLocaleDateString()
            e.valid_period_time = new Date(parseInt(e.valid_period_time * 1000)).toLocaleDateString()
          })
          this.setData({
            coupons: result.reverse()
          })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      })

      let param = {
        token: wx.getStorageSync('token')
      }

      apiServer.getCartList(param).then(res => {
        console.log(res)
        if (res.data.code == 2000) {
          this.setData({
            cartList: res.data.data
          })
        }
      })

      let query = wx.createSelectorQuery().in(this)
      query.select('#goodsInfoContent').boundingClientRect((rect) => {
        if (rect) {
          let top = rect.top
          this.setData({
            goodsInfoContentHeight: app.globalData.screenHeight - top
          })
        }
      }).exec()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let query = wx.createSelectorQuery().in(this)
    query.select('#briefContent').boundingClientRect((rect) => {
      if (rect) {
        let top = rect.top
        this.setData({
          briefContentTop: top
        })
      }
      query.select('#recommendContent').boundingClientRect((rect) => {
        if (rect) {
          let top = rect.top
          this.setData({
            recommendContentTop: top
          })
        }
      }).exec()
    }).exec()

    this.setData({
      statusBarHeight: app.globalData.statusBarHeight
    })
    this.setData({
      navTop: app.globalData.navTop
    })
    this.setData({
      navHeight: app.globalData.navHeight
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let param = {
      token: wx.getStorageSync('token')
    }
    apiServer.getCartList(param).then(res => {
      console.log(res)
      if (res.data.code == 2000) {
        this.setData({
          cartList: res.data.data
        })
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