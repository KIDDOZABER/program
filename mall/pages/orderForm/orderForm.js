// pages/orderForm/orderForm.js
const app = getApp();
const apiServer = require("../../utils/requests");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isSite: true, //收货地址是否存在显示
    siteShow: {}, //地址显示对象
    defaultSite: true, //显示默认地址
    totalPrice: 0, //总价
    payPrice: 0, //支付金额
    reducedPrice: 0, //优惠金额
    orderList: [], //订单详情列表
    typeList: [], //订单对应的分类列表
    shoppingCarIds: [], //购物车id合集
    //优惠券
    isCoupons: true, //可用优惠券
    coupons: [],
    chooseCouponBottom: "-100%",
    clickFlag: true
  },
  // 获取地址
  getSite() {
    wx.navigateTo({
      url: "../location/location",
    });
  },
  //领券按钮弹框
  openChooseCouponBox(e) {
    if (e.currentTarget.dataset.flag == "true") {
      this.setData({
        showShadow: true,
        chooseCouponBottom: "0",
      });
    } else {
      this.setData({
        showShadow: false,
        chooseCouponBottom: "-100%",
      });
    }
  },
  //生成订单
  result() {
    if (this.data.clickFlag) {
      this.setData({
        clickFlag: false
      })

      if (
        wx.getStorageSync("site") ||
        JSON.stringify(this.data.siteShow) != "{}"
      ) {
        console.log(1);
        let param = {
          token: wx.getStorageSync("token"),
          address_id: this.data.siteShow.address_id,
          money: this.data.totalPrice,
          shopping_car_ids: this.data.shoppingCarIds,
        };
        apiServer.getGenerateOrder(param).then((res) => {
          if (res.data.code == 2000) {
            this.data.shoppingCarIds.forEach(id => {
              let param = {
                token: wx.getStorageSync("token"),
                shopping_car_id: id
              }
              apiServer.getShoppingCarDelete(param)
            })
            wx.requestPayment({
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonce_str,
              package: "prepay_id=" + res.data.data.prepay_id,
              paySign: res.data.data.paySign,
              signType: "MD5",
              success: (result) => {
                this.setData({
                  clickFlag: true
                })
                wx.setStorageSync("totalMoney", this.data.payPrice); //缓存付款金额
                wx.navigateTo({
                  url: "../paySuccess/paySuccess",
                });
              },
              fail: (e) => {
                this.setData({
                  clickFlag: true
                })
                wx.showToast({
                  title: "支付失败",
                  icon: "error",
                });
                wx.navigateTo({
                  url: "../orderFormList/allOrderFormList?index=0",
                });
              },
            });
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
            });
          }
        });
      } else {
        wx.showToast({
          title: "请选择收获地址",
          icon: "none",
        });
      }

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面滑动
    let query = wx.createSelectorQuery().in(this);
    query
      .select("#cartOp")
      .boundingClientRect((rect) => {
        let height = rect.height;

        query
          .select("#orderBox")
          .boundingClientRect((rect) => {
            let top = rect.top;
            this.setData({
              orderHeight: app.globalData.screenHeight - top - height,
            });
            // console.log(this.data.orderHeight);
          })
          .exec();
      })
      .exec();


    if (wx.getStorageSync("token")) {
      //获取缓存订单列表
      this.setData({ orderList: wx.getStorageSync("orderform") });
      //购物车id合集
      this.data.orderList.forEach((item) => {
        this.data.shoppingCarIds.push(item.shopping_car_id);
      });
      //总价
      let totalPrice = 0;
      this.data.orderList.forEach((item) => {
        totalPrice = totalPrice + item.sku.price * item.num;
      });
      this.setData({ totalPrice: totalPrice });
      //请求商品分类
      this.data.orderList.forEach((item) => {
        let param = {
          good_id: item.good_id,
        };
        apiServer.getGoodInfo(param).then((res) => {
          if (item.good_id == res.data.data.good_id) {
            item.type_id = res.data.data.type_id;
          }
        });
      });
      //请求用户优惠券列表接口
      let param = {
        token: wx.getStorageSync("token"),
      };
      apiServer.getUerCouponList(param).then((res) => {
        console.log(res.data.data);
        //过滤出当前页面商品分类有的优惠券
        let usableCoupon = [];
        this.data.orderList.forEach((item) => {
          res.data.data.forEach((e) => {
            if (item.type_id == e.type_id) {
              usableCoupon.push(JSON.parse(JSON.stringify(e)));
            }
          });
        });
        if (usableCoupon.length != 0) {
          this.setData({ isCoupons: true });
          //过滤出大于等于当前时间的数据
          usableCoupon = usableCoupon.filter(
            (e) => e.valid_period_time >= parseInt(new Date().getTime() / 1000)
          );
          console.log();
          usableCoupon.forEach((e) => {
            e.achieve = parseInt(e.achieve);
            e.reduce = parseInt(e.reduce);
            e.created_time = new Date(
              parseInt(e.created_time * 1000)
            ).toLocaleDateString();
            e.valid_period_time = new Date(
              parseInt(e.valid_period_time * 1000)
            ).toLocaleDateString();
          });
          this.setData({ coupons: usableCoupon.reverse() });
          console.log(this.data.coupons);
          //优惠金额
          this.data.coupons.forEach((e) => {
            if (
              this.data.totalPrice >= e.achieve &&
              this.data.reducedPrice <= e.reduce
            ) {
              this.setData({ reducedPrice: e.reduce });
            }
          });
        } else {
          this.setData({ isCoupons: false });
        }
        //支付金额
        this.setData({
          payPrice: this.data.totalPrice - this.data.reducedPrice,
        });
      });

      // 地址显示
      if (wx.getStorageSync("site")) {
        this.setData({
          siteShow: wx.getStorageSync("site"),
        });
        this.setData({ isSite: false });
        //默认地址显示
        if (this.data.siteShow.default == false) {
          this.setData({ defaultSite: false });
        } else {
          this.setData({ defaultSite: true });
        }
      } else {
        let _this = this;
        wx.request({
          url: "http://api_devs.wanxikeji.cn/api/userAddressList",
          data: {
            token: wx.getStorageSync("token"),
          },
          header: {
            "content-type": "application/json",
          },
          method: "POST",
          success(res) {
            console.log(res.data.data)
            res.data.data = res.data.data.filter((e) => e.default == 1); //过滤出默认地址
            console.log(res.data.data)

            if (res.data.code == 2000 && res.data.data.length != 0) {
              var siteshow = res.data.data[0];
              //地址拼接
              siteshow.address =
                siteshow.procince +
                siteshow.city +
                siteshow.area +
                siteshow.detailed;
              //页面显示
              _this.setData({ siteShow: siteshow });
              _this.setData({ isSite: false });
              _this.setData({ defaultSite: true });
            } else {
              _this.setData({ isSite: true });
            }
          },
        });
      }
    } else {
      wx.navigateTo({
        url: "../my/myLogin",
      });
      wx.showToast({
        title: "请登录",
        icon: "error",
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
});
