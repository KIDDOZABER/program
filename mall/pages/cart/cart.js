// pages/plugin/home/home.js
const app = getApp();
const apiServer = require("../../utils/requests");
const { $Toast } = require("../../dist/base/index");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: false, //判断购物车是否为空
    editDel: true, //编辑
    selectedAll: false,
    totalPrice: 0,
    totalNum: 0,
    cartList: [
      {
        selected: false,
        img: "",
        title: "商品名字",
        price: 36,
        num: 1,
      },
      {
        selected: false,
        img: "",
        title: "商品名字",
        price: 100,
        num: 1,
      },
      {
        selected: false,
        img: "",
        title: "商品名字",
        price: 6,
        num: 1,
      },
      {
        selected: false,
        img: "",
        title: "商品名字",
        price: 8,
        num: 1,
      },
      {
        selected: false,
        img: "",
        title: "商品名字",
        price: 10,
        num: 1,
      },
    ], //购物车列表
    selectedData: [], //已选数据
  },
  //选框操作
  checkboxChange: function (e) {
    console.log(e);
    // this.data.selectedData.push(e.currentTarget.dataset.item); //已选数据
    let value = e.currentTarget.dataset;
    let index = value.index;
    let selected = value.selected;
    let one_selected = "cartList[" + index + "].selected";
    this.setData({
      [one_selected]: !selected,
    });
    this.calculateTotalPrice(
      !selected,
      this.data.cartList[index].price,
      this.data.cartList[index].num
    );
    this.calculateTotalNum(!selected, this.data.cartList[index].num);
    let flag = this.data.cartList.some((e) => e.selected == false);
    if (!flag) {
      this.setData({
        selectedAll: true,
      });
    } else {
      this.setData({
        selectedAll: false,
      });
    }
  },
  checkAllChange: function () {
    this.setData({
      selectedAll: !this.data.selectedAll,
    });
    this.setData({
      totalPrice: 0,
      totalNum: 0,
    });
    this.data.cartList.forEach((e, i) => {
      let one_selected = "cartList[" + i + "].selected";
      this.setData({
        [one_selected]: this.data.selectedAll,
      });
      if (this.data.selectedAll) {
        this.calculateTotalPrice(
          this.data.selectedAll,
          this.data.cartList[i].price,
          this.data.cartList[i].num
        );
        this.calculateTotalNum(
          this.data.selectedAll,
          this.data.cartList[i].num
        );
      }
    });
  },
  changeNum(e) {
    let value = e.currentTarget.dataset;
    let index = value.index;
    let num = value.num;
    let flag = value.flag;
    let selected = value.selected;
    let one_num = "cartList[" + index + "].num";
    if (flag) {
      this.setData({
        [one_num]: num + 1,
      });
      if (selected) {
        this.calculateTotalPrice(flag, this.data.cartList[index].price, 1);
        this.calculateTotalNum(flag, 1);
      }
    } else {
      if (num > 1) {
        this.setData({
          [one_num]: num - 1,
        });
        if (selected) {
          this.calculateTotalPrice(flag, this.data.cartList[index].price, 1);
          this.calculateTotalNum(flag, 1);
        }
      } else {
        wx.showToast({
          title: "该商品不能减少了",
          icon: "none",
        });
      }
    }
    let param = {
      token: wx.getStorageSync("token"),
      good_id: this.data.cartList[index].good_id,
      num: this.data.cartList[index].num,
      price: this.data.cartList[index].sku.price,
      money:
        this.data.cartList[index].num * this.data.cartList[index].sku.price,
      sku: this.data.cartList[index].sku,
      shopping_car_id: this.data.cartList[index].shopping_car_id,
    };
    apiServer.shoppingCarAddModify(param);
  },
  calculateTotalPrice(flag, price, num) {
    this.setData({
      totalPrice: flag
        ? this.data.totalPrice + price * num
        : this.data.totalPrice - price * num,
    });
  },
  calculateTotalNum(flag, num) {
    this.setData({
      totalNum: flag ? this.data.totalNum + num : this.data.totalNum - num,
    });
  },
  // 编辑删除点击事件
  editDelClick() {
    if (this.data.editDel == true) {
      this.setData({ editDel: false });
    } else if (this.data.editDel == false) {
      this.setData({ editDel: true });
    }
  },
  //删除
  clickDel() {
    // console.log(this.data.selectedData);
    console.log(this.data.cartList);
    this.data.cartList
      .filter((e) => e.selected == true)
      .forEach((item) => {
        // 请求删除购物车
        let del = {
          token: wx.getStorageSync("token"),
          shopping_car_id: item.shopping_car_id,
        };
        apiServer.getShoppingCarDelete(del).then((res) => {
          console.log(res);
          if (res.data.code == 2000) {
            // this.data.cartList.forEach((ite) => {
            //   if (ite.shopping_car_id == item.shopping_car_id) {
            //     this.data.cartList.splice(ite, 1);
            //   }
            // });
            let list = {
              token: wx.getStorageSync("token"),
            };
            apiServer.getCartList(list).then((res) => {
              console.log(res.data.code);
              if (res.data.code == 2000) {
                res.data.data.data.forEach((e) => {
                  e.selected = false;
                  e.sku = JSON.parse(e.sku);
                });
                this.setData({
                  cartList: res.data.data.data,
                  selectedAll: false,
                  editDel: true,
                  totalPrice: 0,
                  totalNum: 0,
                });
                // 判断购物车是否为空
                if (this.data.cartList.length == 0) {
                  this.setData({ isEmpty: true });
                } else {
                  this.setData({ isEmpty: false });
                }
                console.log(this.data.cartList);
              }
            });

            wx.showToast({
              title: res.data.msg,
            });
          }
        });
      });
  },
  //去结算
  result() {
    // console.log(this.data.selectedData);
    console.log(this.data.cartList.filter((e) => e.selected == true));
    if (this.data.cartList.filter((e) => e.selected == true).length == 0) {
      $Toast({
        content: "请选择商品",
        icon: "prompt",
        duration: "0",
        mask: false,
      });
      setTimeout(() => {
        $Toast.hide();
      }, 2000);
    } else {
      let arr = this.data.cartList.filter((e) => e.selected == true);
      wx.setStorageSync("orderform", arr);
      wx.navigateTo({
        url: "../orderForm/orderForm?",
      });
    }
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
    let query = wx.createSelectorQuery().in(this);
    query
      .select("#cartBox")
      .boundingClientRect((rect) => {
        let top = rect.top;
        this.setData({
          cartBoxHeight: app.globalData.screenHeight - top,
        });
      })
      .exec();

    query
      .select("#cartOp")
      .boundingClientRect((rect) => {
        if (rect) {
          this.setData({
            cartOpHeight: rect.height,
          });
        }
      })
      .exec();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync("token")) {
      // 请求购物车列表
      let list = {
        token: wx.getStorageSync("token"),
      };
      apiServer.getCartList(list).then((res) => {
        console.log(res.data.code);
        if (res.data.code == 2000) {
          res.data.data.data.filter(e => /^ktpd/.test(e.good_name)).forEach((e) => {
            e.selected = false;
            e.sku = JSON.parse(e.sku);
          });
          this.setData({
            cartList: res.data.data.data,
            selectedAll: false,
            editDel: true,
            totalPrice: 0,
            totalNum: 0,
          });
          // 判断购物车是否为空
          if (this.data.cartList.length == 0) {
            this.setData({ isEmpty: true });
          } else {
            this.setData({ isEmpty: false });
          }
          console.log(this.data.cartList);
        }
      });
    } else {
      this.setData({ isEmpty: true });
      if (wx.getStorageSync('cartFlag')) {
        wx.setStorageSync('cartFlag', true)
      } else {
        wx.setStorageSync('cartFlag', true)
        wx.navigateTo({
          url: "../my/myLogin",
        });
      }

    }
  },

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
