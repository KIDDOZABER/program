import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    login: false,
    user: {
      imgUrl: '',
      username: '',
      token: ''
    },
    songlists: [],
    searchText: '',
    playLists: [],
    currentSonglist: {},
    currentSonglistId: '',
    currentSonglistFlag: 1,
    searchResult: [],
    tempRoute: ''
  },
  getters: {
    isLogin(state) {
      return state.login
    },
    getUser(state) {
      return state.user
    },
    getSonglists(state) {
      return state.songlists
    },
    getSearchText(state) {
      return state.searchText
    },
    getPlayLists(state) {
      return state.playLists
    },
    getCurrentSonglist(state) {
      return state.currentSonglist
    },
    getCurrentSonglistId(state) {
      return state.currentSonglistId
    },
    getSearchResult(state) {
      return state.searchResult
    },
    getCurrentSonglistFlag(state) {
      return state.currentSonglistFlag
    },
    getTempRoute(state) {
      return state.tempRoute
    }
  },
  mutations: {
    setLogin(state, val) {
      state.login = val
    },
    setImgUrl(state, val) {
      Vue.set(state.user, 'imgUrl', val)
    },
    setUsername(state, val) {
      Vue.set(state.user, 'username', val)
    },
    setToken(state, val) {
      Vue.set(state.user, 'token', val)
    },
    setSonglists(state, val) {
      state.songlists = val
    },
    addSonglist(state, val) {
      state.songlists.push(val)
    },
    deleteSonglist(state, val) {
      this.commit('setSonglists',this.getters.getSonglists.filter(e => e != val))
    },
    setSearchText(state, val) {
      state.searchText = val
    },
    setPlayLists(state, val) {
      state.playLists = val
    },
    setCurrentSonglist(state, val) {
      state.currentSonglist = val
    },
    setCurrentSonglistId(state, val) {
      state.currentSonglistId = val
    },
    setSearchResult(state, val) {
      state.searchResult = val
    },
    setCurrentSonglistFlag(state, val) {
      state.currentSonglistFlag = val
    },
    setTempRoute(state, val) {
      state.tempRoute = val
    }
  }
})

export default store
