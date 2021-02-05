<template>
	<view :style="'padding-top:'+scroll_top+'px;'">
		<!-- #ifdef APP-PLUS -->
		<view class="status-bar bg-white fixed" :style="'height:'+statusBarHeight+'px;'"></view>
		<!-- #endif -->
		<view class="bg-white flex justify-center padding-top-sm padding-bottom-sm border-bottom-light-gray-2rpx fixed top-nav"
		 :style="'top:'+statusBarHeight+'px;'">
			<view class="flex text-lg">
				<view class="margin-right-sm margin-left-sm text-gray" :class="{'text-black':index==nav_active}" v-for="(item,index) in nav"
				 :key="index" @tap="changeNav(index)">
					<text>{{item.name}}</text>
				</view>
				<!-- <view class="margin-right" @tap="view_id='head-content'">关注</view>
				<view @tap="view_id='head-content'">推荐</view> -->
			</view>
		</view>
		<scroll-view class="scroll-box" @touchend="letitgo" :style="'height:'+scroll_height+'px;'" scroll-y :scroll-into-view="view_id"
		 @scroll="scrollAction" @scrolltolower="scrolltolower">
			<view class="pull-down bg-light-gray">
				<view v-if="update_flag">
					<view class="icon-text flex justify-center align-center">
						<uni-icons type="spinner-cycle" class="text-dark-gray margin-right-sm cycle-rotate" size="15" />
						<text>加载中</text>
					</view>
				</view>
				<view v-else>
					<view v-if="pull_flag == 'down'" class="icon-text flex justify-center align-center">
						<uni-icons type="arrowthindown" class="text-dark-gray margin-right-sm" size="20" />
						<text>下拉刷新</text>
					</view>
					<view v-else class="icon-text flex justify-center align-center">
						<uni-icons type="arrowthinup" class="text-dark-gray margin-right-sm" size="20" />
						<text>释放更新</text>
					</view>
				</view>
			</view>
			<view class="bg-light-gray head-content" id="head-content"></view>
			<view :style="'min-height:'+scroll_height+'px;'">
				<view v-if="loading_flag">
					<view class="text-center padding-top-xl">
						<text class="text-sm">正在获取视频，请稍后</text>
					</view>
				</view>
				<view v-else>
					<view v-if="$store.getters.getFollowVideos.length == 0 && nav_active == 0" class="text-center padding-top-xl">
						<text v-if="$store.getters.getToken" class="text-sm">一个关注也没有，点击推荐查看最新视频</text>
						<text v-else class="text-sm" @tap="login">登录后查看</text>
					</view>
					<view v-if="$store.getters.getRecommendedVideos.length == 0 && nav_active == 1" class="text-center padding-top-xl">
						<text class="text-sm">没有最新视频，点击下方拍摄你的vlog</text>
					</view>
				</view>
				<!-- 关注 -->
				<view v-if="nav_active == 0">

					<view v-for="(item,index) in $store.getters.getFollowVideos" :key="index" @tap="gotoBrif(item)">
						<view class="vidio-content">
							<view class="flex justify-between align-center padding-left padding-right padding-top-sm padding-bottom-sm">
								<view class="flex align-center" @tap.stop="gotoUser(item)">
									<view class="avatar bg-white">
										<img :src="item.user.headImg" alt="">
									</view>
									<view class="margin-left-sm">
										<view>{{item.user.nickName}}</view>
										<view class="text-sm text-gray in-line">{{item.user.introduce?item.user.introduce:'这个人太懒了，什么也没写'}}</view>
									</view>
								</view>
							</view>
							<view class="video bg-black flex align-center">
								<video v-if="item.play" :src="item.fileUrl" controls autoplay @ended="playEnd(index)"></video>
								<img v-else :src="item.videoCover" alt="" @tap.stop="playVideo(index)">
							</view>
							<view class="padding-left padding-right padding-top-sm padding-bottom-sm">
								{{item.videoDesc}}
							</view>
							<view class="padding-left padding-right op text-sm">
								<view class="flex justify-around border-top-light-gray-2rpx padding-top-sm padding-bottom-sm">
									<view class="flex align-center">
										<img class="margin-right-xs" src="https://s3.ax1x.com/2021/01/29/yitB90.png" alt="">
										<text>{{1322}}</text>
									</view>
									<view class="flex align-center">
										<img class="margin-right-xs" src="https://s3.ax1x.com/2021/01/29/yit31f.png" alt="">
										<text>{{1555}}</text>
									</view>
									<view class="flex align-center" @tap.stop="tapThumbup(item.thumb_flag,item.thumbs,index)">
										<img v-if="item.thumb_flag" class="margin-right-xs" src="https://s3.ax1x.com/2021/02/03/yMNJF1.png" alt="">
										<img v-else class="margin-right-xs" src="https://s3.ax1x.com/2021/01/29/yC4Zmd.png" alt="">
										<text>{{item.thumbs}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="bg-light-gray head-content"></view>
					</view>
				</view>
				<!-- 推荐 -->
				<view v-else>

					<view v-for="(item,index) in $store.getters.getRecommendedVideos" :key="index" @tap="gotoBrif(item)">
						<view class="vidio-content">
							<view class="flex justify-between align-center padding-left padding-right padding-top-sm padding-bottom-sm">
								<view class="flex align-center" @tap.stop="gotoUser(item)">
									<view class="avatar bg-white">
										<img :src="item.user.headImg" alt="">
									</view>
									<view class="margin-left-sm">
										<view>{{item.user.nickName}}</view>
										<view class="text-sm text-gray in-line">{{item.user.introduce?item.user.introduce:'这个人太懒了，什么也没写'}}</view>
									</view>
								</view>
								<view v-if="$store.getters.getToken && item.user.id != $store.getters.getUserInfo.id">
									<!-- 登录且不是自己 -->
									<view v-if="item.follow_flag" class="plus-like bg-light-green text-white flex justify-between align-center padding-left-sm padding-right-sm"
									 @tap.stop="tapLike(item.follow_flag,index)">
										已关注
									</view>
									<view v-else class="plus-like text-light-green border-light-green border-box flex justify-between align-center padding-left-sm padding-right-sm"
									 @tap.stop="tapLike(item.follow_flag,index)">
										+&ensp;关注
									</view>
								</view>
								<view v-else-if="!$store.getters.getToken">
									<view class="plus-like text-light-green border-light-green border-box flex justify-between align-center padding-left-sm padding-right-sm"
									 @tap.stop="tapLike(item.follow_flag,index)">
										+&ensp;关注
									</view>
								</view>
								<view v-else>
									<view class="plus-like bg-light-green text-white flex justify-between align-center padding-left-sm padding-right-sm">
										我自己
									</view>
								</view>
							</view>
							<view class="video bg-black flex align-center">
								<video v-if="item.play" :src="item.fileUrl" controls autoplay @ended="playEnd(index)"></video>
								<img v-else :src="item.videoCover" alt="" @tap.stop="playVideo(index)">
							</view>
							<view class="padding-left padding-right padding-top-sm padding-bottom-sm">
								{{item.videoDesc}}
							</view>
							<view class="padding-left padding-right op text-sm">
								<view class="flex justify-around border-top-light-gray-2rpx padding-top-sm padding-bottom-sm">
									<view class="flex align-center">
										<img class="margin-right-xs" src="https://s3.ax1x.com/2021/01/29/yitB90.png" alt="">
										<text>{{1322}}</text>
									</view>
									<view class="flex align-center">
										<img class="margin-right-xs" src="https://s3.ax1x.com/2021/01/29/yit31f.png" alt="">
										<text>{{1555}}</text>
									</view>
									<view class="flex align-center" @tap.stop="tapThumbup(item.thumb_flag,item.thumbs,index)">
										<img v-if="item.thumb_flag" class="margin-right-xs" src="https://s3.ax1x.com/2021/02/03/yMNJF1.png" alt="">
										<img v-else class="margin-right-xs" src="https://s3.ax1x.com/2021/01/29/yC4Zmd.png" alt="">
										<text>{{item.thumbs}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="bg-light-gray head-content"></view>
					</view>
				</view>
			</view>
			<view v-if="$store.getters.getToken" class="flex justify-center align-center padding-top-xs padding-bottom-xs" style="height: 50rpx;">
				<loading v-if="loading_more_flag"></loading>
				<text v-else>已无更多</text>
			</view>
		</scroll-view>

		<view v-if="message_status" class="shade">
			<view class="message message-top">
				<text>{{message}}</text>
			</view>
		</view>

		<view v-if="loading_flag" class="shade flex justify-center align-center">
			<loading-a></loading-a>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				nav: [{
						name: '关注'
					},
					{
						name: '推荐'
					}
				],
				nav_active: 0, // 关注推荐
				scroll_top: 0, // 计算scroll-view的top
				scroll_height: 0,
				pull_down_height: 0, // 计算下拉刷新区的高度
				view_id: 'head-content', // view的id
				scroll_top_dis: 0, // 滑动距离
				pull_flag: 'down', // 下拉松手图标
				is_update: false, // 是否触发更新
				update_flag: false, // 更新图标状态
				follow_page: 1,
				recommended_page: 1,
				limit: 5,
				count: 0,
				like: [],
				recommend: [],
				message: '',
				message_status: false,
				loading_flag: false,
				loading_more_flag: false
			}
		},
		methods: {
			stopPlay() {
				if (this.nav_active) {
					let videos = this.$store.getters.getRecommendedVideos
					videos.forEach(e => {
						this.$set(e, 'play', false)
					})
				} else {
					let videos = this.$store.getters.getFollowVideos
					videos.forEach(e => {
						this.$set(e, 'play', false)
					})
				}
			},
			changeNav(index) {
				this.stopPlay()
				this.nav_active = index
			},
			scrolltolower() {
				console.log('滑倒底部了')
				this.loading_more_flag = true
				console.log(this.loading_more_flag, this.count)
				setTimeout(async () => {

					if (this.nav_active) {
						let videos = this.$store.getters.getRecommendedVideos
						this.recommended_page++
						if (videos.length < this.count) {
							await this.getRecommendedVideo()
						}
						this.loading_more_flag = false
						console.log(this.loading_more_flag)
					} else {
						await this.scrollGetFollowVideos()
						this.loading_more_flag = false
					}

				}, 2000)
			},
			async scrollGetFollowVideos() {
				let videos = this.$store.getters.getFollowVideos
				let temp_count = videos.count
				if (this.follow_page * this.limit < this.count) {
					this.follow_page++
					await this.getFollowVideo()
					videos = this.$store.getters.getFollowVideos
					if (temp_count == videos.length) {
						await this.scrollGetFollowVideos()
					}
				}
			},
			scrollAction(e) {

				this.stopPlay()

				// console.log(e.detail.scrollTop)
				// 加载区
				this.scroll_top_dis = e.detail.scrollTop
				if (this.scroll_top_dis < this.pull_down_height / 2) {
					this.pull_flag = 'up'
					this.is_update = true
				} else {
					this.pull_flag = 'down'
					this.is_update = false
				}
			},
			letitgo() {
				if (this.scroll_top_dis < this.pull_down_height) {
					// 松手回弹
					if (!this.is_update) {
						this.$nextTick(() => {
							this.view_id = ''
							this.$nextTick(() => {
								this.view_id = 'head-content'
								this.pull_flag = 'down'
								this.update_flag = false
							})
						})
					} else {
						this.update_flag = true // 打开加载动画

						setTimeout(async () => {

							if (this.nav_active) {
								this.$store.commit('clearRecommendedVideo')
								this.recommended_page = 1
								await this.getRecommendedVideo()
							} else {
								if (this.$store.getters.getToken) {
									this.$store.commit('clearFollowVideo')
									this.follow_page = 1
									await this.getFollowVideo()
								} else {
									console.log('未登录')
								}
							}

							this.$nextTick(() => {
								this.view_id = ''
								this.$nextTick(() => {

									this.view_id = 'head-content'
									this.pull_flag = 'down' // 恢复下拉图标
									this.update_flag = false // 关闭加载动画

									// 更新完毕
									this.message_status = true
									this.message = '更新成功'
									setTimeout(() => {
										this.message_status = false
									}, 3000)
								})
							})

						}, 2000)
					}
				}
			},
			gotoBrif(video) {
				console.log(video)
				let temp_video = {
					"videoCover": video.videoCover,
					"thumbs": video.thumbs,
					"status": true, // 这个变量在个人页的作用是加载图片，这里随便传不传都行
					"videoId": video.id,
					"userId": video.user.id,
					"headImg": video.user.headImg,
					"nickName": video.user.nickName,
					"fileUrl": video.fileUrl,
					"videoDesc": video.videoDesc,
					"userName": video.user.userName
				}
				uni.navigateTo({
					url: '/pages/fullscreen/fullscreen?video='+JSON.stringify(temp_video)
				})
			},
			gotoUser(video) {
				let userName = video.user.userName
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
			// 点赞
			thumbup(userId, videoId) {
				let _self = this
				return new Promise((resolve, reject) => {
					uni.request({
						url: _self.$store.getters.getHttp+'/video/thumbup',
						method: 'get',
						data: {
							userId: userId,
							videoId: videoId
						},
						success(res) {
							// console.log(res)
							resolve(res.data)
						}
					})
				})

			},
			// 取消点赞
			cancelThumbup(userId, videoId) {
				let _self = this
				return new Promise((resolve, reject) => {
					uni.request({
						url: _self.$store.getters.getHttp+'/video/cancelThumbup',
						method: 'get',
						data: {
							userId: userId,
							videoId: videoId
						},
						// #ifdef H5
						withCredentials: true,
						// #endif
						success(res) {
							// console.log(res)
							resolve(res.data)
						}
					})
				})

			},
			async tapLike(flag, index) { // flag:true已关注点击被取消

				console.log(flag, index)

				if (!this.$store.getters.getToken) { // 未登录
					uni.navigateTo({
						url: '/pages/login/login'
					})
				} else {
					let videos = this.$store.getters.getRecommendedVideos
					let id = this.$store.getters.getUserInfo.id

					let result
					// 推荐列表的操作
					if (!flag) { // 关注
						result = await this.focusON(id, videos[index].user.id)
						console.log(result)
					} else { // 取消关注
						result = await this.cancelFocusON(id, videos[index].user.id)
						console.log(result)
					}
					if (result.code == 0) {
						// 全部更改
						videos.forEach(e => {
							if (e.user.id == videos[index].user.id) {
								this.$set(e, 'follow_flag', !flag)
							}
						})
						// 刷新关注列表
						this.$store.commit('clearFollowVideo')
						this.follow_page = 1
						await this.getFollowVideo()
					}
				}
			},
			async tapThumbup(flag, num, index) { // flag:true，已点赞 点击取消点赞
				if (!this.$store.getters.getToken) { // 未登录
					uni.navigateTo({
						url: '/pages/login/login'
					})
				} else {
					let id = this.$store.getters.getUserInfo.id
					let result

					if (this.nav_active) { // 推荐列表的操作
						let videos = this.$store.getters.getRecommendedVideos
						if (!flag) { // 点赞
							result = await this.thumbup(id, videos[index].id)
							console.log(result)

							if (result.code == 0) {
								this.$set(videos[index], 'thumb_flag', !flag)
								this.$set(videos[index], 'thumbs', num + 1)
							}
						} else { // 取消点赞
							result = await this.cancelThumbup(id, videos[index].id)
							console.log(result)
							if (result.code == 0) {
								this.$set(videos[index], 'thumb_flag', !flag)
								this.$set(videos[index], 'thumbs', num - 1)
							}
						}

						// 刷新关注列表
						this.$store.commit('clearFollowVideo')
						this.follow_page = 1
						await this.getFollowVideo()
					} else { // 关注列表
						let videos = this.$store.getters.getFollowVideos
						if (!flag) { // 点赞
							console.log(id, videos[index].id)
							result = await this.thumbup(id, videos[index].id)
							console.log(result)
							if (result.code == 0) {
								this.$set(videos[index], 'thumb_flag', !flag)
								this.$set(videos[index], 'thumbs', num + 1)
							}
						} else { // 取消点赞
							result = await this.cancelThumbup(id, videos[index].id)
							console.log(result)
							if (result.code == 0) {
								console.log(this.$store.getters.getFollowVideos[index].thumbs)
								this.$set(videos[index], 'thumb_flag', !flag)
								this.$set(videos[index], 'thumbs', num - 1)
								console.log(this.$store.getters.getFollowVideos[index].thumbs)
							}
						}

						// 刷新推荐列表
						this.$store.commit('clearRecommendedVideo')
						this.recommended_page = 1
						await this.getRecommendedVideo()
					}
				}
			},
			playVideo(index) {

				if (this.nav_active) {
					// 关闭其他正在播放的
					let videos = this.$store.getters.getRecommendedVideos
					videos.filter((e, i) => i !== index).forEach(e => {
						this.$set(e, 'play', false)
					})
					// 播放当前点击的
					this.$set(videos[index], 'play', true)
				} else {
					// 关闭其他正在播放的
					let videos = this.$store.getters.getFollowVideos
					videos.filter((e, i) => i !== index).forEach(e => {
						this.$set(e, 'play', false)
					})
					// 播放当前点击的
					this.$set(videos[index], 'play', true)
				}
			},
			playEnd(index) { // 播放完毕恢复图片
				if (this.nav_active) {
					let videos = this.$store.getters.getRecommendedVideos
					this.$set(videos[index], 'play', false)
				} else {
					let videos = this.$store.getters.getFollowVideos
					this.$set(videos[index], 'play', false)
				}
			},

			// 获取所有视频
			getVideo(page, limit) {
				let _self = this
				return new Promise((resolve, reject) => {
					uni.request({
						url: _self.$store.getters.getHttp+'/video/findSomeVideo',
						method: 'post',
						data: {
							page: page,
							limit: limit
						},
						success(res) {
							_self.count = res.data.count
							resolve(res.data.data)
						},
						fail(err) {
							console.log(err)
							reject(err)
						}
					})
				})
			},
			// 判断是否关注
			isFocusON(fansId, focusId) {
				let _self = this
				// console.log('判断是否关注')
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
			// 判断是否点赞
			isThumbup(userId, videoId) {
				let _self = this
				// console.log('判断是否点赞')
				return new Promise((resolve, reject) => {
					uni.request({
						url: _self.$store.getters.getHttp+'/video/isThumbup',
						method: 'get',
						data: {
							userId: userId,
							videoId: videoId
						},
						success(res) {
							console.log(userId, videoId, res.data.data)
							resolve(res.data.data)
						}
					})
				})
			},
			// 获取关注列表
			async getFollowVideo() {
				if (this.$store.getters.getToken) {
					console.log('获取视频开始')
					const all_video = await this.getVideo(this.follow_page, this.limit)
					console.log(all_video)
					console.log('获取视频完成了')
					console.log('开始循环判断是否关注')
					for (let i = 0; i < all_video.length; i++) {
						const follow_flag = await this.isFocusON(this.$store.getters.getUserInfo.id, all_video[i].user.id)
						const thumb_flag = await this.isThumbup(this.$store.getters.getUserInfo.id, all_video[i].id)
						console.log(follow_flag, thumb_flag)
						if (follow_flag) {
							this.$set(all_video[i], 'follow_flag', follow_flag)
							this.$set(all_video[i], 'thumb_flag', thumb_flag)

							this.$store.commit('addFollowVideo', all_video[i])
						}
						console.log(this.$store.getters.getFollowVideos.length)
					}

					if (this.$store.getters.getFollowVideos.length < 2 && this.follow_page * this.limit < this.count) {
						console.log('没找到，继续 ')
						this.follow_page++
						await this.getFollowVideo()
					}
					console.log('结束循环判断是否关注')
				}
			},
			// 获取推荐列表
			async getRecommendedVideo() {
				console.log('获取视频开始')
				const all_video = await this.getVideo(this.recommended_page, this.limit)
				console.log(all_video)
				console.log('获取视频完成了')
				console.log('开始循环判断')
				for (let i = 0; i < all_video.length; i++) {
					const follow_flag = false
					const thumb_flag = false
					if (this.$store.getters.getToken) {
						follow_flag = await this.isFocusON(this.$store.getters.getUserInfo.id, all_video[i].user.id)
						thumb_flag = await this.isThumbup(this.$store.getters.getUserInfo.id, all_video[i].id)
					}
					console.log(follow_flag, thumb_flag)
					this.$set(all_video[i], 'follow_flag', follow_flag)
					this.$set(all_video[i], 'thumb_flag', thumb_flag)

					this.$store.commit('addRecommendedVideo', all_video[i])
					console.log(this.$store.getters.getRecommendedVideos.length)
				}
				console.log('结束循环判断')
			},
			// 同时请求关注和推荐
			async resToOb() {
				this.loading_flag = true
				await this.getFollowVideo()
				await this.getRecommendedVideo()
				this.loading_flag = false
			},

			login() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		},
		created() {
			// #ifdef APP-PLUS
			this.statusBarHeight = Vue.prototype.statusBarHeight
			// #endif
		},
		mounted() {
			let _self = this
			this.$tools.getRect(".top-nav").then(res => {
				_self.scroll_top = res.height + _self.statusBarHeight
				_self.scroll_height = _self.$store.getters.getWinH - _self.scroll_top - 50
				// console.log(_self.scroll_top)
				// console.log(_self.scroll_height)
			})

			this.$tools.getRect(".pull-down").then(res => {
				_self.pull_down_height = res.height
			})



			this.changeNav(1)
			console.log('未登录')
			this.getRecommendedVideo()

			// 已登录
			if (this.$store.getters.getToken) {
				this.changeNav(0)
				console.log('已登录')
				this.getFollowVideo()
			}
		},
		onShow() {
			// 刚登录
			if (this.$store.getters.getIsLoginJust) {
				console.log(5)
				this.$store.commit('setIsLoginJust', false)
				this.changeNav(0)
				console.log('x')
				// this.getFollowVideo()
				this.follow_page = 1
				this.recommended_page = 1
				this.resToOb()
				console.log('y')
				// 重置推荐列表，加载出关注样式与点赞样式
				// this.getRecommendedVideo()
			}

			if (this.$store.getters.getIsLogoutJust) {
				this.$store.commit('setIsLogoutJust', false)
				// 重置推荐列表，加载出关注样式与点赞样式
				this.recommended_page = 1
				this.getRecommendedVideo()
			}
		},
		onHide() {
			if (this.nav_active) {
				this.recommend.forEach(e => {
					this.$set(e, 'play', false)
				})
			} else {
				this.like.forEach(e => {
					this.$set(e, 'play', false)
				})
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/less/base.less';

	.status-bar {
		width: 100%;
		top: 0;
		left: 0;
		z-index: 99;
	}

	.top-nav {
		width: 100%;
	}

	.scroll-box {
		transition: all .3s ease-in-out;
	}

	.pull-down {
		height: 300rpx;
		position: relative;

		.icon-text {
			position: absolute;
			top: 70%;
			width: 100%;

			.cycle-rotate {
				animation: rotate 1s linear infinite;
			}

			@keyframes rotate {
				from {
					transform: rotate(0deg);
				}

				to {
					transform: rotate(360deg);
				}
			}
		}
	}

	.head-content {
		height: 20rpx;
	}

	.vidio-content {
		width: 100%;

		.avatar {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			overflow: hidden;
			border: 2rpx solid #000000;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				display: block;
			}
		}

		.plus-like {
			height: 50rpx;
			border-radius: 25rpx;
		}

		.video {
			min-height: 400rpx;
			height: 400rpx;
			max-height: 400rpx;
			overflow: hidden;
			// background-image: url("https://s3.ax1x.com/2021/01/27/svj2jS.jpg");
			// background-size: 100%;
			// background-repeat: no-repeat;
			// background-position: center;

			video {
				width: 100%;
				height: 100%;
				object-fit: fill;
			}

			img {
				width: 100%;
			}
		}

		.op {
			img {
				width: 36rpx;
			}
		}
	}
</style>
