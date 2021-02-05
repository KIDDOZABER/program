// pages/addAddress/addAddress.js
const { $Toast } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    region: ['北京市', '北京市', '朝阳区'],
    regions: '北京市北京市朝阳区',
    modalName: null,
    detailAddress: '',
    default: false,
  },
  // 姓名 手机号
  consigneeName(e) {
    this.setData({
      name: e.detail.value
    })
    console.log(this.data.name);
  },
  consigneePhone(e) {
    this.setData({
      phone: e.detail.value
    })
    console.log(this.data.phone);
  },
  // 地区地址
  RegionChange(e) {
    this.setData({
      region: e.detail.value,
      regions: e.detail.value
    })
    this.data.regions = this.data.regions.join("")
  },
  addressInput(e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },
  // defaultAddress(e) {
  //   this.setData({
  //     default: e.detail.value
  //   })
  // },
  submitAddress() {
    var _this = this
    console.log(_this.data.regions);
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
      },
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      success (res) {
        console.log(res);

        if (res.data.msg == '新增成功') {
          $Toast({
            content: '新增成功',
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
        } else {
          $Toast({
            content: res.data.msg,
            type: 'warning'
          });
        }

      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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