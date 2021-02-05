<template>
	<view>
		<view class="words wel-left">
			<text>多年以后</text>
		</view>
		<view class="words wel-right">
			<text>愿你不负所期</text>
		</view>
		<view v-if="jump_status" class="text-right margin-top padding jump">
			<text class="bg-black opacticy round padding-left-sm padding-right-sm" @tap="jump">{{time}}&ensp;跳过</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				jump_status: false,
				time: 3,
				wait: 2
			}
		},
		methods: {
			lauchInterval() {
				if(this.interval !== undefined) {
					clearInterval(this.interval)
				}
				this.interval = setInterval(() => {
					this.time--
					if(this.time == 0) {
						setTimeout(() => {
							this.jump()
						},1000)
					}
				},1000)
			},
			jump() {
				if(this.interval !== undefined) {
					clearInterval(this.interval)
				}
				uni.switchTab({
					url: '/pages/tabBar/home/home'
				})
			}
		},
		mounted() {
			setTimeout(() => {
				this.jump_status = true
				this.lauchInterval()
			},this.wait*1000)
		}
	}
</script>

<style lang="less">
	@import '@/static/less/base.less';
	
	.words {
		width: 20rpx;
		font-size: 48rpx;
		font-weight: lighter;
		position: absolute;
	}

	.wel-left {
		top: 25%;
		left: 40%;
	}

	.wel-right {
		top: 35%;
		left: 50%;
	}
	
	.jump {
		animation: show .3s forwards;
	}
	
	@keyframes show {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
