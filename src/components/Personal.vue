<template>
	<div class="personal-container">
		<!-- 背景装饰 -->
		<div class="bg-decoration"></div>

		<!-- 个人信息卡片 -->
		<div class="personal-card">
			<div class="header">
				<h1>个人中心</h1>
				
			</div>

			<!-- 个人信息展示与编辑切换 -->
			<div class="info-section" v-if="!isEditing">
				<!-- 用户名 -->
				<div class="info-item">
					<span>用户名：</span>
					<span>{{ userInfo.username }}</span>
				</div>

				<!-- 性别 -->
				<div class="info-item">
					<span>性别：</span>
					<span>{{ userInfo.gender || '未设置' }}</span>
				</div>

				<!-- 手机号 -->
				<div class="info-item">
					<span>手机号：</span>
					<span>{{ userInfo.phone || '未设置' }}</span>
				</div>

				<!-- 邮箱 -->
				<div class="info-item email-item">
					<span>邮箱：</span>
					<span v-if="!showEmail" class="masked-email">
						{{ userInfo.email?.substring(0, 4) }}***@{{ userInfo.email?.split('@')[1] }}
					</span>
					<span v-else>{{ userInfo.email || '未设置' }}</span>
					<button @click="toggleEmailVisibility" class="eye-icon">
						{{ showEmail ? '👁️' : '👁️‍🗨️' }}
					</button>
				</div>

				<!-- 地址 -->
				<div class="info-item">
					<span>地址：</span>
					<span>{{ userInfo.address || '未设置' }}</span>
				</div>
			</div>

			<!-- 编辑表单（仅编辑时显示） -->
			<form v-else class="edit-form">
				<div class="form-group">
					<label>性别：</label>
					<select v-model="editedUser.gender">
						<option value="">请选择</option>
						<option value="男">男</option>
						<option value="女">女</option>
					</select>
				</div>

				<div class="form-group">
					<label>手机号：</label>
					<input type="text" v-model="editedUser.phone" placeholder="请输入手机号" />
				</div>

				<div class="form-group">
					<label>邮箱：</label>
					<input type="email" v-model="editedUser.email" placeholder="请输入邮箱" />
				</div>

				<div class="form-group">
					<label>地址：</label>
					<input type="text" v-model="editedUser.address" placeholder="请输入地址" />
				</div>
			</form>

			<!-- 修改功能区 -->
			<div class="action-section">
				<button @click="toggleEditMode" class="edit-button">
					{{ isEditing ? '取消修改' : '修改个人信息' }}
				</button>

				<!-- 保存按钮（仅编辑时显示） -->
				<button v-if="isEditing" @click="saveProfile" class="save-button">
					保存修改
				</button>

				<!-- 修改密码按钮 -->
				<button @click="showPasswordModal = true" class="change-password-button">
					修改密码
				</button>
			</div>

			<!-- 修改密码模态框 -->
			<div v-show="showPasswordModal" class="password-modal">
				<div class="modal-content">
					<h3>修改密码</h3>
					<div class="form-group">
						<label>原密码：</label>
						<input type="password" v-model="oldPassword" placeholder="请输入原密码" />
					</div>
					<div class="form-group">
						<label>新密码：</label>
						<input type="password" v-model="newPassword" placeholder="请输入新密码" />
					</div>
					<div class="form-group">
						<label>确认新密码：</label>
						<input type="password" v-model="confirmPassword" placeholder="请确认新密码" />
					</div>
					<div class="error-message" v-if="passwordError">{{ passwordError }}</div>
					<button @click="handlePasswordChange">确认修改</button>
					<button @click="showPasswordModal = false" class="cancel-button">取消</button>
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
	import api from '../services/testService.js';

	const router = useRouter();
	const userName = ref(localStorage.getItem('userName') || '');
	const userInfo = reactive({
		id: 0,
		username: '',
		gender: '',
		phone: '',
		email: '',
		address: ''
	});
	const isEditing = ref(false);
	const editedUser = reactive({
		gender: '',
		phone: '',
		email: '',
		address: ''
	});

	// 邮箱显示控制
	const showEmail = ref(false);

	// 密码修改相关
	const showPasswordModal = ref(false);
	const oldPassword = ref('');
	const newPassword = ref('');
	const confirmPassword = ref('');
	const passwordError = ref('');

	// 加载用户信息
	const loadUserInfo = async () => {
		try {
			const response = await api.getUserInfo(userName.value);
			if (response.data.success) {
				Object.assign(userInfo, response.data.userInfo);
				// 初始化编辑表单
				editedUser.gender = userInfo.gender;
				editedUser.phone = userInfo.phone;
				editedUser.email = userInfo.email;
				editedUser.address = userInfo.address;
			} else {
				alert(response.data.message);
				router.push('/login');
			}
		} catch (error) {
			console.error('获取用户信息失败:', error);
			alert('服务器错误，请稍后再试');
			router.push('/login');
		}
	};

	// 切换编辑模式
	const toggleEditMode = () => {
		isEditing.value = !isEditing.value;
		if (!isEditing.value) {
			// 取消编辑时恢复原始值
			editedUser.gender = userInfo.gender;
			editedUser.phone = userInfo.phone;
			editedUser.email = userInfo.email;
			editedUser.address = userInfo.address;
		}
	};

	// 保存个人信息修改
	const saveProfile = async () => {
		try {
			// 确保传递用户名和ID
			const response = await api.updateProfile(userInfo.id, {
				...editedUser,
				username: userInfo.username
			});

			if (response.data.success) {
				alert('修改成功');
				isEditing.value = false;
				loadUserInfo(); // 刷新用户信息
			} else {
				alert(response.data.message);
			}
		} catch (error) {
			console.error('保存失败:', error);
			alert('服务器错误，请稍后再试');
		}
	};

	// 修改密码
	const handlePasswordChange = async () => {
		// 客户端验证
		if (!oldPassword.value) {
			passwordError.value = '请输入原密码';
			return;
		}

		if (!newPassword.value) {
			passwordError.value = '请输入新密码';
			return;
		}

		if (newPassword.value.length < 6) {
			passwordError.value = '新密码长度至少为6位';
			return;
		}

		if (newPassword.value !== confirmPassword.value) {
			passwordError.value = '新密码与确认密码不一致';
			return;
		}

		try {
			const response = await api.changePassword(
				userInfo.username, // 使用已加载的用户名
				oldPassword.value,
				newPassword.value
			);

			if (response.data.success) {
				alert('密码修改成功，请使用新密码登录');
				showPasswordModal.value = false;
				// 重置表单
				oldPassword.value = '';
				newPassword.value = '';
				confirmPassword.value = '';
				passwordError.value = '';

				// 退出登录
				localStorage.removeItem('userName');
				router.push('/login');
			} else {
				passwordError.value = response.data.message;
			}
		} catch (error) {
			console.error('修改密码失败:', error);
			passwordError.value = '服务器错误，请稍后再试';
		}
	};

	// 切换邮箱显示状态
	const toggleEmailVisibility = () => {
		showEmail.value = !showEmail.value;
	};

	onMounted(() => {
		if (!userName.value) {
			router.push('/login');
		} else {
			loadUserInfo();
		}
	});
