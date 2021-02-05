<template>
	<view class="bg-white" :style="'height:'+windowHeight+'px;'">
		<!-- #ifdef APP-PLUS -->
		<view class="status-bar bg-white" :style="'height:'+statusBarHeight+'px;'"></view>
		<!-- #endif -->
		<!-- 关闭按钮 -->
		<view class="padding">
			<uni-icons type="closeempty" size="25" class="text-black" @tap="tapClose" />
		</view>
		<video v-if="tempFilePath" class="video" :src="tempFilePath" controls autoplay :style="'height:'+video_height+'px;'"></video>
		<view v-else class="video bg-black" :style="'height:'+video_height+'px;'"></view>
		<!-- 未拍摄 -->
		<view v-if="!tempFilePath">
			<view class="shoot-choose flex align-center justify-around padding-top-xl">
				<view @tap="shoot" class="shoot bg-light-green">
					<view class="inner bg-white"></view>
				</view>
			</view>
			<view class="fixed upload padding-bottom-sm text-xs">
				<text class="text-black">拍摄</text>
				<text class="text-gray margin-left" @tap="choose">相册</text>
			</view>
		</view>
		<!-- 已拍摄 -->
		<view v-else>
			<view class="shoot-choose flex align-center justify-around padding-top-xl text-xs">
				<view class="flex flex-column align-center">
					<view class="shoot bg-gray" @tap="abandonVideo">
						<view class="inner bg-white flex justify-center align-center">
							<uni-icons type="undo-filled" size="30" class="text-gray" />
						</view>
					</view>
					<text class="text-gray margin-top-sm">返回</text>
				</view>
				<view class="flex flex-column align-center">
					<view class="shoot bg-light-green" @tap="saveVideo">
						<view class="inner bg-white flex justify-center align-center">
							<uni-icons type="checkmarkempty" size="50" class="text-light-green" />
						</view>
					</view>
					<text class="text-light-green margin-top-sm">保存</text>
				</view>
				<view class="flex flex-column align-center">
					<view class="shoot bg-light-green" @tap="shareVideo">
						<view class="inner bg-light-green flex justify-center align-center">
							<uni-icons type="cloud-upload-filled" size="50" class="text-white" />
						</view>
					</view>
					<text class="text-light-green margin-top-sm">分享到Melody</text>
				</view>
			</view>
		</view>

		<view v-if="message_status" class="shade">
			<view class="message message-top2">
				<text>{{message}}</text>
			</view>
		</view>
		
		<view v-if="loading_flag" class="shade flex justify-center align-center">
			<loading-a></loading-a>
		</view>

		<!-- <button type="button" @tap="code">扫一扫</button>
		<button type="button" @tap="shoot">拍一拍</button>
		<button type="default" @tap="save">保存</button>
		<button type="button" @tap="get">获取保存文件</button> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				video_height: 0,
				tempFilePath: '',
				message: '',
				message_status: false,
				loading_flag: false
			};
		},
		methods: {
			// 调用扫码
			code() {
				uni.scanCode({
					success: function(res) {
						console.log(JSON.stringify(res.result));
					}
				});
			},
			// 调用摄像头
			shoot() {
				let _self = this
				uni.chooseVideo({
					sourceType: ['camera'],
					maxDuration: 15,
					success(res) {
						console.log(res)
						_self.tempFilePath = res.tempFilePath
					},
					fail() {
						console.log('打开摄像头失败')
					}
				})
			},
			// 打开相册选择
			choose() {
				let _self = this
				uni.chooseVideo({
					sourceType: ['album'],
					extension: ['mp4'],
					success(res) {
						// console.log(res)
						_self.tempFilePath = res.tempFilePath
					},
					fail() {
						console.log('打开相册失败')
					}
				})
			},
			// 保存
			save() {
				let _self = this
				uni.saveFile({
					tempFilePath: _self.tempFilePath,
					success(res) {
						console.log(res)
					}
				})
			},
			// 
			get() {
				uni.getSavedFileList({
					success(res) {
						console.log(res)
					}
				})
			},
			tapClose() { //关闭当前页面
				let _self = this
				let current_page = getCurrentPages()
				if (current_page[current_page.length - 2] === undefined) {
					uni.switchTab({
						url: _self.$store.getters.getCurTab ? `/${_self.$store.getters.getCurTab}` : '/pages/tabBar/home/home' //若当前tabbar为空，则拼接为'/'，表示根目录

					})
				} else {
					uni.navigateBack({
						delta: 2
					})
				}
			},
			abandonVideo() {
				this.tempFilePath = ''
			},
			saveVideo() {
				// 保存成功
				this.message_status = true
				this.message = '视频已保存至手机相册'
				setTimeout(() => {
					this.message_status = false
					this.tempFilePath = ''
				}, 2000)
			},
			shareVideo() {
				this.uploadMedia(this.tempFilePath)
			},
			uploadMedia(media) {
				let _self = this
				this.loading_flag = true
				uni.uploadFile({
					url: _self.$store.getters.getHttp+'/video/uploadVideo',
					filePath: media,
					name: 'file',
					header: {
						'Content-Type': 'multipart/form-data'
					},
					success(res) {
						// console.log(res)
						let data = JSON.parse(res.data)

						_self.loading_flag = false
						_self.message_status = true
						_self.message = '视频已保存至手机相册'
						setTimeout(() => {
							_self.message_status = false
							
							let path = data.data.path
							let url = data.data.url
							
							_self.tempFilePath = ''
							
							uni.navigateTo({
								url: '/pages/share/share?path=' + path + '&url=' + url
							})
						}, 2000)
					},
					fail(err) {
						_self.loading_flag = false
						_self.message_status = true
						_self.message = '视频保存失败'
						setTimeout(() => {
							_self.message_status = false
						}, 2000)
					}
				})
			}
		},
		created() {
			this.statusBarHeight = 0
			// #ifdef APP-PLUS
			this.statusBarHeight = Vue.prototype.statusBarHeight
			// #endif
			this.windowHeight = this.$store.getters.getWinH
		},
		mounted() {
			this.video_height = 0
			let video_top = 0
			let shoot_choose_top = 0
			let _self = this
			this.$tools.getRect(".video").then(res => {
				video_top = res.top
			})
			this.$tools.getRect(".shoot-choose").then(res => {
				shoot_choose_top = res.top
				_self.video_height = shoot_choose_top - video_top
			})
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

	.video,
	.no-video {
		width: 100%;
	}

	.shoot-choose {
		width: 100%;
		position: fixed;
		bottom: 80rpx;

		.shoot {
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;

			.inner {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
			}
		}
	}

	.upload {
		bottom: 0;
		width: 100%;
		left: 50%;
		margin-left: -28rpx;
	}
</style>
