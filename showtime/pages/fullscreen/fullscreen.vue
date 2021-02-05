<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status-bar bg-black" :style="'height:'+statusBarHeight+'px;'"></view>
		<!-- #endif -->
		<!-- 顶部导航 -->
		<view class="padding-top-sm padding-bottom-sm padding-left padding-right flex justify-between align-center bg-black">
			<view class="flex align-center">
				<uni-icons type="back" size="25" class="text-white" @tap="tapBack" />
				<view class="avatar bg-black margin-left-sm margin-right-sm" @tap="gotoUser">
					<img :src="video.headImg" alt="">
				</view>
				<text class="text-sm">{{video.nickName}}</text>
			</view>
			<view v-if="$store.getters.getToken && $store.getters.getUserInfo.id == video.userId" class="round text-center padding-xs bg-light-green like-not">
				<text class="text-sm">我自己</text>
			</view>
			<view v-else class="round text-center padding-xs like-not" :class="{'bg-light-gray':video.like_flag,'bg-light-green':!video.like_flag}" @tap="tapLike(video.like_flag)">
				<text class="text-sm">{{video.like_flag?'已':''}}关注</text>
			</view>
		</view>
		<!-- <video v-if="temp_media" class="video" :src="temp_media" controls autoplay :style="'height:'+video_height+'px;'">
			<cover-view class="summary text-white">
				4444
			</cover-view>
		</video> -->
		<view class="video" :style="'height:'+video_height+'px;'">
			<video v-if="video.fileUrl" class="video" :src="video.fileUrl" controls autoplay :style="'height:'+video_height+'px;'">
				<cover-view class="summary text-white">
					{{video.videoDesc}}
				</cover-view>
			</video>
		</view>
		<!-- <video v-if="temp_media" class="video" :src="temp_media" controls autoplay ></video> -->
		<view class="flex fixed align-center op-box bg-black border-box padding-left padding-right padding-top-sm padding-bottom-sm">
			<input class="say bg-white padding-left-sm" type="text" placeholder="说点什么...">
			<view class="flex-grow flex justify-around align-center">
				<view class="flex align-center">
					<img class="margin-right-xs" src="https://s3.ax1x.com/2021/02/01/yZOv6S.png" alt="">
					<text>1</text>
				</view>
				<view class="flex align-center">
					<img class="margin-right-xs" src="https://s3.ax1x.com/2021/02/01/yZXU7d.png" alt="">
					<text>1</text>
				</view>
				<view class="flex align-center" @tap="tapThumbup(video.thumb_flag,video.thumbs)">
					<img v-if="video.thumb_flag" class="margin-right-xs" src="https://s3.ax1x.com/2021/02/03/yMvYSH.png" alt="">
					<img v-else class="margin-right-xs" src="https://s3.ax1x.com/2021/02/03/yMv0Tf.png" alt="">
					<text>{{video.thumbs}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				video: {},
				video_height: 0,
			}
		},
		methods: {
			tapBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			gotoUser(video) {
				let userName = this.video.userName
				this.$store.commit('setCurrVideoFlag', true)
				if(this.$store.getters.getToken && this.$store.getters.getUserInfo.userName == userName) {
					uni.switchTab({
						url: '/pages/tabBar/my/my'
					})
				} else {
					uni.navigateTo({
						url: '/pages/user/user?userName='+userName
					})
				}
			},
			tapLike(flag) {
				if(!this.$store.getters.getToken) {
					this.$store.commit('setCurrVideoFlag', true)
					uni.navigateTo({
						url: '/pages/login/login'
					})
				} else {
					let _self = this
					let id = this.$store.getters.getUserInfo.id
					
					if (!flag) { // 关注
						uni.request({
							url: _self.$store.getters.getHttp+'/user/focusON',
							method: 'get',
							data: {
								fansId: id,
								focusId: _self.video.userId
							},
							// #ifdef H5
							withCredentials: true,
							// #endif
							success(res) {
								// console.log(res)
								_self.$set(_self.video, 'like_flag', !flag)
								
								let recommendedVideos = _self.$store.getters.getRecommendedVideos
								recommendedVideos.forEach(e => {
									if(e.user.id == _self.video.userId) {
										_self.$set(e, 'follow_flag', !flag)
									}
								})
							}
						})
					} else { // 取消关注
						uni.request({
							url: _self.$store.getters.getHttp+'/user/cancelFocusON',
							method: 'get',
							data: {
								fansId: id,
								focusId: _self.video.userId
							},
							// #ifdef H5
							withCredentials: true,
							// #endif
							success(res) {
								// console.log(res)
								_self.$set(_self.video, 'like_flag', !flag)
								
								let recommendedVideos = _self.$store.getters.getRecommendedVideos
								recommendedVideos.forEach(e => {
									if(e.user.id == _self.video.userId) {
										_self.$set(e, 'follow_flag', !flag)
									}
								})
								let followVideos = _self.$store.getters.getFollowVideos
								followVideos = followVideos.filter(e => e.user.id !== _self.video.userId)
								_self.$store.commit('setFollowVideo', followVideos)
							}
						})
					}
				}
			},
			tapThumbup(flag,num) {
				if(!this.$store.getters.getToken) {
					this.$store.commit('setCurrVideoFlag', true)
					uni.navigateTo({
						url: '/pages/login/login'
					})
				} else {
					let _self = this
					let id = this.$store.getters.getUserInfo.id
					
					if (!flag) { // 点赞
						uni.request({
							url: _self.$store.getters.getHttp+'/video/thumbup',
							method: 'get',
							data: {
								userId: id,
								videoId: _self.video.videoId
							},
							// #ifdef H5
							withCredentials: true,
							// #endif
							success(res) {
								// console.log(res)
								_self.$set(_self.video, 'thumb_flag', !flag)
								_self.$set(_self.video, 'thumbs', num + 1)
							}
						})
					} else { // 取消点赞
						uni.request({
							url: _self.$store.getters.getHttp+'/video/cancelThumbup',
							method: 'get',
							data: {
								userId: id,
								videoId: _self.video.videoId
							},
							// #ifdef H5
							withCredentials: true,
							// #endif
							success(res) {
								// console.log(res)
								_self.$set(_self.video, 'thumb_flag', !flag)
								_self.$set(_self.video, 'thumbs', num - 1)
							}
						})
					}
				}
			}
		},
		created() {
			this.statusBarHeight = 0
			// #ifdef APP-PLUS
			this.statusBarHeight = Vue.prototype.statusBarHeight
			// #endif
		},
		mounted() {
			this.video_height = 0
			let video_top = 0
			let op_top = 0
			let _self = this
			this.$tools.getRect(".video").then(res => {
				video_top = res.top
				// console.log(video_top)
			})
			this.$tools.getRect(".op-box").then(res => {
				op_top = res.top
				_self.video_height = op_top - video_top
				// console.log(op_top,video_top,_self.video_height)
			})
		},
		onHide() {
			this.video = {}
		},
		onLoad(options) {
			this.$store.commit('setCurrVideoFlag', false)
			this.video = JSON.parse(options.video)
			
			let _self = this
			let id = this.$store.getters.getUserInfo.id
			uni.request({
				url: _self.$store.getters.getHttp+'/user/isFocusON',
				method: 'get',
				data: {
					fansId: id,
					focusId: _self.video.userId
				},
				// #ifdef H5
				withCredentials: true,
				// #endif
				success(res) {
					_self.$set(_self.video, 'like_flag', res.data.data)
					
					_self.$store.commit('setCurrVideo', _self.video)
				}
			})
			
			uni.request({
				url: _self.$store.getters.getHttp+'/video/isThumbup',
				method: 'get',
				data: {
					userId: id,
					videoId: _self.video.videoId
				},
				// #ifdef H5
				withCredentials: true,
				// #endif
				success(res) {
					// console.log(1, res.data.data)
					_self.$set(_self.video, 'thumb_flag', res.data.data)
					
					_self.$store.commit('setCurrVideo', _self.video)
				}
			})
		},
		onShow() {
			if(this.$store.getters.getCurrVideoFlag) {
				if(this.$store.getters.getCurrVideo.hasOwnProperty('videoId')) {
					this.video = this.$store.getters.getCurrVideo
				}
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/base.less';

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		overflow: hidden;
		border: 2rpx solid #FFFFFF;

		img {
			height: 100%;
			width: 100%;
			display: block;
			object-fit: cover;
		}
	}

	.like-not {
		width: 100rpx;
	}

	.video {
		width: 100%;
		position: relative;

		.summary {
			position: absolute;
			bottom: 100rpx;
			left: 40rpx;
		}
	}

	.op-box {
		width: 100%;
		bottom: 0;

		.say {
			width: 40%;
			height: 70rpx;
			border-radius: 35rpx;
		}
	}
</style>
