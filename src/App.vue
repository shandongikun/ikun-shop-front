<template>
	<div id="app" class="flex flex-col min-h-screen">

		<!-- 顶部导航栏 -->
		<header class="nav-container">
			<div class="nav-content flex items-center justify-between">
				<!-- 左侧Logo -->
				<div class="logo-box">
					<img src="@/assets/logo.png" alt="校园二手" class="logo-img" />
					<span class="logo-text">校园二手</span>
				</div>

				<!-- 中间导航菜单 -->
				<nav class="nav-menu">
					<router-link to="/" class="nav-item" :class="{ active: isActive('/') }">首页</router-link>
					<router-link to="/my-shop" class="nav-item"
						:class="{ active: isActive('/my-shop') }">我的店铺</router-link>
					<router-link to="/order" class="nav-item" :class="{ active: isActive('/order') }">订单</router-link>

				</nav>

				<!-- 右侧功能区 -->
				<div class="right-section flex items-center">

					<div class="user-info" v-if="userName">
						<div v-if="userName" class="user-info">
							<el-button type="success" plain @click="goToPersonal">{{ userName }}的主页</el-button>
							<!-- <button @click="goToPersonal">{{ userName }}的主页</button> -->
							<el-button type="danger" plain @click="handleLogout">退出登录</el-button>
							<!-- <button @click="handleLogout">退出登录</button> -->
						</div>
					</div>
					<div class="login-links" v-else>
						<router-link to="/login" class="login-btn">登录</router-link>
						<router-link to="/register" class="register-btn">注册</router-link>
					</div>
				</div>
			</div>
		</header>

		<!-- 路由视图 -->
		<div class="flex-1 mt-4 px-4">
			<router-view />
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
	} from 'vue';
	import {
		useRouter
	} from 'vue-router';
	import {
		ElDropdown,
		ElDropdownMenu,
		ElDropdownItem
	} from 'element-plus';

	const router = useRouter();
	const userName = ref(localStorage.getItem('userName') || '');


	// 判断当前路由是否激活
	const isActive = (routePath) => {
		return router.currentRoute.value.path === routePath;
	};

	const goToPersonal = () => {
		router.push('/personal');
	};

	const handleLogout = () => {
		if (confirm('是否确认退出登录？')) {
			localStorage.removeItem('userName');
			router.push('/login');
			window.location.reload(); // 清除可能的缓存数据
		}
	};
</script>

<style scoped>
	/* 导航栏整体容器 */
	.nav-container {
		background: linear-gradient(to right, #ffffff, #e6f8ea);
		/* 顶部渐变背景 */
		border-bottom: 1px solid #d1f0d8;
	}

	.nav-content {
		width: 1200px;
		
		margin: 0 auto;
		padding: 8px 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/* Logo 区域 */
	.logo-box {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.logo-img {
		height: 40px;
		width: 40px;
		margin-right: 8px;
	}

	.logo-text {
		font-size: 20px;
		font-weight: bold;
		color: #28a745;
		/* 绿色品牌色 */
	}

	/* 中间导航菜单 */
	.nav-menu {
		display: flex;
		gap: 30px;
	}

	.nav-item {
		text-decoration: none;
		color: #333;
		font-size: 14px;
		padding: 8px 0;
		position: relative;
	}

	.nav-item.active {
		color: #28a745;
	}

	.nav-item.active::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2px;
		background-color: #28a745;
	}

	/* 右侧功能区 */
	.right-section {
		display: flex;
		align-items: center;
		gap: 15px;
	}

	.search-input {
		width: 240px;
		--el-input-bg-color: #f9f9f9;
		--el-input-border-color: #d1f0d8;
		--el-input-hover-border-color: #b3e8c2;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
	}

	.user-name {
		color: #333;
		font-size: 14px;
	}

	.user-dropdown {
		color: #999;
		font-size: 16px;
	}

	.login-links {
		display: flex;
		gap: 10px;
	}

	.login-btn,
	.register-btn {
		text-decoration: none;
		color: #666;
		font-size: 14px;
		padding: 6px 12px;
		border: 1px solid #d1f0d8;
		border-radius: 4px;
		transition: all 0.3s;
	}

	.login-btn:hover,
	.register-btn:hover {
		background-color: #28a745;
		color: #fff;
		border-color: #28a745;
	}
</style>