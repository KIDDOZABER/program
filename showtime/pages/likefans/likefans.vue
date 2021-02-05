<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status-bar bg-white" :style="'height:'+statusBarHeight+'px;'"></view>
		<!-- #endif -->
		<!-- 顶部导航 -->
		<view class="padding-top padding-left padding-right flex justify-between align-center bg-white">
			<uni-icons type="back" size="25" @tap="tapBack" />
			<text>生不逢时</text>
			<img src="https://s3.ax1x.com/2021/02/02/ymYR76.png" alt="">
		</view>
		<view class="nav-box bg-white flex justify-around padding-top-sm">
			<view class="flex-item border-bottom-white padding-bottom-sm text-center" v-for="(item,index) in nav" :key="index" @tap="switchNav(index)">
				<text :class="{'text-light-green':index==nav_active,'text-light-gray':true}">{{item.name}}&ensp;{{item.num}}</text>
			</view>
			<view class="curr-nav bg-light-green" :style="'left:'+50*nav_active+'%;'"></view>
		</view>
		<scroll-view scroll-y class="scroll-box bg-white" :style="'height:'+scroll_height+'px;'">
			<view v-if="nav[nav_active].num==0" class="padding text-center">
				<text>哎呀！一个{{nav[nav_active].name}}也没有</text>
			</view>
			<view v-else>
				<view v-if="!users_status" class="padding-top flex justify-center">
					<loading></loading>
				</view>
				<view v-for="(item,index) in users" :key="index" class="flex justify-between align-center padding-left padding-right padding-top-sm padding-bottom-sm">
					<view class="flex align-center" @tap="gotoUser(item)">
						<view class="avatar bg-white">
							<img :src="item.headImg" alt="">
						</view>
						<view class="margin-left-sm">
							<view>{{item.nickName}}</view>
							<view class="text-sm text-gray in-line">{{item.introduce?item.introduce:'这个人太懒了，什么也没写'}}</view>
						</view>
					</view>
					<!-- 粉丝关注按钮 -->
					<view v-if="nav_active" class="round text-center padding-top-xs padding-bottom-xs like-not text-white" :class="{'bg-gray':item.status,'bg-light-green':!item.status}" @tap="tapLikeOrNot(item.status,index)">
						<text>{{item.status?'互相关注':'回关'}}</text>
					</view>
					<!-- 关注的关注按钮 -->
					<view v-else class="round text-center padding-top-xs padding-bottom-xs like-not text-white" :class="{'bg-gray':item.status,'bg-light-green':!item.status}" @tap="tapLikeOrNot(item.status,index)">
						<text>{{item.status?'已':''}}关注</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scroll_height: 0,
				nav_active: 0,
				nav: [
					{
						name: '关注',
						num: 0
					},
					{
						name: '粉丝',
						num: 0,
					}
				],
				users_status: false,
				users: [],
				likes: [],
				fans: [],
			}
		},
		methods: {
			tapBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			switchNav(index) {
				this.nav_active = index
				this.users = []
				this.users_status = false
				
				let id = this.$store.getters.getUserInfo.id
				let _self = this
				console.log(id)
				
				if(index) { // 粉丝
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
							// console.log(res)
							
							_self.fans = []
							
							res.data.data.forEach(e => {
								let item = JSON.parse(JSON.stringify(e.fans))
								
								uni.request({
									url: _self.$store.getters.getHttp+'/user/isFocusON',
									method: 'get',
									data: {
										fansId: id, // 这里是我的id
										focusId: item.id // 这里是粉丝id
									},
									// #ifdef H5
									withCredentials: true,
									// #endif
									success(res) {
										_self.$set(item, 'status', res.data.data)
										_self.fans.push(item)
									}
								})
								
							})
							
							setTimeout(() => {
								console.log('粉丝')
								_self.users = _self.fans
								_self.users_status = true
							},2000)
						}
					})
				} else { // 关注
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
							console.log(res)
							
							_self.likes = []
							
							res.data.data.forEach(e => {
								let item = JSON.parse(JSON.stringify(e.focus))
								_self.$set(item, 'status', true)
								_self.likes.push(item)
							})
							
							setTimeout(() => {
								console.log('关注')
								_self.users = _self.likes
								_self.users_status = true
							},2000)
						}
					})
				}
			},
			gotoUser(user) {
				console.log(user)
				let userName = user.userName
				
				uni.navigateTo({
					url: '/pages/user/user?userName='+userName
				})
			},
			tapLikeOrNot(status,index) {
				let _self = this
				let id = this.$store.getters.getUserInfo.id
				
				if(status) { // true，现在点击就是取消关注
					uni.request({
						url: _self.$store.getters.getHttp+'/user/cancelFocusON',
						method: 'get',
						data: {
							fansId: id,
							focusId: _self.users[index].id
						},
						// #ifdef H5
						withCredentials: true,
						// #endif
						success(res) {
							console.log(res)
							_self.$set(_self.users[index], 'status', !status)
							_self.getLikeFansCount()
							
							let recommendedVideos = _self.$store.getters.getRecommendedVideos
							recommendedVideos.forEach(e => {
								if(e.user.id == _self.users[index].id) {
									_self.$set(e, 'follow_flag', !status)
								}
							})
							let followVideos = _self.$store.getters.getFollowVideos
							followVideos = followVideos.filter(e => e.user.id !== _self.users[index].id)
							_self.$store.commit('setFollowVideo', followVideos)
							
						}
					})
				} else {
					uni.request({
						url: _self.$store.getters.getHttp+'/user/focusON',
						method: 'get',
						data: {
							fansId: id,
							focusId: _self.users[index].id
						},
						// #ifdef H5
						withCredentials: true,
						// #endif
						success(res) {
							console.log(res)
							_self.$set(_self.users[index], 'status', !status)
							_self.getLikeFansCount()
							
							let recommendedVideos = _self.$store.getters.getRecommendedVideos
							recommendedVideos.forEach(e => {
								if(e.user.id == _self.users[index].id) {
									_self.$set(e, 'follow_flag', !status)
								}
							})
						}
					})
				}
			},
			getLikeFansCount() {
				let id = this.$store.getters.getUserInfo.id
				let _self = this
				// console.log(id)
				
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
						_self.$set(_self.nav[0], 'num', res.data.count)
					}
				})
				
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
						_self.$set(_self.nav[1], 'num', res.data.count)
					}
				})
			}
		},
		created() {
			this.statusBarHeight = 0
			// #ifdef APP-PLUS
			this.statusBarHeight = Vue.prototype.statusBarHeight
			// #endif
		},
		mounted() {
			let _self = this
			this.$tools.getRect(".scroll-box").then(res => {
				_self.scroll_height = _self.$store.getters.getWinH - res.top
			})
		},
		onLoad(options) {
			this.getLikeFansCount()
			
			this.nav_active = parseInt(options.nav)
			this.switchNav(this.nav_active)
		}
	}
</script>

<style lang="less">
	@import '@/static/less/base.less';
	
	.nav-box {
		position: relative;
		
		.curr-nav {
			width: 50%;
			height: 4rpx;
			position: absolute;
			bottom: 0;
			left: 0;
			transition: all .3s ease-in-out;
		}
	}
	
	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		overflow: hidden;
		border: 2rpx solid #000000;
	
		img {
			width: 100%;
			height: 100%;
			display: block;
			object-fit: cover;
		}
	}
	
	.like-not {
		width: 150rpx;
	}
</style>
