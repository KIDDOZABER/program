const app = getApp()
Component({
  /**
   * 组件的一些选项
   */
  options: {
    multipleSlots: true //允许多个插槽
  },

 
  data: {
    navTop: '',
    navHeight: '',
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
    // this.setData({
    //   share: app.globalData.share
    // })
    // 定义导航栏的高度   方便对齐
    this.setData({
      navTop: app.globalData.navTop
    })
    this.setData({
      navHeight: app.globalData.navHeight
    })
  },
  methods: {
    BackPage() {
      wx.navigateBack({
        delta: 1
      });
    }
  }

}) 