<template>
	<div>
		<!-- 登录状态检测 -->
		<div v-if="hasUser">
			<h1>欢迎来到 MyShop</h1>
			<p>你已登录，用户名：{{ userName }}</p>
		</div>

		<!-- 未登录时显示弹窗 -->
		<div v-else>
			<!-- 修复：添加正确的闭合标签 -->
			<div v-if="showLoginDialog" class="dialog">
				<p class="dialog-message">未登录！请选择操作：</p>
				<div class="dialog-buttons">
					<button @click="handleGoLogin">登录</button>
					<button @click="handleGoHome">回到首页</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue';

	import {
		useRouter
	} from 'vue-router';

	// 获取路由和用户状态
	const router = useRouter();
	const userName = ref(localStorage.getItem('userName') || '');
	const hasUser = computed(() => !!userName.value); // 检测是否有用户名
	const showLoginDialog = ref(false); // 控制弹窗显示

	// 生命周期钩子：组件加载时检查登录状态
	onMounted(() => {
		if (!hasUser.value) {
			showLoginDialog.value = true; // 未登录时显示弹窗
		}
	});

	// 弹窗按钮事件
	const handleGoLogin = () => {
		router.push('/login'); // 跳转到登录页
		showLoginDialog.value = false;
	};

	const handleGoHome = () => {
		router.push('/'); // 跳转到首页
		showLoginDialog.value = false;
	};
</script>

<style scoped>
	/* 弹窗样式 */
	.dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		z-index: 1000;
	}

	.dialog-message {
		margin-bottom: 15px;
		text-align: center;
	}

	.dialog-buttons {
		display: flex;
		justify-content: end;
		gap: 10px;
	}

	.dialog-buttons button {
		padding: 8px 16px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.dialog-buttons button:first-child {
		background-color: #42b983;
		color: white;
	}

	.dialog-buttons button:last-child {
		background-color: #eee;
	}
</style>