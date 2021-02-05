import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// 注册全局组件
// 加载动画
import loading from 'components/loading/loading.vue'
Vue.component('loading', loading)
import loadingA from 'components/loading/loading2.vue'
Vue.component('loading-a', loadingA)

// 引入vuex
import store from './store'

// 全局方法
// Vue.prototype.message = (value='操作结束') => {
// 	App.message()
// 	console.log(value)
// }

// 全局方法
import tools from './utils/tools.js'
Vue.prototype.$tools = tools

const app = new Vue({
	...App,
	store //挂载vuex
})
app.$mount()
