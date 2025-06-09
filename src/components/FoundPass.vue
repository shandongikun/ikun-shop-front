<template>
	<div class="password-reset-page">
		<!-- 背景装饰 -->
		<div class="bg-decoration"></div>

		<div class="reset-container">
			<div class="reset-card">
				<!-- 品牌标识 -->
				<div class="logo-container">
					<div class="logo-icon">
						<i class="fa fa-key"></i>
					</div>
					<h1>找回密码</h1>
					<p>请输入您的用户名和注册邮箱</p>
				</div>

				<!-- 找回密码表单 -->
				<form @submit.prevent="handleSubmit">
					<div class="form-group">
						<label for="username">用户名</label>
						<div class="input-container">
							<i class="fa fa-user"></i>
							<input type="text" id="username" v-model="form.username" placeholder="请输入您的用户名" />
						</div>
					</div>

					<div class="form-group">
						<label for="email">邮箱</label>
						<div class="input-container">
							<i class="fa fa-envelope"></i>
							<input type="email" id="email" v-model="form.email" placeholder="请输入注册邮箱" />
						</div>
					</div>

					<!-- 验证通过后显示新密码输入框 -->
					<div v-if="emailVerified" class="form-group">
						<label for="newPassword">新密码</label>
						<div class="input-container">
							<i class="fa fa-lock"></i>
							<input type="password" id="newPassword" v-model="form.newPassword" placeholder="请输入新密码" />
						</div>
					</div>

					<div v-if="emailVerified" class="form-group">
						<label for="confirmPassword">确认新密码</label>
						<div class="input-container">
							<i class="fa fa-lock"></i>
							<input type="password" id="confirmPassword" v-model="form.confirmPassword"
								placeholder="请再次输入新密码" />
						</div>
					</div>

					<!-- 全局错误提示 -->
					<p v-if="errorMessage" class="global-error-message">
						<i class="fa fa-exclamation-circle"></i> {{ errorMessage }}
					</p>

					<!-- 成功提示 -->
					<div v-if="successMessage" class="success-message">
						<div class="success-icon">
							<i class="fa fa-check-circle"></i>
						</div>
						<p>{{ successMessage }}</p>
					</div>

					<!-- 无禁用逻辑，加载时显示提示文本 -->
					<button type="submit" class="submit-button">
						{{ isLoading ? '提交中...' : (emailVerified ? '设置新密码' : '验证邮箱') }}
					</button>
				</form>

				<!-- 辅助链接 -->
				<div class="additional-links">
					<router-link to="/login">返回登录</router-link>
					<span>|</span>
					<router-link to="/register">注册账号</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue';
	import {
		useRouter
	} from 'vue-router';
	import userService from '../services/testService.js';

	const router = useRouter();

	// 表单数据
	const form = reactive({
		username: '',
		email: '',
		newPassword: '',
		confirmPassword: ''
	});

	// 全局状态
	const errorMessage = ref('');
	const successMessage = ref('');
	const isLoading = ref(false); // 加载状态
	const emailVerified = ref(false); // 邮箱验证状态

	// 处理表单提交
	const handleSubmit = async () => {
		isLoading.value = true; // 显示加载文本
		errorMessage.value = ''; // 清空错误信息

		try {
			if (!emailVerified.value) {
				// 第一步：验证邮箱
				const checkResponse = await userService.checkUsernameAndEmail(form.username, form.email);
				if (checkResponse.data.success) {
					emailVerified.value = true;
				} else {
					errorMessage.value = checkResponse.data.message || '用户名和邮箱不匹配，请重试';
				}
			} else {
				// 第二步：重置密码
				const resetResponse = await userService.resetPassword(form.username, form.newPassword);
				if (resetResponse.data.success) {
					successMessage.value = '密码重置成功，请使用新密码登录';
					setTimeout(() => {
						router.push('/login');
					}, 3000);
				} else {
					errorMessage.value = resetResponse.data.message || '密码重置失败，请重试';
				}
			}
		} catch (error) {
			console.error('找回密码失败:', error);
			errorMessage.value = '服务器错误，请稍后再试';
		} finally {
			isLoading.value = false; // 隐藏加载文本
		}
	};

	// 页面加载时重置状态
	onMounted(() => {
		errorMessage.value = '';
		successMessage.value = '';
		emailVerified.value = false;
	});
</script>

<style scoped>
	/* 页面整体样式 */
	.password-reset-page {
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
		height: 30%;
		background: linear-gradient(135deg, #42b983 0%, #35495e 100%);
		transform: skewY(-8deg);
		transform-origin: top left;
		z-index: 0;
	}

	/* 重置密码卡片 */
	.reset-container {
		z-index: 1;
		width: 100%;
		max-width: 400px;
		padding: 20px;
	}

	.reset-card {
		background-color: white;
		border-radius: 12px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		padding: 40px 30px;
		animation: fadeIn 0.5s ease-out;
	}

	/* 品牌标识区域 */
	.logo-container {
		text-align: center;
		margin-bottom: 30px;
	}

	.logo-icon {
		width: 60px;
		height: 60px;
		background-color: #42b983;
		color: white;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto 15px;
		font-size: 24px;
		box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
	}

	.logo-container h1 {
		color: #35495e;
		font-size: 24px;
		margin-bottom: 8px;
	}

	.logo-container p {
		color: #718096;
		font-size: 14px;
	}

	/* 表单样式 */
	.form-group {
		margin-bottom: 20px;
	}

	.form-group label {
		display: block;
		font-size: 14px;
		font-weight: 500;
		color: #4a5568;
		margin-bottom: 8px;
	}

	.input-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.input-container i {
		position: absolute;
		left: 15px;
		color: #a0aec0;
		z-index: 1;
	}

	.input-container input {
		width: 100%;
		padding: 12px 15px 12px 40px;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		font-size: 14px;
		transition: all 0.2s ease;
		box-sizing: border-box;
	}

	.input-container input:focus {
		outline: none;
		border-color: #42b983;
		box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
	}

	/* 全局错误提示 */
	.global-error-message {
		color: #e53e3e;
		background-color: #fff5f5;
		padding: 10px;
		border-radius: 6px;
		margin: 15px 0;
		font-size: 14px;
		display: flex;
		align-items: center;
	}

	.global-error-message i {
		margin-right: 8px;
	}

	/* 成功消息 */
	.success-message {
		background-color: #f0fff4;
		color: #38a169;
		padding: 15px;
		border-radius: 6px;
		margin: 15px 0;
		text-align: center;
		animation: fadeIn 0.3s ease-out;
	}

	.success-icon {
		font-size: 24px;
		margin-bottom: 10px;
	}

	/* 提交按钮 */
	.submit-button {
		width: 100%;
		padding: 14px;
		background-color: #42b983;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
	}

	.submit-button:hover {
		background-color: #359e6e;
		box-shadow: 0 6px 16px rgba(66, 185, 131, 0.4);
	}

	/* 辅助链接 */
	.additional-links {
		display: flex;
		justify-content: center;
		margin-top: 20px;
		font-size: 14px;
	}

	.additional-links a {
		color: #42b983;
		text-decoration: none;
		transition: color 0.2s;
	}

	.additional-links a:hover {
		color: #359e6e;
	}

	.additional-links span {
		margin: 0 10px;
		color: #a0aec0;
	}

	/* 动画效果 */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>