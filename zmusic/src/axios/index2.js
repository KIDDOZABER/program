import axios from 'axios'
import qs from 'qs'

const _http = 'http://forumapi.com'
const _axios = new axios.create({})

_axios.interceptors.request.use(config => {
  config.url = _http + config.url
  if(config.method.toLowerCase() == 'post') {
    config.data = qs.stringify(config.data)
  }
  console.log(config)
  return config
},error => {
  return '代码错误'
})

_axios.interceptors.response.use(config => {
  return config
})

export default _axios
