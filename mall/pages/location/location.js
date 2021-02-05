// pages/location/location.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
  },
  // 地址信息 微信导入/新增地址/编辑
  addressLead() {
    var _this = this

    wx.chooseAddress({
      success (res) {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 1];

        prevPage.setData({
          phone: res.telNumber,
          procince: res.provinceName,
          city: res.cityName,
          area: res.countyName,
          name: res.userName,
          detailed: res.detailInfo,
        })

        wx.request({
          url: 'http://api_devs.wanxikeji.cn/api/userAddressAddModify', 
          data: {
            token: wx.getStorageSync('token'),
            phone: _this.data.phone,   //手机号
            procince: _this.data.procince,    //省份
            city: _this.data.city,    //城市
            area: _this.data.area,    //区县
            name: _this.data.name,    //收货人名称
            detailed: _this.data.detailed,    //详细地址
          },
          header: {
            'content-type': 'application/json',
          },
          method: 'POST',
          success (res) {
            prevPage.onLoad();
          }
        })

      }
    })
  },
  addressAdd() {
    wx.navigateTo({
      url: './addAddress',
    })
  },
  // 跳转订单页面
  orderPage(item) {
    wx.setStorageSync("site", item.currentTarget.dataset.site);
    if (!wx.getStorageSync('mySite')) {
      wx.navigateTo({
        url: "./../orderForm/orderForm",
      });
    }
  },

  delMySite() {
    wx.removeStorageSync('mySite')
  },
  
  addressCompile(e) {
    console.log(e.currentTarget.dataset.info);
    var info = e.currentTarget.dataset.info
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: './compileAddress?name='+info.name+'&phone='+info.phone+'&procince='+info.procince+'&city='+info.city+'&area='+info.area+'&detailed='+info.detailed+'&default='+info.default+'&id='+info.address_id+'&index='+index,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    let query = wx.createSelectorQuery().in(this);
    query.select('#addressInfo').boundingClientRect((rect) => {
      let top = rect.top
      this.setData({
        addressInfoHeight: app.globalData.screenHeight - top
      })
    }).exec();

    query.select('#addAddress').boundingClientRect((rect) => {
      if (rect) {
        this.setData({
          addAddressHeight: rect.height
        })
      }
    }).exec()

    if (!wx.getStorageSync('token')) {
      $Toast({
        content: '用户未登录',
        icon: 'prompt',
        duration: 0,
        mask: false
      });
      setTimeout(() => {
        $Toast.hide();
        wx.navigateTo({
          url: '../my/my',
        })
      }, 3000);
    }

    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/userAddressList', 
      data: {
        token: wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      success (res) {

        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].address = res.data.data[i].procince + res.data.data[i].city + res.data.data[i].area + res.data.data[i].detailed
        }

        _this.setData({
          addressList: res.data.data
        })

        console.log(_this.data.addressList);
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