<template>
	<div class="login-container">
		<!-- 背景装饰 -->
		<div class="bg-decoration"></div>

		<!-- 登录卡片 -->
		<div class="login-card">
			<!-- 品牌标识 -->
			<div class="logo-container">
				<div class="logo-icon">
					<i class="fa fa-shield"></i>
				</div>
				<h1>用户登录</h1>
				<p>欢迎回来，请登录您的账户</p>
			</div>

			<!-- 登录表单 -->
			<form @submit.prevent="handleLogin">
				<div class="form-group">
					<label for="username">用户名</label>
					<div class="input-container">
						<i class="fa fa-user"></i>
						<input type="text" id="username" v-model="form.username" placeholder="请输入用户名"
							:class="{ 'is-invalid': errors.username }"
							style="padding-right: 15px; box-sizing: border-box;" />
					</div>
					<p v-if="errors.username" class="error-message">
						<i class="fa fa-exclamation-circle"></i> {{ errors.username }}
					</p>
				</div>

				<div class="form-group">
					<label for="password">密码</label>
					<div class="input-container password-container">
						<i class="fa fa-lock"></i>
						<input :type="passwordVisible ? 'text' : 'password'" id="password" v-model="form.password"
							placeholder="请输入密码" :class="{ 'is-invalid': errors.password }"
							style="padding-right: 40px; box-sizing: border-box;" />
						<!-- 密码显示/隐藏按钮 -->
						<button type="button" class="password-toggle" @click="togglePasswordVisibility">
							<i class="fa fa-eye-slash" v-show="!passwordVisible"></i>
							<i class="fa fa-eye" v-show="passwordVisible"></i>
						</button>
					</div>
					<p v-if="errors.password" class="error-message">
						<i class="fa fa-exclamation-circle"></i> {{ errors.password }}
					</p>
				</div>

				<!-- 全局错误提示 -->
				<p v-if="errorMessage" class="global-error-message">
					<i class="fa fa-exclamation-triangle"></i> {{ errorMessage }}
				</p>

				<button type="submit" class="login-button" :disabled="isLoading">
					{{ isLoading ? '登录中...' : '登录' }}
				</button>
			</form>

			<!-- 辅助链接 -->
			<div class="additional-links">
				<router-link to="/fon" class="forgot-password">找回密码</router-link>
				<router-link to="/register" class="register">注册账号</router-link>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue';
	import {
		useRouter
	} from 'vue-router';
	import api from '../services/testService.js';

	const router = useRouter();

	// 表单数据
	const form = reactive({
		username: '',
		password: ''
	});

	// 错误信息
	const errors = reactive({
		username: '',
		password: ''
	});

	// 全局状态
	const errorMessage = ref('');
	const isLoading = ref(false);

	// 表单验证
	const validateForm = () => {
		let isValid = true;
		Object.keys(errors).forEach(key => errors[key] = '');
		errorMessage.value = '';

		if (!form.username.trim()) {
			errors.username = '请输入用户名';
			isValid = false;
		}

		if (!form.password.trim()) {
			errors.password = '请输入密码';
			isValid = false;
		}

		return isValid;
	};

	// 处理登录
	const handleLogin = async () => {
		if (!validateForm()) return;

		isLoading.value = true;

		try {
			const response = await api.login({
				username: form.username,
				password: form.password
			});

			if (response.data.success) {
				// 统一键名为 'username'
				localStorage.setItem('userName', response.data.userInfo.username);
				router.push('/');
				setTimeout(() => {
					location.reload();
				}, 500);
			} else {
				errorMessage.value = response.data.message || '用户名或密码不正确';
			}
		} catch (error) {
			console.error('登录失败:', error);
			errorMessage.value = '服务器错误，请稍后再试';
		} finally {
			isLoading.value = false;
		}
	};
</script>

