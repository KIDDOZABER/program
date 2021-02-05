const host = 'http://api_devs.wanxikeji.cn/'
const domain = ''

const urls = {
  goodList: host + domain + 'api/goodList',
  goodInfo: host + domain + 'api/goodInfo',
  couponList: host + domain + 'api/couponList',
  goodType: host + domain + "api/goodType", //分类列表
  bannerList: host + domain + "api/bannerList", //banner列表
  userCouponList: host + domain + "api/userCouponList", //用户优惠卷列表
  userCouponAdd: host + domain + "api/userCouponAdd", //用户领取优惠卷
  cartList: host + domain + "api/shoppingCarList", //购物车列表
  shoppingCarAddModify: host + domain + "api/shoppingCarAddModify", //购物车商品增改
  shoppingCarDelete: host + domain + "api/shoppingCarDelete", //删除购物车
  generateOrder: host + domain + "api/generateOrder", //生成订单
}

module.exports = urls