// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import * as filters from './filters'
import _axios from './axios'
import _zaxios from './axios/index2'
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(ElementUI)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.prototype._axios = _axios
Vue.prototype._zaxios = _zaxios
Vue.prototype.$axios = axios
_axios.defaults.withCredentials = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  axios,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})

router.beforeEach((to,from,next) => {
  // console.log(from.path,to.path)
  // if(to.path == '/blank') {
  //   console.log(from.path,store.getters.getTempRoute)
  //   if(from.path != store.getters.getTempRoute) {
  //     next(store.getters.getTempRoute)
  //   }
  //   store.commit('setTempRoute', from.path)
  // }


  if(to.name == 'zone') {
    next(to.fullPath + '/home')
  } else if(to.name == 'entry') {
    next(to.fullPath + '/zone')
  } else if(to.name == 'profile') {
    next(to.fullPath + '/like')
  } else {
    next()
  }
})
