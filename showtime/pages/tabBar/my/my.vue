<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status-bar bg-white fixed" :style="'height:'+statusBarHeight+'px;'"></view>
		<!-- #endif -->
		<view class="fixed flex justify-end padding-top-sm padding-right padding-bottom-sm message-box" :class="{'text-white':!scroll_status,'text-black':scroll_status,'bg-white':scroll_status}">
			<!-- <uni-icons type="email" class="margin-right-xs" :class="{'text-white':!scroll_status,'text-black':scroll_status}"
			 size="25"/>
			<text class="text-sm">通知</text> -->
			<view class="flex align-center" @tap="openTools">
				<uni-icons type="gear" class="margin-right-xs" :class="{'text-white':!scroll_status,'text-black':scroll_status}"
				 size="25" />
				<text class="text-sm">设置</text>
			</view>
		</view>

		<view class="per-info padding-bottom" :style="'margin-top:'+statusBarHeight+'px;'">
			<view :style="'background-image:url('+img+');'" class="bg"></view>
			<view class="padding padding-top-lg padding-bottom-lg margin-top flex text-white">
				<view class="avatar bg-black margin-right">
					<img v-if="!avatar_status" src="https://s3.ax1x.com/2021/01/29/yC4lp8.png" alt="">
					<img :src="img" alt="" @load="loadAvatar">
				</view>
				<view class="flex flex-column">
					<text class="margin-bottom-xs">Hi&ensp;{{name?name:'亲爱的用户'}}</text>
					<text class="text-sm text-light-white">今天是 Melody 陪伴你的第<span class="text-light-green">N</span>天</text>
				</view>
			</view>
		</view>
		<view class="padding-left padding-right">
			<view class="shadow suspend bg-white round margin-bottom-sm flex justify-around align-center">
				<view class="flex flex-column align-center" @tap="showPraise">
					<img src="https://s3.ax1x.com/2021/01/29/yCfE9O.png" alt="">
					<text class="text-sm">获赞</text>
				</view>
				<view class="flex flex-column align-center" @tap="tapLikeFans(0)">
					<img src="https://s3.ax1x.com/2021/01/29/yC4Zmd.png" alt="">
					<text class="text-sm">关注</text>
				</view>
				<view class="flex flex-column align-center" @tap="tapLikeFans(1)">
					<img src="https://s3.ax1x.com/2021/01/29/yC4B1U.png" alt="">
					<text class="text-sm">粉丝</text>
				</view>
			</view>
			<view class="flex justify-around text-sm text-gray classify-box">
				<view v-for="(item,index) in classify" :key="index" class="flex-item border-bottom-light-gray text-center padding-bottom-xs"
				 :class="{'text-black':index==classify_active}" @tap="switchClassify(index)">
					<text>{{item.name}}</text>
				</view>
				<view class="curr-classify bg-light-green" :style="'left:'+25*classify_active+'%;'"></view>
			</view>
			<view v-if="!video_status" class="padding-top loading1 flex justify-center">
				<loading></loading>
			</view>
			<view v-if="message" class="padding-top loading1 flex justify-center">
				<text>{{message}}</text>
			</view>
			<view class="flex flex-wrap padding-top-xs video-union">
				<view class="flex-3 bg-black item justify-center border border-box" v-for="(item,index) in videos" :key="index"
				 @longpress="deleteVideo(item,index)">
					<view class="box flex align-center justify-center" @tap="tapToFull(item)">
						<view class="cover">
							<img :src="item.videoCover" alt="" @load="load(index)">
						</view>
						<view class="loading" v-if="!item.status">
							<loading-a></loading-a>
						</view>
						<view class="check" v-if="delete_mask_flag" @tap.stop="deleteVideo(item,index)">
							<!-- @tap.stop="cancelDelete(item,index)" -->
							<view class="inner-check" v-if="item.delete_item">
								<uni-icons type="checkmarkempty" class="text-light-green" size="15" />
							</view>
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
					<text class="text-black">'{{name}}'共获得<text class="text-light-green text-bold margin-left-xs margin-right-xs">{{praise_num}}</text>个赞</text>
				</view>
				<view class="bg-light-green text-center padding-top-sm padding-bottom-sm margin-top round" @tap="praise_flag = false">
					<text class="text-white">确认</text>
				</view>
			</view>
		</view>

		<!-- 退出确认框 -->
		<view v-if="logout_flag" class="shade bg-black-opacity">
			<view class="praise-box shadow-black bg-white padding border-box round">
				<view class="text-center padding-top padding-bottom">
					<text class="text-black">确定退出当前账号？</text>
				</view>
				<view class="flex justify-between">
					<view class="bg-light-gray text-center padding-top-sm padding-bottom-sm margin-top margin-right-xs round" style="width: 45%;"
					 @tap="logout">
						<text class="text-white">确认</text>
					</view>
					<view class="bg-light-green text-center padding-top-sm padding-bottom-sm margin-top round" style="width: 45%;"
					 @tap="logout_flag = false">
						<text class="text-white">取消</text>
					</view>
				</view>
			</view>
		</view>

		<view v-if="shade_flag" class="shade bg-black-opacity">
			<view class="bg-white padding padding-top-lg" :class="{'tool':tool_flag,'tool-hide':!tool_flag}">
				<view class="flex justify-end" @tap="closeTools">
					<uni-icons type="closeempty" size="25" class="text-black" />
				</view>
				<view class="margin-top flex align-center" @tap="edit">
					<uni-icons type="compose" size="25" class="text-black" />
					<text class="margin-left-xs">编辑信息</text>
				</view>
				<view class="margin-top flex align-center" @tap="openbox">
					<view style="transform: rotate(90deg);">
						<uni-icons type="upload" size="25" class="text-black" />
					</view>
					<text class="margin-left-xs">退出登录</text>
				</view>
			</view>
		</view>

		<!-- 删除确认框 -->
		<view v-if="del_box_flag" class="shade bg-black-opacity">
			<view class="praise-box shadow-black bg-white padding border-box round">
				<view class="text-center padding-top padding-bottom">
					<text class="text-black">确定删除该作品？</text>
				</view>
				<view class="flex justify-between">
					<view class="bg-light-gray text-center padding-top-sm padding-bottom-sm margin-top margin-right-xs round" style="width: 45%;"
					 @tap="delete_compelete">
						<text class="text-white">确认</text>
					</view>
					<view class="bg-light-green text-center padding-top-sm padding-bottom-sm margin-top round" style="width: 45%;"
					 @tap="del_box_flag = false">
						<text class="text-white">取消</text>
					</view>
				</view>
			</view>
		</view>

		<view v-if="delete_flag" class="delete-btn flex bg-black justify-center align-center fixed" @tap="del_box_flag = true">
			<text class="text-white">删除</text>
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
				img: 'https://s3.ax1x.com/2021/01/27/svj2jS.jpg', //
				name: 'KIDDO',
				shade_flag: false,
				tool_flag: false,
				praise_flag: false,
				logout_flag: false,
				praise_num: 0,
				classify_active: 0,
				classify: [{
						name: '作品'
					},
					{
						name: '私密'
					},
					{
						name: '喜欢'
					},
					{
						name: '相册'
					}
				],
				video_status: false,
				videos: [],
				message: '',
				delete_flag: false,
				delete_video: {},
				del_box_flag: false,
				delete_mask_flag: false
			}
		},
		methods: {
			openTools() {
				this.shade_flag = true
				this.tool_flag = true
			},
			closeTools() {
				this.tool_flag = false
				setTimeout(() => {
					this.shade_flag = false
				}, 300)
			},
			edit() {
				this.closeTools()
				uni.navigateTo({
					url: '/pages/edit/edit'
				})
			},
			openbox() {
				this.closeTools()
				this.logout_flag = true
			},
			logout() {
				this.logout_flag = false
				this.$store.commit('setToken', '')
				this.$store.commit('setUserInfo', {})
				this.$store.commit('setIsLoginJust', true)
				this.$store.commit('clearFollowVideo')
				this.$store.commit('clearRecommendedVideo')
				uni.switchTab({
					url: '/pages/tabBar/home/home'
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
				// console.log(this.classify[index].name)


				let _self = this
				let userName = this.$store.getters.getUserInfo.userName
				let userId = this.$store.getters.getUserInfo.id

				// console.log(userName)
				// console.log(userId)

				this.message = ''
				_self.videos = []
				// console.log(_self.videos)

				if (this.classify_active == 0) {
					this.video_status = false
					uni.request({
						url: _self.$store.getters.getHttp + '/video/getVideoByUserName',
						method: 'get',
						data: {
							userName: userName,
						},
						// #ifdef H5
						withCredentials: true,
						// #endif
						success(res) {
							// console.log(res)

							setTimeout(() => {
								_self.videos = []
								_self.praise_num = 0
								res.data.data.forEach(e => {
									let item = {
										videoCover: e.videoCover,
										thumbs: e.thumbs,
										status: false,
										videoId: e.id,
										userId: e.user.id,
										headImg: e.user.headImg,
										nickName: e.user.nickName,
										fileUrl: e.fileUrl,
										videoDesc: e.videoDesc,
										userName: e.user.userName,
										delete_item: false
									}
									_self.videos.push(item)
									_self.praise_num += e.thumbs
								})
								_self.video_status = true

								if (_self.videos.length == 0) {
									_self.message = '还未发布作品，点击下方拍摄vlog'
								}
							}, 2000)
						}
					})
				} else if (this.classify_active == 1) {
					this.message = '未开放私密功能'
				} else if (this.classify_active == 2) {
					// console.log('我的喜欢')
					this.video_status = false
					uni.request({
						url: _self.$store.getters.getHttp + '/video/getMyThumbup',
						method: 'get',
						data: {
							userId: userId,
						},
						// #ifdef H5
						withCredentials: true,
						// #endif
						success(res) {
							// console.log(res)

							setTimeout(() => {
								_self.videos = []
								res.data.data.forEach(e => {
									let item = {
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
									}
									_self.videos.push(item)
								})
								_self.video_status = true

								if (_self.videos.length == 0) {
									_self.message = '还没有喜欢的作品，去首页查看最新视频'
								}
							}, 2000)
						}
					})
				} else {
					this.message = '我的相册'
				}


			},
			// 视频封面加载完毕
			load(index) {
				if (this.videos[index]) this.$set(this.videos[index], 'status', true)
			},
			tapToFull(video) {
				console.log(video)
				this.$store.commit('setIsLoginsJust', false)
				uni.navigateTo({
					url: '/pages/fullscreen/fullscreen?video=' + JSON.stringify(video)
				})
			},
			cancelDelete(video, index) {
				this.$set(video, 'delete_item', false)
				this.delete_flag = false
			},
			deleteVideo(video, index) {
				this.delete_mask_flag = true
				if (video.userId == this.$store.getters.getUserInfo.id && this.classify_active == 0) {

					if (video == this.delete_video) {
						this.delete_video = {}
						this.delete_flag = false
						this.del_box_flag = false
						this.delete_mask_flag = false
					} else {
						this.delete_video = video
						this.delete_flag = true
						this.videos[index].delete_item = true
						this.videos.forEach((e, i) => {
							if (i !== index) {
								e.delete_item = false
							}
						})
					}
				}
			},
			delete_compelete() {
				console.log(this.delete_video.videoId)
				console.log(this.delete_video)
				let _self = this
				uni.request({
					url: _self.$store.getters.getHttp + '/video/deleteVideo',
					method: 'get',
					data: {
						id: _self.delete_video.videoId,
					},
					withCredentials: true,
					success(res) {
						if (res.data.code == 0) {
							_self.videos = _self.videos.filter(e => e.videoId !== _self.delete_video.videoId)
							_self.delete_video = {}
							_self.delete_flag = false
							_self.del_box_flag = false
							_self.delete_mask_flag = false
						} else {
							console.log('删除失败')
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			}
		},
		// beforeCreate() {
		// 	if (!this.$store.getters.getToken) {
		// 		console.log('没有token')
		// 		uni.navigateTo({
		// 			url: '../../login/login'
		// 		})
		// 	}
		// },
		created() {
			// #ifdef APP-PLUS
			this.statusBarHeight = Vue.prototype.statusBarHeight
			// #endif
		},
		mounted() {
			this.switchClassify(0)
		},
		onShow() {
			if (!this.$store.getters.getToken) {
				this.$store.commit('setMyPageFlag', true)
				uni.navigateTo({
					url: '../../login/login'
				})
			} else {
				let user = this.$store.getters.getUserInfo
				// console.log(user)
				this.name = user.nickName
				this.img = user.headImg
				console.log(this.$store.getters.getIsLoginsJust)
				if (this.$store.getters.getIsLoginsJust) {
					this.$store.commit('setIsLoginsJust', false)
					this.switchClassify(0)
				}
				// console.log(this.img)
			}
		},
		onPageScroll(e) {
			this.scroll_status = e.scrollTop > 0
		},
		onHide() {
			this.praise_flag = false
			this.shade_flag = false
			
			this.delete_flag = false
			this.del_box_flag = false
			this.delete_mask_flag = false
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
		position: relative;
		border-radius: 20rpx 20rpx 0 0;
		overflow: hidden;

		.bg {
			width: 120%;
			height: 120%;
			filter: blur(50rpx);
			background-color: #000000;
			background-position: top center;
			background-repeat: no-repeat;
			background-size: 100%;
			position: absolute;
			top: -10%;
			left: -10%;
			z-index: -1;
		}

		.avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			overflow: hidden;
			border: 6rpx solid #FFFFFF;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				display: block;
			}
		}
	}

	.suspend {
		min-height: 200rpx;
		position: relative;
		top: -60rpx;
	}

	.classify-box {
		position: relative;

		.curr-classify {
			width: 25%;
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

				.check {
					position: absolute;
					width: 100%;
					height: 100%;
					background-color: rgba(0, 0, 0, .3);

					.inner-check {
						position: absolute;
						top: 10rpx;
						right: 10rpx;
					}
				}
			}

			.like {
				width: 100%;
				position: absolute;
				bottom: 0;
				background-color: rgba(0, 0, 0, .3);
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

	.tool {
		box-sizing: border-box;
		width: 40%;
		position: fixed;
		right: -40%;
		height: 100%;
		animation: show .3s ease-in-out forwards;
	}

	@keyframes show {
		from {
			right: -40%;
		}

		to {
			right: 0;
		}
	}

	.tool-hide {
		box-sizing: border-box;
		width: 40%;
		position: fixed;
		right: 0;
		height: 100%;
		animation: hide .3s ease-in-out forwards;
	}

	@keyframes hide {
		from {
			right: 0;
		}

		to {
			right: -40%;
		}
	}

	.delete-btn {
		bottom: 0;
		width: 100%;
		height: 100rpx;
	}
</style>