<style scoped>
	/* 页面整体样式 */
	.login-container {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f5f7fa;
		position: relative;
		overflow: hidden;
	}

	/* 背景装饰 */
	.bg-decoration {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 35%;
		background: linear-gradient(135deg, #42b983 0%, #35495e 100%);
		transform: skewY(-6deg);
		transform-origin: top left;
		z-index: 0;
	}

	/* 登录卡片 */
	.login-card {
		background-color: white;
		border-radius: 16px;
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
		padding: 50px 40px;
		width: 100%;
		max-width: 420px;
		position: relative;
		z-index: 1;
		animation: fadeIn 0.5s ease-out;
	}

	/* 品牌标识区域 */
	.logo-container {
		text-align: center;
		margin-bottom: 40px;
	}

	.logo-icon {
		width: 70px;
		height: 70px;
		background-color: #42b983;
		color: white;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto 20px;
		font-size: 28px;
		box-shadow: 0 5px 15px rgba(66, 185, 131, 0.4);
		transition: transform 0.3s ease;
	}

	.logo-icon:hover {
		transform: scale(1.05);
	}

	.logo-container h1 {
		color: #35495e;
		font-size: 26px;
		margin-bottom: 10px;
	}

	.logo-container p {
		color: #718096;
		font-size: 15px;
	}

	/* 表单样式 */
	.form-group {
		margin-bottom: 25px;
	}

	.form-group label {
		display: block;
		font-size: 15px;
		font-weight: 500;
		color: #4a5568;
		margin-bottom: 10px;
	}

	.input-container {
		position: relative;
		overflow: hidden;
	}

	.input-container i {
		position: absolute;
		left: 15px;
		top: 50%;
		transform: translateY(-50%);
		color: #a0aec0;
		font-size: 16px;
		z-index: 1;
	}

	.input-container input {
		width: 100%;
		padding: 14px 14px 14px 45px;
		border: 1px solid #e2e8f0;
		border-radius: 10px;
		font-size: 15px;
		transition: all 0.2s ease;
		outline: none;
	}

	.input-container input:focus {
		border-color: #42b983;
		box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
	}

	.input-container input.is-invalid {
		border-color: #e53e3e;
	}

	.error-message {
		color: #e53e3e;
		font-size: 13px;
		margin-top: 7px;
		display: flex;
		align-items: center;
	}

	.error-message i {
		margin-right: 5px;
	}

	.global-error-message {
		color: #e53e3e;
		background-color: #fff5f5;
		padding: 12px;
		border-radius: 8px;
		margin: 15px 0;
		font-size: 14px;
		display: flex;
		align-items: center;
		animation: fadeIn 0.3s ease-out;
	}

	.global-error-message i {
		margin-right: 8px;
	}

	/* 密码输入框样式 */
	.password-container {
		position: relative;
	}

	.password-toggle {
		position: absolute;
		right: 15px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		color: #a0aec0;
		font-size: 16px;
		padding: 0;
		outline: none;
		z-index: 2;
	}

	.password-toggle:hover {
		color: #42b983;
	}

	/* 登录按钮 */
	.login-button {
		width: 100%;
		padding: 15px;
		background-color: #42b983;
		color: white;
		border: none;
		border-radius: 10px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
	}

	.login-button:hover:not(:disabled) {
		background-color: #359e6e;
		box-shadow: 0 6px 16px rgba(66, 185, 131, 0.4);
		transform: translateY(-1px);
	}

	.login-button:disabled {
		background-color: #a0aec0;
		cursor: not-allowed;
		box-shadow: none;
		transform: translateY(0);
	}

	/* 辅助链接 */
	.additional-links {
		display: flex;
		justify-content: space-between;
		margin-top: 25px;
		font-size: 14px;
	}

	.additional-links a {
		color: #42b983;
		text-decoration: none;
		transition: color 0.2s;
		position: relative;
		padding-bottom: 3px;
	}

	.additional-links a::after {
		content: '';
		position: absolute;
		width: 0;
		height: 2px;
		bottom: 0;
		left: 0;
		background-color: #42b983;
		transition: width 0.2s;
	}

	.additional-links a:hover {
		color: #359e6e;
	}

	.additional-links a:hover::after {
		width: 100%;
	}

	/* 动画效果 */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(15px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>