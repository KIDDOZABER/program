import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		token: '',
		user_info: {},
		last_page: '',
		current_tabbar: '',
		tempFilePath: '',
		windowHeight: 0,
		isLoginJust: false,
		isLoginsJust: false,
		isLogoutJust: false,
		follow_videos: [],
		recommended_videos: [],
		curr_video: {},
		curr_video_flag: false,
		my_page_flag: false,
		http: 'http://121.199.55.96:8090' //http://192.168.0.162:8089
	},
	getters: {
		getToken(state) {
			return state.token
		},
		getUserInfo(state) {
			return state.user_info
		},
		getLastPage(state) {
			return state.last_page
		},
		getCurTab(state) {
			return state.current_tabbar
		},
		getTempFp(state) {
			return state.tempFilePath
		},
		getWinH(state) {
			return state.windowHeight
		},
		getIsLoginJust(state) {
			return state.isLoginJust
		},
		getIsLoginsJust(state) {
			return state.isLoginsJust
		},
		getIsLogoutJust(state) {
			return state.isLogoutJust
		},
		getFollowVideos(state) {
			return state.follow_videos
		},
		getRecommendedVideos(state) {
			return state.recommended_videos
		},
		getCurrVideo(state) {
			return state.curr_video
		},
		getCurrVideoFlag(state) {
			return state.curr_video_flag
		},
		getMyPageFlag(state) {
			return state.my_page_flag
		},
		getHttp(state) {
			return state.http
		}
	},
    mutations: {
		setToken(state, value) {
			state.token = value
		},
		setUserInfo(state, value) {
			state.user_info = JSON.parse(JSON.stringify(value))
		},
		setLastPage(state, value) {
			state.last_page = value
		},
		setCurTab(state, value) {
			state.current_tabbar = value
		},
		setTempFp(state, value) {
			state.tempFilePath = value
		},
		setWinH(state, value) {
			state.windowHeight = value
		},
		setIsLoginJust(state, value) {
			state.isLoginJust = value
		},
		setIsLoginsJust(state, value) {
			state.isLoginsJust = value
		},
		setIsLogoutJust(state, value) {
			state.isLogoutJust = value
		},
		addFollowVideo(state, value) {
			state.follow_videos.push(value)
		},
		addRecommendedVideo(state, value) {
			state.recommended_videos.push(value)
		},
		setFollowVideo(state, value) {
			state.follow_videos = value
		},
		setRecommendedVideo(state, value) {
			state.recommended_videos = value
		},
		clearFollowVideo(state) {
			state.follow_videos = []
		},
		clearRecommendedVideo(state) {
			state.recommended_videos = []
		},
		setCurrVideo(state, value) {
			state.curr_video = value
		},
		setCurrVideoFlag(state, value) {
			state.curr_video_flag = value
		},
		setMyPageFlag(state, value) {
			state.my_page_flag = value
		}
	},
    actions: {}
})
export default store