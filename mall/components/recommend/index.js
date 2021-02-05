const app = getApp();
const apiServer = require("../../utils/requests");
Component({
  data: {
    likeData: [],
  },
  attached: function () {},
  methods: {
    gotoInfo(e) {
      wx.navigateTo({
        url: '../../pages/info/info?id=' + e.currentTarget.dataset.id,
      })
    }
  },

  // 生命周期函数--监听页面加载
  // 在组件实例进入页面节点树时执行
  attached: function () {
    //请求商品列表
    apiServer.getGoodList({size:50}).then((res) => {
      if (res.data.code == 2000) {
        res.data.data.data = res.data.data.data.filter((item) =>
          /^ktpd/.test(item.good_name)
        );
        // console.log(res.data.data.data);
        this.setData({ likeData: res.data.data.data });
      }
    });
  },
});
