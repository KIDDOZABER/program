// import Vue from 'vue'
// import axios from 'axios'
// import VueAxios from 'vue-axios'

// Vue.use(VueAxios,axios)

// Vue.axios.get()

import axios from 'axios'

const _http = 'http://localhost:3000'
const _axios = new axios.create({})

_axios.interceptors.request.use(config => {
  config.url = _http + config.url
  console.log(config.url)
  return config
},error => {
  return '代码错误'
})

_axios.interceptors.response.use(config => {
  return config
})

export default _axios
