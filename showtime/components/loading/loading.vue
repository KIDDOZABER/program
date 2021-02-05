<template>
	<view class="loading">
		<view :class="{'item':true,'item-active':item==loading_active}" v-for="item in 3" :key="item"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading_active: 1
			}
		},
		methods: {
			lauchInterval() {
				const _self = this
				if (this.interval !== undefined) {
					clearInterval(this.interval)
				}
				this.interval = setInterval(() => {
					// console.log(_self.swiper_list[_self.swiper_active].value)
					if (_self.loading_active < 3) {
						_self.loading_active++
					} else {
						_self.loading_active = 1
					}
				}, 100)
			}
		},
		mounted() {
			// console.log('mounted')
			this.lauchInterval()
		},
		destroyed() {
			// console.log('desloading')
			clearInterval(this.interval)
		}
	}
</script>

<style lang="less">
	@import '@/static/less/base.less';
	
	.loading {
		display: flex;
		
		.item {
			width: 10rpx;
			height: 10rpx;
			background-color: @light_green;
			margin-right: 10rpx;
			border-radius: 5rpx;
		}
		
		.item-active {
			background-color: @dark_green;
		}
	}
</style>
