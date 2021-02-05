<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status-bar bg-white fixed" :style="'height:'+statusBarHeight+'px;'"></view>
		<!-- #endif -->
		<view class="fixed flex align-center padding-top-sm padding-left padding-bottom-sm message-box" :class="{'text-white':!scroll_status,'text-black':scroll_status,'bg-white':scroll_status}">
			<uni-icons type="back" size="25" :class="{'text-white':!scroll_status,'text-black':scroll_status}" @tap="tapBack" />
		</view>

		<view class="per-info padding-bottom" :style="'margin-top:'+statusBarHeight+'px;'">
			<view :style="'background-image:url('+user.headImg+');'" class="bg"></view>
		</view>
		<view class="padding-left padding-right flex justify-between">
			<view class="avatar bg-black margin-right">
				<img :src="user.headImg" alt="" @load="loadAvatar">
				<img v-if="!avatar_status" src="https://s3.ax1x.com/2021/01/29/yC4lp8.png" alt="">
			</view>
			<view class="round flex justify-center align-center like-btn padding-top-xs padding-bottom-xs text-white margin-top-xs"
			 :class="{'bg-gray':user.follow_flag,'bg-light-green':!user.follow_flag}" @tap="tapFollow(user.follow_flag)">
				<text>{{user.follow_flag?'已':''}}关注</text>
			</view>
		</view>
		<view class="padding-left padding-right margin-top-sm flex flex-column">
			<text class="text-xl">{{user.nickName?user.nickName:'未知用户'}}</text>
			<text class="text-xs padding-bottom-sm">账号:&ensp;{{user.userName}}</text>
		</view>
		<view class="padding-left padding-right margin-top-sm flex flex-column">
			<view class="text-sm padding-bottom-sm flex">
				<view class="flex align-center">
					<text class="text-light-green text-xl margin-right-xs">{{praise_num}}</text>
					<text>获赞</text>
				</view>
				<view class="flex align-center margin-left">
					<text class="text-light-green text-xl margin-right-xs">{{user.focusCount?user.focusCount:0}}</text>
					<text>关注</text>
				</view>
				<view class="flex align-center margin-left">
					<text class="text-light-green text-xl margin-right-xs">{{user.fansCount?user.fansCount:0}}</text>
					<text>粉丝</text>
				</view>
			</view>
		</view>
		<view class="padding-left padding-right padding-top">
			<view class="flex justify-around text-sm text-gray classify-box">
				<view v-for="(item,index) in classify" :key="index" class="flex-item border-bottom text-center padding-bottom-xs"
				 :class="{'text-black':index==classify_active}" @tap="switchClassify(index)">
					<text>{{item.name}}</text>
				</view>
				<view class="curr-classify bg-light-green" :style="'left:'+50*classify_active+'%;'"></view>
			</view>
			<view v-if="!video_status" class="padding-top loading1 flex justify-center">
				<loading></loading>
			</view>
			<view class="flex flex-wrap padding-top-xs video-union">
				<view class="flex-3 bg-black item justify-center border border-box" v-for="(item,index) in videos" :key="index">
					<view class="box flex align-center justify-center" @tap="tapToFull(item)">
						<view class="cover">
							<img :src="item.videoCover" alt="" @load="load(index)">
						</view>
						<view class="loading" v-if="!item.status">
							<loading-a></loading-a>
						</view>
					</view>
					<view class="like flex align-center padding-left-xs border-box">
						<view>
							<uni-icons class="text-white margin-right-xs" type="heart" size="15" />
						</view>
						<view>
							<text class="text-xs">{{item.thumbs?item.thumbs:0}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 获赞数量框 -->
		<view v-if="praise_flag" class="shade bg-black-opacity">
			<view class="praise-box shadow-black bg-white padding border-box round">
				<view class="text-center padding-top padding-bottom">
					<text class="text-light-gray">'{{name}}'共获得{{praise_num}}个赞</text>
				</view>
				<view class="bg-light-green text-center padding-top-sm padding-bottom-sm margin-top round" @tap="praise_flag = false">
					<text class="text-white">确认</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				scroll_status: false,
				avatar_status: false,
				userName: '',
				user: {},
				img: 'https://s3.ax1x.com/2021/01/27/svj2jS.jpg', //
				name: 'KIDDO',
				praise_flag: false,
				praise_num: 0,
				classify_active: 0,
				classify: [{
						name: '作品'
					},
					{
						name: '喜欢'
					}
				],
				video_status: false,
				videos: [],
				praise_num: 0
			}
		},
		methods: {
			tapBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 头像加载成功
			loadAvatar() {
				this.avatar_status = true
			},
			// 打开点赞
			showPraise() {
				this.praise_flag = true
			},
			// 打开关注、粉丝
			tapLikeFans(index) {
				uni.navigateTo({
					url: '/pages/likefans/likefans?nav=' + index
				})
			},
			// 切换导航
			switchClassify(index) {
				this.classify_active = index
				console.log(this.classify[index].name)
				this.video_status = false
				// this.videos.forEach(e => this.$set(e, 'status', false))
				// let temp = JSON.parse(JSON.stringify(this.videos))
				this.videos = []
				setTimeout(async () => {
					
					if(index) {
						this.videos = await this.getUserThumbup(this.user.id)
					} else {
						this.videos = await this.getUserVideos(this.user.userName)
					}
					// this.videos = temp
					console.log(this.videos)
					this.video_status = true
				}, 2000)
			},
			// 视频封面加载完毕
			load(index) {
				if (this.videos[index]) this.$set(this.videos[index], 'status', true)
			},
			tapToFull(video) {
				console.log(video)
				uni.navigateTo({
					url: '/pages/fullscreen/fullscreen?video='+JSON.stringify(video)
				})
			},
			// 关注
			focusON(fansId, focusId) {
				let _self = this
				return new Promise((resolve, reject) => {
					uni.request({
						url: _self.$store.getters.getHttp+'/user/focusON',
						method: 'get',
						data: {
							fansId: fansId,
							focusId: focusId
						},
						success(res) {
							// console.log(res)
							resolve(res.data)
						}
					})
				})
			},
			// 取消关注
			cancelFocusON(fansId, focusId) {
				let _self = this
				return new Promise((resolve, reject) => {
					uni.request({
						url: _self.$store.getters.getHttp+'/user/cancelFocusON',
						method: 'get',
						data: {
							fansId: fansId,
							focusId: focusId
						},
						success(res) {
							// console.log(res)
							resolve(res.data)
						}
					})
				})
			},
			async tapFollow(flag) { // flag:true已关注点击被取消
			
				console.log(flag)
			
				if (!this.$store.getters.getToken) { // 未登录
					uni.navigateTo({
						url: '/pages/login/login'
					})
				} else {
					
					let id = this.$store.getters.getUserInfo.id
			
					let result
					// 推荐列表的操作
					if (!flag) { // 关注
						result = await this.focusON(id, this.user.id)
						console.log(result)
					} else { // 取消关注
						result = await this.cancelFocusON(id, this.user.id)
						console.log(result)
					}
					if (result.code == 0) {
						this.$set(this.user, 'follow_flag', !flag)
						
						let recommendedVideos = this.$store.getters.getRecommendedVideos
						recommendedVideos.forEach(e => {
							if(e.user.id == this.user.id) {
								this.$set(e, 'follow_flag', !flag)
							}
						})
						if(flag) {
							let followVideos = this.$store.getters.getFollowVideos
							followVideos = followVideos.filter(e => e.user.id !== this.user.id)
							this.$store.commit('setFollowVideo', followVideos)
						}
					}
				}
			},
			// 获取用户信息
			findUserByUserName(userName) {
				let _self = this
				return new Promise((resolve, reject) => {
					uni.request({
						url: _self.$store.getters.getHttp+'/user/findUserByUserName',
						method: 'get',
						data: {
							userName: userName
						},
						success(res) {
							// console.log(res)
							resolve(res.data.data)
						}
					})
				})
			},
			getFollowCount(id) {
				let _self = this
				return new Promise((resolve, reject) => {
					uni.request({
						url: _self.$store.getters.getHttp+'/user/getMyFocus',
						method: 'get',
						data: {
							userId: id
						},
						// #ifdef H5
						withCredentials: true,
						// #endif
						success(res) {
							resolve(res.data.count)
						}
					})
				})
			},
			getFansCount(id) {
				let _self = this
				return new Promise((resolve, reject) => {
					uni.request({
						url: _self.$store.getters.getHttp+'/user/getMyFans',
						method: 'get',
						data: {
							userId: id
						},
						// #ifdef H5
						withCredentials: true,
						// #endif
						success(res) {
							resolve(res.data.count)
						}
					})
				})
			},
			isFocusON(fansId, focusId) {
				let _self = this
				return new Promise((resolve, reject) => {
					uni.request({
						url: _self.$store.getters.getHttp+'/user/isFocusON',
						method: 'get',
						data: {
							fansId: fansId,
							focusId: focusId
						},
						success(res) {
							resolve(res.data.data)
						}
					})
				})
			},
			getUserVideos(userName) {
				let _self = this
				console.log(userName)
				return new Promise((resolve, reject) => {
					uni.request({
						url: _self.$store.getters.getHttp+'/video/getVideoByUserName',
						method: 'get',
						data: {
							userName: userName,
						},
						success(res) {
							console.log(res)
							let data = []
							res.data.data.forEach(e => {
								data.push({
									videoCover: e.videoCover,
									thumbs: e.thumbs,
									status: false,
									videoId: e.id,
									userId: e.user.id,
									headImg: e.user.headImg,
									nickName: e.user.nickName,
									fileUrl: e.fileUrl,
									videoDesc: e.videoDesc,
									userName: e.user.userName
								})
							})
							resolve(data)
						}
					})
				})
			},
			getUserThumbup(userId) {
				let _self = this
				console.log(userId)
				return new Promise((resolve, reject) => {
					uni.request({
						url: _self.$store.getters.getHttp+'/video/getMyThumbup',
						method: 'get',
						data: {
							userId: userId,
						},
						success(res) {
							console.log(res)
							let data = []
							res.data.data.forEach(e => {
								data.push({
									videoCover: e.video.videoCover,
									thumbs: e.video.thumbs,
									status: false,
									videoId: e.video.id,
									userId: e.video.user.id,
									headImg: e.video.user.headImg,
									nickName: e.video.user.nickName,
									fileUrl: e.video.fileUrl,
									videoDesc: e.video.videoDesc,
									userName: e.video.user.userName
								})
							})
							resolve(data)
						}
					})
				})
			},
			async getUser() {
				this.user = await this.findUserByUserName(this.userName)
				
				// const follow_num = await this.getFollowCount(this.user.id)
				// this.$set(this.user, 'follow_num', follow_num)
				
				// const fans_num = await this.getFansCount(this.user.id)
				// this.$set(this.user, 'fans_num', fans_num)
				
				let follow_flag = false
				if (this.$store.getters.getToken) {
					follow_flag = await this.isFocusON(this.$store.getters.getUserInfo.id, this.user.id)
				}
				this.$set(this.user, 'follow_flag', follow_flag)
				
				this.videos = await this.getUserVideos(this.user.userName)
				this.videos.forEach(e => this.praise_num += e.thumbs)
				
				this.video_status = true
				console.log(this.videos)
			}
		},
		created() {
			// #ifdef APP-PLUS
			this.statusBarHeight = Vue.prototype.statusBarHeight
			// #endif
		},
		mounted() {
			// this.switchClassify(0)
		},
		onPageScroll(e) {
			this.scroll_status = e.scrollTop > 0
		},
		onLoad(options) {
			console.log(options.userName)
			this.userName = options.userName
			this.getUser()
		}
	}
