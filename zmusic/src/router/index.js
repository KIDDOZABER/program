import Vue from 'vue'
import Router from 'vue-router'
import ZHeader from '@/components/z-header'
import ZZoneHeader from '@/components/z-zone-header'
import ZList from '@/components/z-list'
import ZPage from '@/components/z-page'

import ZEntry from '@/pages/z-entry'
import ZPlaylist from '@/pages/zone/z-playlist'
import ZRegister from '@/pages/z-register'
import ZZone from '@/pages/zone/z-zone'
import ZProfile from '@/pages/center/z-profile'
import ZHome from '@/pages/zone/z-home'
import ZSearch from '@/pages/z-search'
import ZLike from '@/pages/center/z-like'
import ZCreate from '@/pages/center/z-create'
import ZSonglist from '@/pages/songlist/z-songlist'
import ZPlayer from '@/pages/z-player'
// import ZBlank from '@/pages/z-blank'

Vue.component("z-header", ZHeader)
Vue.component("z-zone-header", ZZoneHeader)
Vue.component("z-list", ZList)
Vue.component("z-page", ZPage)

Vue.use(Router)

//获取原型对象上的push函数
const originalPush = Router.prototype.push
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 如果改了push还是没有生效，可以考虑改replace方法
// 修改路由replace方法,阻止重复点击报错
const originalReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
};

export default new Router({
  routes: [{
      path: '*',
      redirect: '/entry/zone/home'
    },
    // {
    //   path: '/blank',
    //   name: 'blank',
    //   component: ZBlank,
    // },
    {
      path: '/entry',
      name: 'entry',
      component: ZEntry,
      children: [{
          path: 'zone',
          name: 'zone',
          component: ZZone,
          children: [{
              path: 'playlist',
              name: 'playlist',
              component: ZPlaylist
            },
            {
              path: 'home',
              name: 'home',
              component: ZHome
            },
            {
              path: 'songlist',
              name: 'songlist',
              component: ZSonglist,
            }
          ]
        },
        {
          path: 'profile',
          name: 'profile',
          component: ZProfile,
          children: [{
              path: 'like',
              name: 'like',
              component: ZLike,
            },
            {
              path: 'create',
              name: 'create',
              component: ZCreate,
            }
          ]
        },
        {
          path: 'search',
          name: 'search',
          component: ZSearch,
        },
        
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: ZRegister,
    },
    {
      path: '/player',
      name: 'player',
      component: ZPlayer,
    }
  ]
})
