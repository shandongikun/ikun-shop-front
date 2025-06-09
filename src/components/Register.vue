<template>
	<div class="register-container">
		<!-- 背景装饰 -->
		<div class="bg-decoration"></div>

		<!-- 注册卡片 -->
		<div class="register-card">
			<!-- 品牌标识 -->
			<div class="logo-container">
				<div class="logo-icon">
					<i class="fa fa-user-plus"></i>
				</div>
				<h1>用户注册</h1>
				<p>创建你的账户，开启新体验</p>
			</div>

			<!-- 注册表单 -->
			<form @submit.prevent="handleRegister">
				<div class="form-group">
					<label for="username">用户名</label>
					<div class="input-container">
						<i class="fa fa-user"></i>
						<input type="text" id="username" v-model="user.username" placeholder="请输入用户名（3-20位）"
							:class="{ 'is-invalid': errors.username }" required minlength="3" maxlength="20" />
					</div>
					<p v-if="errors.username" class="error-message">
						<i class="fa fa-exclamation-circle"></i> {{ errors.username }}
					</p>
				</div>

				<div class="form-group">
					<label for="password">密码</label>
					<div class="input-container">
						<i class="fa fa-lock"></i>
						<input type="password" id="password" v-model="user.password" placeholder="请输入密码（6-16位）"
							:class="{ 'is-invalid': errors.password }" required minlength="6" maxlength="16" />
					</div>
					<p v-if="errors.password" class="error-message">
						<i class="fa fa-exclamation-circle"></i> {{ errors.password }}
					</p>
				</div>

				<div class="form-group">
					<label for="phone">电话</label>
					<div class="input-container">
						<i class="fa fa-phone"></i>
						<input type="tel" id="phone" v-model="user.phone" placeholder="请输入手机号码"
							:class="{ 'is-invalid': errors.phone }" required />
					</div>
					<p v-if="errors.phone" class="error-message">
						<i class="fa fa-exclamation-circle"></i> {{ errors.phone }}
					</p>
				</div>

				<div class="form-group">
					<label for="email">邮箱</label>
					<div class="input-container">
						<i class="fa fa-envelope"></i>
						<input type="email" id="email" v-model="user.email" placeholder="请输入邮箱地址"
							:class="{ 'is-invalid': errors.email }" required />
					</div>
					<p v-if="errors.email" class="error-message">
						<i class="fa fa-exclamation-circle"></i> {{ errors.email }}
					</p>
				</div>

				<div class="form-group">
					<label>性别：</label>
					<div class="radio-group">
						<label>
							<input type="radio" value="男" v-model="user.gender">
							<span class="radio-circle"></span> 男
						</label>
						<label>
							<input type="radio" value="女" v-model="user.gender">
							<span class="radio-circle"></span> 女
						</label>
						<label>
							<input type="radio" value="保密" v-model="user.gender">
							<span class="radio-circle"></span> 保密
						</label>
					</div>
				</div>

				<div class="form-group">
					<label for="address">住址：</label>
					<div class="input-container textarea-container">
						<i class="fa fa-home"></i>
						<textarea id="address" v-model="user.address" placeholder="请输入详细住址"
							:class="{ 'is-invalid': errors.address }" required rows="3"></textarea>
					</div>
					<p v-if="errors.address" class="error-message">
						<i class="fa fa-exclamation-circle"></i> {{ errors.address }}
					</p>
				</div>

				<button type="submit" class="register-button" :disabled="isSubmitting">
					{{ isSubmitting ? '注册中...' : '立即注册' }}
				</button>

				<!-- 全局错误提示 -->
				<p v-if="errorMessage" class="global-error-message">
					<i class="fa fa-exclamation-triangle"></i> {{ errorMessage }}
				</p>

				<!-- 辅助链接 -->
				<div class="additional-links">
					<router-link to="/login">已有账号？登录</router-link>
					<router-link to="/fon">忘记密码？找回</router-link>
				</div>
			</form>
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
	const user = reactive({
		username: '',
		password: '',
		phone: '',
		email: '',
		gender: '男',
		address: ''
	});

	const errors = reactive({
		username: '',
		password: '',
		phone: '',
		email: '',
		address: ''
	});

	const errorMessage = ref('');
	const isSubmitting = ref(false);

	const validateForm = () => {
		let isValid = true;
		Object.keys(errors).forEach(key => errors[key] = '');
		errorMessage.value = '';

		// 用户名验证
		if (!user.username.trim()) {
			errors.username = '用户名不能为空';
			isValid = false;
		} else if (!/^[\w_-]{3,20}$/.test(user.username)) {
			errors.username = '用户名需3-20位字母/数字/下划线';
			isValid = false;
		}

		// 密码验证
		if (!user.password.trim()) {
			errors.password = '密码不能为空';
			isValid = false;
		} else if (!/^.{6,16}$/.test(user.password)) {
			errors.password = '密码需6-16位字符';
			isValid = false;
		}

		// 电话验证
		const phoneRegex = /^1[3-9]\d{9}$/;
		if (!phoneRegex.test(user.phone)) {
			errors.phone = '请输入有效的11位手机号码';
			isValid = false;
		}

		// 邮箱验证
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(user.email)) {
			errors.email = '请输入有效的邮箱地址';
			isValid = false;
		}

		// 住址验证
		if (user.address.trim().length > 200) {
			errors.address = '住址不能超过200字';
			isValid = false;
		}

		return isValid;
	};

	const handleRegister = async () => {
		if (!validateForm()) return;

		isSubmitting.value = true;

		try {
			const response = await api.register(user);
			if (response.data.success) {
				alert('注册成功！请登录');
				router.push('/login');
			} else {
				errorMessage.value = response.data.message || '注册失败，请重试';
			}
		} catch (error) {
			console.error('注册错误:', error);
			errorMessage.value = '服务器错误，请稍后再试';
		} finally {
			isSubmitting.value = false;
		}
	};
