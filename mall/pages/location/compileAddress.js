// pages/location/compileAddress.js
const { $Toast } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: '',
    name: '',
    phone: '',
    region: [],
    regions: '',
    address: '',
    modalName: null,
    detailAddress: '',
    default: false,
  },

  // 姓名 手机号
  consigneeName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  consigneePhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 地区地址
  RegionChange(e) {
    this.setData({
      region: e.detail.value,
      regions: e.detail.value
    })
    this.data.regions = this.data.regions.join("")
    console.log(this.data.regions);
  },
  addressInput(e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },
  // 默认地址
  defaultAddress(e) {
    this.setData({
      default: e.detail.value
    })
    console.log(this.data.default);

    var _this = this
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/userAddressDfault', 
      data: {
        token: wx.getStorageSync('token'),
        id: _this.data.id
      },
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      success (res) {
        console.log(res)
      }
    })
  },

  // 确认修改/删除地址
  affirm() {
    var _this = this
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/userAddressAddModify', 
      data: {
        token: wx.getStorageSync('token'),
        phone: _this.data.phone,   //手机号
        procince: _this.data.regions.substr(0,3),    //省份
        city: _this.data.regions.substr(3,3),    //城市
        area: _this.data.regions.substr(6,3),    //区县
        name: _this.data.name,    //收货人名称
        detailed: _this.data.detailAddress,    //详细地址
        address_id: _this.data.id,    //地址id
      },
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      success (res) {
        console.log(res)

        if (res.data.msg == '修改成功') {
          $Toast({
            content: res.data.msg,
            icon: 'success',
            duration: 0,
            mask: false
          });
          setTimeout(() => {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
  
            $Toast.hide();
            prevPage.onLoad();
            wx.navigateBack();
          }, 2000);
          console.log(res);
        }
      }
    })
  },
  remove() {

    var _this = this
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/userAddressDelete', 
      data: {
        token: wx.getStorageSync('token'),
        id: _this.data.id
      },
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      success (res) {
        console.log(res);

        $Toast({
          content: '删除成功',
          icon: 'success',
          duration: 0,
          mask: false
        });
        setTimeout(() => {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];

          $Toast.hide();
          prevPage.onLoad();
          wx.navigateBack();
        }, 2000);

      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id: options.id,
      name: options.name,
      phone: options.phone,
      address: options.address,
      index: options.index,
      region: [options.procince, options.city, options.area],
      regions: options.procince + options.city + options.area,
      detailAddress: options.detailed
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