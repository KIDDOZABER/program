<template>
	<view>
		<!-- 关闭按钮 -->
		<view :style="'margin-top:'+statusBarHeight+'px'" class="close-btn">
			<uni-icons type="closeempty" size="25" @tap="tapClose" />
		</view>
		<view class="content">
			<!-- 切换 -->
			<view class="handover">
				<view :class="{'item':true,'item_active':index==handover_active}" v-for="(item,index) in handover_list" :key="index">
					<text @tap="handover(item,index)">{{item.item}}</text>
				</view>
			</view>
			<!-- 处理 -->
			<view class="handle">
				<!-- 登录 -->
				<view class="login" v-if="login">
					<view class="border-bottom-light-gray margin-bottom item" @tap="login_active=1" :class="{'boder-active': login_active==1}">
						<input type="text" v-model="account" placeholder="请输入账号" @input="loginFocus">
					</view>
					<view class="border-bottom-light-gray item flex justify-between" @tap="login_active=2" :class="{'boder-active': login_active==2}">
						<input v-if="pwd_eye" class="flex-grow margin-right-sm" type="text" v-model="pwd" placeholder="请输入密码" @input="loginFocus">
						<input v-else class="flex-grow margin-right-sm" type="password" v-model="pwd" placeholder="请输入密码" @input="loginFocus">
						<uni-icons type="eye" class="text-light-gray" :class="{'text-black':pwd_eye}" size="25" @tap="pwd_eye = !pwd_eye" />
					</view>
					<view class="flex justify-between text-gray padding-top-xs tip">
						<text @tap="messageLogin">短信登录</text>
						<text @tap="forgetPwd">忘记密码？</text>
					</view>
					<view class="margin-top-lg bg-gray text-center padding-top-xs padding-bottom-xs round" :class="{'bg-black':login_status}"
					 @tap="handleLogin">
						<text>登&ensp;录</text>
					</view>
				</view>
				<!-- 注册 -->
				<view class="reg" v-else>
					<view class="border-bottom-light-gray margin-bottom item" @tap="reg_active=1" :class="{'boder-active': reg_active==1}">
						<input type="text" v-model="p_num" placeholder="请输入手机号码" @input="regFocus">
					</view>
					<view class="border-bottom-light-gray margin-bottom item" @tap="reg_active=2" :class="{'boder-active': reg_active==2}">
						<input type="text" v-model="v_code" placeholder="请输入验证码(不输也行)" @input="regFocus">
					</view>
					<view class="border-bottom-light-gray margin-bottom item flex justify-between" @tap="reg_active=3" :class="{'boder-active': reg_active==3}">
						<input v-if="re_pwd_eye" class="flex-grow margin-right-sm" type="text" v-model="re_pwd" placeholder="请输入密码(6-20位英文和数字)"
						 @input="regFocus">
						<input v-else class="flex-grow margin-right-sm" type="password" v-model="re_pwd" placeholder="请输入密码(6-20位英文和数字)"
						 @input="regFocus">
						<uni-icons type="eye" class="text-light-gray" :class="{'text-black':re_pwd_eye}" size="25" @tap="re_pwd_eye = !re_pwd_eye" />
					</view>
					<view class="border-bottom-light-gray item flex justify-between" @tap="reg_active=4" :class="{'boder-active': reg_active==4}">
						<input v-if="pwd_re_eye" class="flex-grow margin-right-sm" type="text" v-model="pwd_re" placeholder="重复密码" @input="regFocus">
						<input v-else class="flex-grow margin-right-sm" type="password" v-model="pwd_re" placeholder="重复密码" @input="regFocus">
						<uni-icons type="eye" class="text-light-gray" :class="{'text-black':pwd_re_eye}" size="25" @tap="pwd_re_eye = !pwd_re_eye" />
					</view>
					<view class="margin-top-lg bg-gray text-center padding-top-xs padding-bottom-xs round" :class="{'bg-black':reg_status}"
					 @tap="handleReg">
						<text>注&ensp;册</text>
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
				handover_active: 0,
				handover_list: [{
						item: '密码登录',
						login: true
					},
					{
						item: '立即注册',
						login: false
					}
				],
				login_active: 1, // 黑线
				login_status: false, // 登录信息输入完毕
				login: true, // 登录框true
				account: '',
				pwd: '',
				pwd_eye: false,
				reg_active: 1, // 黑线
				reg_status: false, //注册信息输入完毕
				p_num: '',
				v_code: '',
				re_pwd: '',
				re_pwd_eye: false,
				pwd_re: '',
				pwd_re_eye: false,
				message: '',
				message_status: false,
				loading_flag: false
			}
		},
		methods: {
			tapClose() { //关闭当前页面
				let _self = this
				let current_page = getCurrentPages()
				if(this.$store.getters.getMyPageFlag) {
					this.$store.commit('setMyPageFlag', false)
					if (current_page[current_page.length - 3] === undefined) {
						uni.switchTab({
							url: _self.$store.getters.getCurTab ? `/${_self.$store.getters.getCurTab}` : '/pages/tabBar/home/home' //若当前tabbar为空，则拼接为'/'，表示根目录
					
						})
					} else {
						uni.navigateBack({
							delta: 2
						})
					}
				} else {
					uni.navigateBack({
						delta: 1
					})
				}
				
			},
			handover(item, index) { //切换登录注册
				this.handover_active = index
				this.login = item.login
				this.login_active = this.reg_active = 1
			},
			loginFocus() { //监听登录表单填写完整
				// console.log(this.account, this.pwd)
				this.login_status = this.account.trim() !== '' && this.pwd.trim() !== ''
			},
			regFocus() { //监听注册表单填写完整
				this.reg_status = this.p_num.trim() !== '' && this.re_pwd.trim() !== '' && this.pwd_re
					.trim() !== ''
			},
			handleLogin() { //登录
				this.loginFocus()
				if (this.login_status) {
					let _self = this
					uni.request({
						url: _self.$store.getters.getHttp+'/user/login',
						method: 'post',
						data: {
							password: _self.pwd,
							userName: _self.account
						},
						// #ifdef H5
						withCredentials: true,
						// #endif
						success(res) {
							// console.log(res)
							_self.message_status = true
							_self.message = res.data.msg
							if (res.data.code == 0) {
								_self.$store.commit('setToken', '111')
								_self.$store.commit('setUserInfo', res.data.data)
								_self.$store.commit('setIsLoginJust', true)
								_self.$store.commit('setIsLoginsJust', true)
								_self.$store.commit('clearRecommendedVideo')
								// console.log(res.data.data)
								// console.log(_self.$store.getters.getUserInfo)
								setTimeout(() => {
									_self.message_status = false
									_self.tapClose()
								}, 1000)
							} else {
								setTimeout(() => {
									_self.message_status = false
								}, 1000)
							}
						}
					})

				} else {
					this.message_status = true
					this.message = '请填写所有信息'
					setTimeout(() => {
						this.message_status = false
					}, 2000)
				}
			},
			handleReg() { //注册
				this.regFocus()
				let phone_re = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
				let password_re1 = /^[a-zA-Z0-9]+$/
				let password_re2 = /^.{6,20}$/
				if (this.reg_status) {
					if (!phone_re.test(this.p_num)) {
						this.message_status = true
						this.message = '手机号有误'
						setTimeout(() => {
							this.message_status = false
						}, 2000)
					} else if (!password_re1.test(this.re_pwd)) {
						this.message_status = true
						this.message = '密码只能为英文、数字'
						setTimeout(() => {
							this.message_status = false
						}, 2000)
					} else if (!password_re2.test(this.re_pwd)) {
						this.message_status = true
						this.message = '密码只能为6-20位'
						setTimeout(() => {
							this.message_status = false
						}, 2000)
					} else if (this.pwd_re != this.re_pwd) {
						this.message_status = true
						this.message = '两次密码不一致'
						setTimeout(() => {
							this.message_status = false
						}, 2000)
					} else {
						let _self = this
						this.loading_flag = true
						uni.request({
							url: _self.$store.getters.getHttp+'/user/addUser',
							method: 'post',
							data: {
								gender: '男',
								password: _self.re_pwd,
								userName: _self.p_num
							},
							// #ifdef H5
							withCredentials: true,
							// #endif
							success(res) {
								console.log(res)
								_self.loading_flag = false
								_self.message_status = true
								_self.message = res.data.msg
								setTimeout(() => {
									_self.message_status = false
								}, 2000)
								
								if(res.data.code == 0) {
									_self.account = _self.p_num
									_self.pwd = _self.re_pwd
									_self.handover(_self.handover_list[0],0)
								}
							}
						})
					}
				} else {
					this.message_status = true
					this.message = '请填写所有信息'
					setTimeout(() => {
						this.message_status = false
					}, 2000)
				}
			},
			messageLogin() {
				this.message_status = true
				this.message = '别点了，没用的'
				setTimeout(() => {
					this.message_status = false
				}, 2000)
			},
			forgetPwd() {
				this.message_status = true
				this.message = '这都能忘，重新注册吧'
				setTimeout(() => {
					this.message_status = false
				}, 2000)
			}
		},
		created() {
			this.statusBarHeight = 0
			// #ifdef APP-PLUS
			this.statusBarHeight = Vue.prototype.statusBarHeight
			// #endif
		}
	}
</script>

<style lang="less">
	@import '@/static/less/base.less';

	.close-btn {
		padding-top: @space;
		padding-left: @space;
	}

	.content {
		padding-top: @space*2;
		padding-left: @space*2;
		padding-right: @space*2;

		.handover {
			display: flex;
			font-size: 40rpx;

			.item {
				margin-right: @space*2;
				color: @light_gray;
				font-weight: bold;
			}

			.item_active {
				color: #000000;
			}
		}

		.handle {
			margin-top: @space*2;

			.login,
			.reg {
				.item {
					padding-bottom: @space/4;

					.input-placeholder {
						color: @gray;
						font-size: 24rpx;
					}
				}

				.boder-active {
					position: relative;
				}

				.boder-active::after {
					content: '';
					width: 0;
					height: 4rpx;
					background-color: #000000;
					position: absolute;
					top: 100%;
					left: 50%;
					animation: border_slide .3s forwards;
				}

				@keyframes border_slide {
					from {
						width: 0%;
						left: 50%;
					}

					to {
						width: 100%;
						left: 0;
					}
				}

				.tip {
					font-size: 24rpx;
				}
			}
		}
	}
</style>
