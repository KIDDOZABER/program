<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status-bar bg-white" :style="'height:'+statusBarHeight+'px;'"></view>
		<!-- #endif -->
		<!-- 顶部导航 -->
		<view class="padding-top padding-left padding-right flex justify-between align-center bg-white">
			<uni-icons type="back" size="25" @tap="tapBack" />
			<text>编辑资料</text>
			<img src="https://s3.ax1x.com/2021/02/02/ymYR76.png" alt="">
		</view>
		<view class="padding">
			<view class="flex flex-column align-center">
				<view class="avatar bg-black margin-right" @tap="changeAvatar">
					<view class="camera flex justify-center align-center">
						<uni-icons type="camera" class="text-white" size="25" />
					</view>
					<img v-if="!avatar_status" src="https://s3.ax1x.com/2021/01/29/yC4lp8.png" alt="">
					<img :src="avatar" alt="" @load="loadAvatar">
				</view>
				<text class="text-sm margin-top-sm text-bold">点击更换头像</text>
			</view>
			<view>
				<view class="flex align-center justify-between margin-top-lg">
					<text class="text-bold">昵称</text>
					<view class="flex align-center">
						<input type="text" class="text-gray text-right" v-model="nick_name" @input="input">
						<uni-icons type="forward" class="text-gray" size="20" />
					</view>
				</view>
				<view class="flex align-center justify-between margin-top-sm">
					<text class="text-bold">账号</text>
					<view class="flex align-center" @tap="editAccount">
						<text>{{account}}</text>
						<uni-icons type="forward" class="text-gray" size="20" />
					</view>
				</view>
				<view class="flex align-center justify-between margin-top-sm">
					<text class="text-bold">简介</text>
					<view class="flex align-center">
						<input type="text" class="text-gray text-right" v-model="brif" @input="input">
						<uni-icons type="forward" class="text-gray" size="20" />
					</view>
				</view>
			</view>
		</view>
		<view class="complete-btn padding-left padding-right border-box">
			<view class="bg-light-green round padding-top-sm padding-bottom-sm text-center" @tap="complete">
				<text class="text-white">完成</text>
			</view>
		</view>

		<view v-if="save_flag" class="shade bg-black-opacity">
			<view class="save-box shadow-black bg-white padding border-box round">
				<view class="text-center padding-top padding-bottom">
					<text class="text-black">信息还未保存，确定退出吗</text>
				</view>
				<view class="flex justify-between">
					<view style="width: 45%;" class="bg-light-gray text-center padding-top-sm padding-bottom-sm margin-top round" @tap="praise_flag = false">
						<text class="text-white" @tap="back">确认</text>
					</view>
					<view style="width: 45%;" class="bg-light-green text-center padding-top-sm padding-bottom-sm margin-top round"
					 @tap="praise_flag = false">
						<text class="text-white" @tap="save_flag = false">取消</text>
					</view>
				</view>
			</view>
		</view>
		
		<view v-if="message_status" class="shade">
			<view class="message message-bottom">
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
				avatar_status: false,
				avatar: 'https://s3.ax1x.com/2021/01/27/svj2jS.jpg', //
				nick_name: 'KIDDO',
				account: '111225',
				brif: '写点什么...',
				change_flag: false,
				save_flag: false,
				message: '',
				message_status: false,
				loading_flag: false
			}
		},
		methods: {
			tapBack() {
				if (this.change_flag) {
					this.save_flag = true
				} else {
					this.back()
				}
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 头像加载成功
			loadAvatar() {
				this.avatar_status = true
			},
			changeAvatar() {
				let _self = this
				uni.chooseImage({
					sourceType: ['album'],
					count: 1,
					success(res) {
						_self.change_flag = true
						_self.avatar = res.tempFilePaths[0]
						
						this.loading_flag = true
						
						uni.uploadFile({
							url: _self.$store.getters.getHttp+'/user/uploadHeadImg',
							filePath: _self.avatar,
							name: 'file',
							header: {
								'Content-Type': 'multipart/form-data'
							},
							success(res) {
								let data = JSON.parse(res.data)
								_self.avatar = data.data.url
								
								_self.loading_flag = false
								_self.message_status = true
								_self.message = '头像上传成功'
								setTimeout(() => {
									_self.message_status = false
								}, 2000)
							},
							fail(err) {
								_self.loading_flag = false
								_self.message_status = true
								_self.message = '头像上传失败'
								setTimeout(() => {
									_self.message_status = false
								}, 2000)
							}
						})
					}
				})
			},
			input() {
				this.change_flag = true
			},
			editAccount() {
				this.message_status = true
				this.message = '账号无法修改'
				setTimeout(() => {
					this.message_status = false
				}, 2000)
			},
			complete() {
				if (this.change_flag) {
					
					if(!/^.{1,8}$/.test(this.nick_name)) {
						this.message_status = true
						this.message = '昵称长度只能为1-8位'
						setTimeout(() => {
							this.message_status = false
						}, 2000)
					} else if(!/^.{0,20}$/.test(this.brif)) {
						this.message_status = true
						this.message = '简介只能为20个字符以内'
						setTimeout(() => {
							this.message_status = false
						}, 2000)
					} else {
						let _self = this
						this.loading_flag = true
						
						uni.request({
							url: _self.$store.getters.getHttp+'/user/updateUser',
							method: 'post',
							data: {
								id: _self.$store.getters.getUserInfo.id,
								headImg: _self.avatar,
								nickName: _self.nick_name,
								introduce: _self.brif
							},
							// #ifdef H5
							withCredentials: true,
							// #endif
							success(res) {
								
								// 更改缓存里的用户信息
								if(res.data.code == 0) {
									let user = _self.$store.getters.getUserInfo
									_self.$set(user, 'headImg', _self.avatar)
									_self.$set(user, 'nickName', _self.nick_name)
									_self.$set(user, 'introduce', _self.brif)
									_self.$store.commit('setUserInfo', user)
								}
								
								_self.change_flag = false // 恢复更改状态
								_self.loading_flag = false // 关闭加载动画
								_self.message_status = true
								_self.message = res.data.msg
								setTimeout(() => {
									_self.message_status = false
								}, 2000)
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
		onShow() {
			let user = this.$store.getters.getUserInfo
			this.avatar = user.headImg
			this.nick_name = user.nickName
			this.account = user.userName
			this.brif = user.introduce ? user.introduce : '写点什么...'
		}
	}
</script>

<style lang="less">
	@import '@/static/less/base.less';

	.avatar {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		overflow: hidden;
		border: 6rpx solid #FFFFFF;
		margin: 0 auto;
		position: relative;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
			opacity: .5;
		}

		.camera {
			position: absolute;
			width: 100%;
			height: 100%;
		}
	}

	.complete-btn {
		width: 100%;
		position: fixed;
		bottom: 20rpx;
	}

	.save-box {
		width: 500rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -150rpx;
		margin-left: -250rpx;
	}
</style>
