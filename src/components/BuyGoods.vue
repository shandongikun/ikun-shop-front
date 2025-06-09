<template>
	<div class="buy-container">
		<!-- 返回按钮 -->
		<div class="back-btn" @click="router.go(-1)">
			< 返回</div>

				<!-- 加载状态 -->
				<div v-if="loading" class="loading-overlay">
					<div class="loading-spinner"></div>
					<p>加载中...</p>
				</div>

				<!-- 商品详情区域 -->
				<div v-else-if="goods.goodid" class="goods-detail">
					<div class="goods-image">
						<img :src="`http://localhost:8080${goods.img}`" alt="商品图片" class="goods-img"
							>
					</div>
					<div class="goods-info">
						<h3>{{ goods.goodname }}</h3>
						<p>价格：¥{{ goods.goodprice }}</p>
						<p>商家：{{ goods.username }}</p>

						<!-- 新增：商品详情描述 -->
						<div class="goods-details" v-if="goods.details">
							<h4>商品详情</h4>
							<p>{{ goods.details }}</p>
						</div>
					</div>
				</div>

				<!-- 商品不存在提示 -->
				<div v-else class="no-results">
					<p>商品不存在或已下架</p>
					<button @click="router.go(-1)">返回</button>
				</div>

				<!-- 购买按钮（仅当商品存在时显示） -->
				<div v-if="goods.goodid" class="buy-btn" @click="handleBuy">
					购买
				</div>
		</div>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		useRoute,
		useRouter
	} from 'vue-router';
	import api from '../services/testService.js';

	const route = useRoute();
	const router = useRouter();
	const goods = ref({});
	const currentUser = ref('');
	const loading = ref(true);

	onMounted(() => {
		const goodid = route.params.goodid;

		if (!goodid) {
			loading.value = false;
			return;
		}

		fetchGoodsDetail(goodid);
		currentUser.value = localStorage.getItem('userName');
	});

	const fetchGoodsDetail = async (goodid) => {
		try {
			const response = await api.getGoodsDetail(goodid);
			if (response.data && response.data.success) {
				goods.value = response.data.goods;
			} else {
				console.error('获取商品详情失败:', response.data?.message || '未知错误');
			}
		} catch (error) {
			console.error('获取商品详情失败:', error);
		} finally {
			loading.value = false;
		}
	};

	const handleBuy = async () => {
		if (!currentUser.value) {
			alert('请先登录');
			return;
		}

		try {
			const response = await api.placeOrder({
				goodid: goods.value.goodid,
				buyername: currentUser.value,
				seller: goods.value.username
			});
			if (response.data && response.data.success) {
				router.push('/');
			} else {
				alert(response.data?.message || '下单失败，请重试');
			}
		} catch (error) {
			console.error('下单失败:', error);
			alert('下单失败，请重试');
		}
	};

	// const handleImageError = (e) => {
	// 	e.target.src = 'https://picsum.photos/400/300'; // 备用图片
	// };
</script>

<style scoped>
	.buy-container {
		padding: 20px;
		min-height: 100vh;
		background-color: #f5f7fa;
		max-width: 600px;
		margin: 0 auto;
	}

	.back-btn {
		font-size: 1.2rem;
		margin-bottom: 20px;
		cursor: pointer;
		color: #666;
	}

	.loading-overlay {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 300px;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #42b983;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 16px;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.goods-detail {
		background: white;
		border-radius: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
		padding: 20px;
		margin-bottom: 30px;
		max-width: 500px;
		margin: 0 auto;
	}

	.goods-image {
		width: 100%;
		height: 300px;
		overflow: hidden;
		border-radius: 8px;
	}

	.goods-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.goods-info {
		padding: 20px 0;
	}

	.goods-info h3 {
		font-size: 1.2rem;
		color: #333;
		margin-bottom: 10px;
	}

	/* 新增：商品详情样式 */
	.goods-details {
		margin-top: 15px;
		padding-top: 15px;
		border-top: 1px solid #e2e8f0;
	}

	.goods-details h4 {
		color: #666;
		font-size: 1rem;
		margin-bottom: 8px;
	}

	.goods-details p {
		color: #333;
		line-height: 1.6;
		margin-bottom: 0;
	}

	.buy-btn {
		width: 100%;
		padding: 12px;
		background-color: #42b983;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		transition: background-color 0.3s;
	}

	.buy-btn:hover {
		background-color: #359e6c;
	}

	.no-results {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 300px;
		text-align: center;
	}

	.no-results button {
		margin-top: 16px;
		padding: 8px 16px;
		background-color: #42b983;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
</style>