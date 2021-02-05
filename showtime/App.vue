<script>
	export default {
		onLaunch: function() {
			// console.log('App Launch')
			uni.getSystemInfo({
				success: res => {
					// console.log(res)
					// #ifdef APP-PLUS
					Vue.prototype.statusBarHeight = res.statusBarHeight
					// console.log(Vue.prototype.statusBarHeight)
					// #endif
					this.$store.commit('setWinH', res.windowHeight)
				}
			})
			// #ifdef APP-PLUS
			uni.onTabBarMidButtonTap(() => {
				if(this.$store.getters.getToken) {
					uni.navigateTo({
						url: "/pages/shoot/shoot"
					})
				} else {
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}
			})
			// #endif
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