</script>

<style scoped>
	.personal-container {
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
		height: 25%;
		background: linear-gradient(135deg, #42b983 0%, #35495e 100%);
		transform: skewY(-6deg);
		transform-origin: top left;
		z-index: 0;
	}

	.personal-card {
		background-color: white;
		border-radius: 16px;
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
		padding: 40px;
		width: 100%;
		max-width: 600px;
		position: relative;
		z-index: 1;
		animation: fadeIn 0.5s ease-out;
		text-align: center;
	}

	.header {
		margin-bottom: 30px;
	}

	.header h1 {
		color: #35495e;
		margin-bottom: 10px;
	}

	.header p {
		color: #718096;
		font-size: 16px;
	}

	.info-section {
		margin-bottom: 30px;
		font-size: 17px;
		color: #35495e;
		text-align: left;
		margin-left: auto;
		margin-right: auto;
		max-width: 400px;
	}

	.info-item {
		margin-bottom: 15px;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.info-item span:first-child {
		min-width: 80px;
		text-align: right;
		color: #718096;
	}

	.email-item {
		position: relative;
	}

	.eye-icon {
		position: absolute;
		right: 0;
		background: none;
		border: none;
		cursor: pointer;
		color: #a0aec0;
		font-size: 18px;
		/* 增大图标尺寸 */
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s ease;
	}

	.eye-icon:hover {
		color: #42b983;
	}

	.masked-email {
		color: #718096;
	}

	.action-section {
		display: flex;
		justify-content: center;
		gap: 20px;
		margin-top: 40px;
	}

	.edit-button,
	.save-button,
	.change-password-button {
		padding: 12px 24px;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 16px;
		font-weight: 500;
	}

	.edit-button {
		background-color: #42b983;
		color: white;
		border: none;
	}

	.edit-button:hover {
		background-color: #359e6e;
		transform: translateY(-2px);
	}

	.save-button {
		background-color: #64748b;
		color: white;
		border: none;
	}

	.save-button:hover {
		background-color: #4b5563;
		transform: translateY(-2px);
	}

	.change-password-button {
		background-color: #e53e3e;
		color: white;
		border: none;
	}

	.change-password-button:hover {
		background-color: #c53030;
		transform: translateY(-2px);
	}

	.edit-form {
		text-align: left;
		max-width: 400px;
		margin: 0 auto;
	}

	.form-group {
		margin-bottom: 20px;
	}

	.form-group label {
		display: block;
		margin-bottom: 8px;
		color: #4a5568;
		font-weight: 500;
	}

	.form-group input,
	.form-group select {
		width: 100%;
		padding: 12px;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		font-size: 16px;
		transition: border-color 0.2s ease;
	}

	.form-group input:focus,
	.form-group select:focus {
		outline: none;
		border-color: #42b983;
		box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
	}

	.password-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 20;
	}

	.modal-content {
		background-color: white;
		padding: 30px;
		border-radius: 16px;
		width: 100%;
		max-width: 400px;
		position: relative;
		animation: fadeIn 0.3s ease-out;
	}

	.modal-content h3 {
		color: #35495e;
		margin-bottom: 20px;
		text-align: center;
	}

	.error-message {
		color: #e53e3e;
		margin-top: 10px;
		font-size: 14px;
		text-align: center;
	}

	.modal-content button {
		width: 100%;
		padding: 12px;
		margin-top: 15px;
		border-radius: 8px;
		cursor: pointer;
		font-size: 16px;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.modal-content button:first-of-type {
		background-color: #42b983;
		color: white;
		border: none;
	}

	.modal-content button:first-of-type:hover {
		background-color: #359e6e;
	}

	.cancel-button {
		background-color: #e2e8f0;
		color: #4a5568;
		border: none;
	}

	.cancel-button:hover {
		background-color: #cbd5e1;
	}

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

	/* 响应式设计 */
	@media (max-width: 600px) {
		.personal-card {
			max-width: 90%;
			padding: 30px 20px;
		}

		.info-section,
		.edit-form {
			max-width: 90%;
		}

		.action-section {
			flex-direction: column;
			gap: 15px;
		}
	}
</style>