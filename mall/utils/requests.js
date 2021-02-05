import urls from './urls'
 
const service = {
  get (url,data) {
    return new Promise((resolve,reject) => {
      wx.request({
        method: 'get',
        url: url,
        data: data,
        header: {"content-type": "application/json"},
        success: (res) =>{
          // 调用接口成功
          resolve(res)
        },
        fail: (err) => {
          // 调用接口失败
          reject(err)
        }
      })
    })
  },
  post (url,data) {
    return new Promise((resolve,reject) => {
      wx.request({
        method: 'post',
        url: url,
        data: data,
        header: { "content-type": "application/json" },
        success: (res) =>{
          // 调用接口成功
          resolve(res)
        },
        fail: (err) => {
          // 调用接口失败
          reject(err)
        }
      })
    })
  }
}
 
module.exports = {
  // 获取商品列表
  getGoodList: (data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.get(urls.goodList,data))
    })
  },
  // 获取商品详情
  getGoodInfo: (data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.get(urls.goodInfo,data))
    })
  },
  // 获取优惠券列表
  getCouponList: (data) => {
    return new Promise((resolve,reject)=> {
      resolve(service.get(urls.couponList,data))
    })
  },
  // 获取分类列表
  getGoodType: (data) => {
    return new Promise((resolve, reject) => {
      resolve(service.get(urls.goodType, data));
    });
  },
  // 获取banner列表
  getBannerList: (data) => {
    return new Promise((resolve, reject) => {
      resolve(service.get(urls.bannerList, data));
    });
  },
  // 获取用户优惠卷列表
  getUerCouponList: (data) => {
    return new Promise((resolve, reject) => {
      resolve(service.get(urls.userCouponList, data));
    });
  },
  // 用户领取优惠卷
  userCouponAdd: (data) => {
    return new Promise((resolve, reject) => {
      resolve(service.get(urls.userCouponAdd, data));
    });
  },
  // 获取购物车列表
  getCartList: (data) => {
    return new Promise((resolve, reject) => {
      resolve(service.get(urls.cartList, data));
    });
  },
  // 购物车商品增改
  shoppingCarAddModify: (data) => {
    return new Promise((resolve, reject) => {
      resolve(service.get(urls.shoppingCarAddModify, data));
    });
  },
  // 获取删除购物车
  getShoppingCarDelete: (data) => {
    return new Promise((resolve, reject) => {
      resolve(service.get(urls.shoppingCarDelete, data));
    });
  },
   // 获取生成订单
   getGenerateOrder: (data) => {
    return new Promise((resolve, reject) => {
      resolve(service.post(urls.generateOrder, data));
    });
  },
}