</script>

<style scoped>
	/* 全局样式 */
	.register-container {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f5f7fa;
		position: relative;
		overflow: hidden;
	}

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

	.register-card {
		background-color: white;
		border-radius: 16px;
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
		padding: 50px 40px;
		width: 100%;
		max-width: 550px;
		position: relative;
		z-index: 1;
		animation: fadeIn 0.5s ease-out;
	}

	.logo-container {
		text-align: center;
		margin-bottom: 40px;
	}

	.logo-icon {
		width: 80px;
		height: 80px;
		background-color: #42b983;
		color: white;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto 20px;
		font-size: 32px;
		box-shadow: 0 5px 15px rgba(66, 185, 131, 0.4);
	}

	.logo-container h1 {
		color: #35495e;
		font-size: 28px;
		margin-bottom: 10px;
	}

	.logo-container p {
		color: #718096;
		font-size: 16px;
	}

	/* 表单样式 */
	.form-group {
		margin-bottom: 30px;
	}

	label {
		display: block;
		font-size: 15px;
		font-weight: 500;
		color: #4a5568;
		margin-bottom: 12px;
	}

	.input-container {
		position: relative;
		border-radius: 10px;
		overflow: hidden;
	}

	.input-container i {
		position: absolute;
		left: 18px;
		top: 50%;
		transform: translateY(-50%);
		color: #a0aec0;
		font-size: 18px;
	}

	.input-container input,
	.input-container textarea {
		width: 100%;
		padding: 16px 16px 16px 50px;
		border: 1px solid #e2e8f0;
		border-radius: 10px;
		font-size: 16px;
		transition: all 0.2s ease;
		background-color: transparent;
	}

	.input-container textarea {
		padding-top: 20px;
		min-height: 120px;
		resize: vertical;
	}

	.input-container textarea:focus {
		padding-top: 16px;
	}

	.input-container input:focus,
	.input-container textarea:focus {
		outline: none;
		border-color: #42b983;
		box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.15);
	}

	.input-container.is-invalid input,
	.input-container.is-invalid textarea {
		border-color: #e53e3e;
	}

	.error-message {
		color: #e53e3e;
		font-size: 14px;
		margin-top: 8px;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	/* 性别选择 */
	.radio-group {
		display: flex;
		gap: 24px;
		margin-top: 8px;
	}

	.radio-group label {
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
		font-size: 16px;
		color: #64748b;
	}

	.radio-group input[type="radio"] {
		display: none;
	}

	.radio-circle {
		width: 20px;
		height: 20px;
		border: 2px solid #d1d5db;
		border-radius: 50%;
		transition: all 0.2s ease;
	}

	.radio-group input:checked~.radio-circle {
		border-color: #42b983;
		background-color: #42b983;
	}

	/* 提交按钮 */
	.register-button {
		width: 100%;
		padding: 18px;
		background-color: #42b983;
		color: white;
		border: none;
		border-radius: 10px;
		font-size: 18px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
	}

	.register-button:hover:not(:disabled) {
		background-color: #359e6e;
		box-shadow: 0 6px 16px rgba(66, 185, 131, 0.4);
		transform: translateY(-1px);
	}

	.register-button:disabled {
		background-color: #a0aec0;
		cursor: not-allowed;
		box-shadow: none;
		transform: translateY(0);
	}

	/* 辅助链接 */
	.additional-links {
		display: flex;
		justify-content: center;
		margin-top: 30px;
		font-size: 15px;
		color: #64748b;
	}

	.additional-links a {
		color: #42b983;
		text-decoration: none;
		position: relative;
		padding-bottom: 2px;
		margin: 0 10px;
		transition: all 0.2s ease;
	}

	.additional-links a:hover {
		color: #359e6e;
		text-decoration: underline;
	}

	/* 动画效果 */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>