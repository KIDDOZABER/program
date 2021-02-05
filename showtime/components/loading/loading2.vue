<template>
	<view>
		<view v-if="loading_flag" class="rotate-box">
			<view class="rotate" v-for="item in num" :key="item" :style="'transform: rotate('+360*item/num+'deg);'">
				<view class="dot bg-light-green" :class="{'dot-active':item==dot_active,'dot-active-1':item+1==dot_active,
				'dot-active-2':item+2==dot_active,'dot-active-3':item+3==dot_active,'dot-active-4':item+4==dot_active,
				'dot-active-5':item+5==dot_active,'dot-active-6':item+6==dot_active}"></view>
			</view>
		</view>
		<view v-else>
			<text class="text-sm">网络状态不佳</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				num: 8,
				dot_active: 1,
				time: 0,
				loading_flag: true
			}
		},
		methods: {
			lauchInterval() {
				const _self = this
				if (this.interval !== undefined) {
					clearInterval(this.interval)
				}
				this.interval = setInterval(() => {
					_self.time++
					// if(_self.time == 100) {
					// 	clearInterval(_self.interval)
					// 	_self.loading_flag = false
					// }
					if (_self.dot_active < _self.num) {
						_self.dot_active++
					} else {
						_self.dot_active = 1
					}
				}, 100)
			}
		},
		mounted() {
			// console.log('mounted2')
			this.lauchInterval()
		},
		destroyed() {
			// console.log('desloading2')
			clearInterval(this.interval)
		}
	}
</script>

<style lang="less">
	@import '@/static/less/base.less';
	
	.rotate-box {
		width: 100rpx;
		height: 100rpx;
		position: relative;
		
		.rotate {
			position: absolute;
			top: 50%;
			margin-top: -5rpx;
			left: 0;
			transform: rotate(45deg);
			transform-origin: 50rpx 0rpx;
			
			.dot {
				width: 6rpx;
				height: 6rpx;
				border-radius: 50%;
			}
			
			.dot-active {
				width: 20rpx;
				height: 20rpx;
			}
			
			.dot-active-1 {
				width: 18rpx;
				height: 18rpx;
			}
			
			.dot-active-2 {
				width: 16rpx;
				height: 16rpx;
			}
			
			.dot-active-3 {
				width: 14rpx;
				height: 14rpx;
			}
			
			.dot-active-4 {
				width: 12rpx;
				height: 12rpx;
			}
			
			.dot-active-5 {
				width: 10rpx;
				height: 10rpx;
			}
			
			.dot-active-6 {
				width: 8rpx;
				height: 8rpx;
			}
		}
	}
	
</style>
