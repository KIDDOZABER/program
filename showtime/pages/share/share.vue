<template>
	<view class="bg-white">
		<!-- #ifdef APP-PLUS -->
		<view class="status-bar bg-white" :style="'height:'+statusBarHeight+'px;'"></view>
		<!-- #endif -->
		<!-- 关闭按钮 -->
		<view class="padding flex justify-between align-center">
			<uni-icons type="back" size="25" class="text-black" @tap="tapBack" />
			<img @tap="home_flag = true" src="https://s3.ax1x.com/2021/01/30/yFXBV0.png" alt="">
		</view>
		<view class="padding-left padding-right">
			<view class="flex border-bottom-light-gray-2rpx padding-bottom">
				<view class="flex flex-column img-box">
					<view class="img" @tap="play_flag = !play_flag">
						<img :src="temp_image" alt="">
						<view class="play" v-if="!play_flag">
							<img src="https://s3.ax1x.com/2021/01/30/ykSwNt.png" alt="">
						</view>
					</view>
					<view class="text bg-black text-center text-sm padding-xs" @tap="chooseImage">
						<text>设置封面</text>
					</view>
				</view>
				<view class="padding-left padding-top-xs flex-grow">
					<textarea class="share-text" placeholder="这一刻想分享点什么~" v-model="summary" @input="inputSummary" />
					</view>
			</view>
			
			<video v-if="play_flag" class="video margin-top" autoplay :src="temp_media"
			controls @ended="playEnd"></video>
			
		</view>
		
		<view class="push-button padding-left padding-right border-box">
			<view class="margin-bottom flex align-center">
				<text>分享到</text>
				<view class="flex-grow flex justify-around margin-left-lg">
					<uni-icons v-for="(item,index) in share_types" :key="index" :type="item" size="25" class="text-light-green" @tap="tapShare(item)" />
				</view>
			</view>
			<view class="bg-light-green round padding-top-sm padding-bottom-sm text-center" @tap="shareMedia">
				<text class="text-white">分享到Melody</text>
			</view>
		</view>
		
		<!-- 分享框提示 -->
		<view v-if="share_tip_flag" class="shade bg-black-opacity">
			<view class="share-box shadow-black bg-white padding border-box round">
				<view class="flex align-center">
					<uni-icons type="smallcircle-filled" size="10" class="text-light-green" />
					<text class="margin-left-sm">视频已保存到相册；</text>
				</view>
				<view class="flex align-center margin-top-sm">
					<uni-icons type="smallcircle-filled" size="10" class="text-light-green" />
					<text class="margin-left-sm">{{share_provider}}限制分享，请打开{{share_provider}}上传分享哦！</text>
				</view>
				<view class="bg-light-green text-center padding-top-sm padding-bottom-sm margin-top round" @tap="share_tip_flag = false">
					<text class="text-white">好的</text>
				</view>
			</view>
		</view>
		
		<!-- 返回首页提示 -->
		<view v-if="home_flag" class="shade bg-black-opacity">
			<view class="home-box shadow-black bg-white padding border-box round">
				<view class="text-center padding-top padding-bottom">
					<text class="text-black">视频还未上传，确定退出吗</text>
				</view>
				<view class="flex justify-between">
					<view style="width: 45%;" class="bg-light-gray text-center padding-top-sm padding-bottom-sm margin-top round" @tap="praise_flag = false">
						<text class="text-white" @tap="gohome">确认</text>
					</view>
					<view style="width: 45%;" class="bg-light-green text-center padding-top-sm padding-bottom-sm margin-top round"
					 @tap="home_flag = false">
						<text class="text-white">取消</text>
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
				play_flag: false,
				temp_image: 'https://s3.ax1x.com/2021/01/27/svj2jS.jpg',
				temp_path: '',
				temp_media: 'https://vd2.bdstatic.com/mda-kebs3a92kh5a15nj/sc/mda-kebs3a92kh5a15nj.mp4?playlist=%5B%22hd%22%2C%22sc%22%5D&v_from_s=gz_videoui_4135&auth_key=1611918162-0-0-f2519526d49f58af761aa4dd13bd3f9a&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=',
				summary: '',
				share_types: [
					'qq',
					'weixin',
					'pengyouquan',
					'weibo'
				],
				share_tip_flag: false,
				share_provider: '',
				message: '',
				message_status: false,
				loading_flag: false,
				home_flag: false
			}
		},
		methods: {
			tapBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			gohome() {
				uni.switchTab({
					url: '/pages/tabBar/home/home'
				})
			},
			chooseImage() {
				let _self = this
				uni.chooseImage({
					sourceType: ['album'],
					count: 1,
					success(res) {
						console.log(res.tempFilePaths)
						_self.temp_image = res.tempFilePaths[0]
						
						_self.loading_flag = true
						uni.uploadFile({
							url: _self.$store.getters.getHttp+'/video/uploadHeadImg',
							filePath: _self.temp_image,
							name: 'file',
							header: {
								'Content-Type': 'multipart/form-data'
							},
							success(res) {
								let data = JSON.parse(res.data)
								_self.temp_image = data.data.url
								
								_self.loading_flag = false
								_self.message_status = true
								_self.message = '封面上传成功'
								setTimeout(() => {
									_self.message_status = false
								}, 2000)
							},
							fail(err) {
								_self.loading_flag = false
								_self.message_status = true
								_self.message = '封面上传失败'
								setTimeout(() => {
									_self.message_status = false
								}, 2000)
							}
						})
					}
				})
			},
			playEnd() { // 播放完毕恢复图片
				this.play_flag = false
			},
			inputSummary() {
				this.summary = this.summary
			},
			tapShare(item) {
				let provider, type, scene, mediaUrl, summary
				if(item == 'qq') {
					this.share_provider = 'QQ'
					this.share_tip_flag = true
					return
				} else if(item == 'weixin') {
					provider = 'weixin'
					type = 4
					scene = 'WXSceneSession'
					mediaUrl = this.temp_media
					summary = this.summary
				} else if(item == 'pengyouquan') {
					provider = 'weixin'
					type = 4
					scene = 'WXSenceTimeline'
					mediaUrl = this.temp_media
					summary = this.summary
				} else {
					this.share_provider = '微博'
					this.share_tip_flag = true
					return
				}
				
				uni.share({
					provider: provider,
					type: type,
					scene: scene,
					mediaUrl: mediaUrl,
					summary: summary,
					success() {
						console.log('成功')
					}
				})
			},
			shareMedia() {
				let _self = this
				let user = this.$store.getters.getUserInfo
				
				this.loading_flag = true
				
				console.log(_self.temp_media)
				console.log(_self.temp_path)
				
				uni.request({
					url: _self.$store.getters.getHttp+'/video/saveVideo',
					method: 'post',
					data: {
						fileName: '视频标题111',
						filePath: _self.temp_path,
						fileUrl: _self.temp_media,
						introduce: _self.brif,
						user: {
							id: user.id,
							gender: '男',
							password: user.password,
							userName: user.userName
						},
						videoCover: _self.temp_image,
						videoDesc: _self.summary
					},
					// #ifdef H5
					withCredentials: true,
					// #endif
					success(res) {
						
						_self.loading_flag = false // 关闭加载动画
						_self.message_status = true
						_self.message = res.data.msg
						
						if(res.data.code == 0) {
							setTimeout(() => {
								_self.message_status = false
								
								_self.summary = ''
								_self.temp_media = ''
								_self.temp_path = ''
								
								uni.navigateBack({
									delta: 1
								})
							}, 2000)
						} else {
							setTimeout(() => {
								_self.message_status = false
							}, 2000)
						}
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
		onLoad(options) {
			this.temp_media = options.url
			this.temp_path = options.path
			
			// console.log(this.temp_media)
			// console.log(this.temp_path)
			
		},
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

	.img-box {
		width: 150rpx;

		.img {
			width: 100%;
			height: 150rpx;
			position: relative;

			img {
				width: 100%;
				height: 100%;
				display: block;
				object-fit: cover;
			}
			
			.play {
				width: 48rpx;
				position: absolute;
				top: 50%;
				margin-top: -24rpx;
				left: 50%;
				margin-left: -30rpx;
			}
		}
		
		.text {
			width: 100%;
			box-sizing: border-box;
			border-radius: 0 0 10rpx 10rpx;
		}
	}
	
	.share-text {
		width: 100%;
		height: 200rpx;
	}
	
	.video {
		width: 100%;
	}
	
	.push-button {
		width: 100%;
		position: fixed;
		bottom: 20rpx;
	}
	
	.share-box,.home-box {
		width: 500rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -150rpx;
		margin-left: -250rpx;
	}
</style>