</script>

<style lang="less">
	@import '@/static/less/base.less';

	.status-bar {
		width: 100%;
		top: 0;
		left: 0;
		z-index: 10;
	}

	.message-box {
		width: 100%;
		box-sizing: border-box;
		z-index: 10;
	}

	.per-info {
		max-height: 340rpx;
		min-height: 200rpx;
		position: relative;
		border-radius: 20rpx 20rpx 0 0;
		overflow: hidden;

		.bg {
			width: 140%;
			height: 140%;
			filter: blur(30rpx);
			background-color: #000000;
			position: absolute;
			top: -20%;
			left: -20%;
			z-index: -1;
		}
	}

	.avatar {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-top: -65rpx;
		// border: 6rpx solid #000000;

		img {
			width: 100%;
			height: 100%;
			display: block;
			object-fit: cover;
		}
	}

	.like-btn {
		width: 50%;
		height: 50rpx;
	}

	.suspend {
		min-height: 200rpx;
		position: relative;
		top: -60rpx;
	}

	.classify-box {
		position: relative;

		.curr-classify {
			width: 50%;
			height: 4rpx;
			position: absolute;
			bottom: 0;
			left: 0;
			transition: all .3s ease-in-out;
		}
	}

	.loading1 {
		width: 100%;
		max-height: 10rpx;
	}

	.video-union {

		.item {
			min-height: 250rpx;
			height: 250rpx;
			max-height: 250rpx;
			position: relative;

			.box {
				width: 100%;
				height: 100%;
				position: relative;
				overflow: hidden;

				.cover {
					width: 100%;

					img {
						width: 100%;
						display: block;
					}
				}

				.loading {
					position: absolute;
				}
			}

			.like {
				width: 100%;
				position: absolute;
				bottom: 0;
				background-color: rgba(0,0,0,.3);
			}
		}
	}

	.praise-box {
		width: 500rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -150rpx;
		margin-left: -250rpx;
	}
</style>
