<template>
	<div class="order-shop">
			<h2>我出售的商品</h2>
			<div v-if="loading" class="loading">加载中...</div>
			<div v-else class="goods-list">
					<div class="empty-state" v-if="goodsList.length === 0">
							暂无已出售的商品
					</div>
					<div class="good-item" v-for="item in goodsList" :key="item.goodid">
							<div class="item-card">
									<div class="item-content">
											<!-- 商品名称 -->
											<div class="cell name">{{ item.goodname || '未命名商品' }}</div>
											<!-- 商品图片 -->
											<div class="cell image">
													<img :src="getImageUrl(item)" alt="商品图片" class="goods-img" @error="handleImageError" />
													<div v-if="!item.isImageLoaded" class="loading-placeholder">加载中...</div>
											</div>
											<!-- 商品价格 -->
											<div class="cell price">¥{{ item.goodprice.toFixed(2) }}</div>
											<!-- 商品类别 -->
											<div class="cell category">{{ item.category || '未分类' }}</div>
											<!-- 买家信息 -->
											<div class="cell buyer">买家：{{ item.buyername }}</div>
									</div>
							</div>
					</div>
			</div>
	</div>
</template>

<script setup>
	import {
			ref,
			onMounted
	} from 'vue';
	import api from '../services/testService.js';

	const props = defineProps(['username']);
	const loading = ref(true);
	const goodsList = ref([]);

	// 获取图片URL
	const getImageUrl = (item) => {
			return item.img ? `http://localhost:8080${item.img}` : '/placeholder.png';
	};

	// 处理图片加载失败
	const handleImageError = (e) => {
			e.target.src = '/placeholder.png';
	};

	// 获取已出售的商品（ing=1 且商家用户名匹配）
	const fetchGoods = async () => {
			try {
					loading.value = true;
					const response = await api.getSoldGoodsBySeller(props.username);
					goodsList.value = response.data.data;
			} catch (error) {
					console.error('获取已出售商品失败:', error);
			} finally {
					loading.value = false;
			}
	};

	onMounted(() => {
			fetchGoods();
	});
</script>

<style scoped>
.order-shop {
	width: 100%;
	padding: 20px;
}

.item-card {
	background-color: #f9fafb; /* 添加浅灰色背景 */
	border-radius: 10px; /* 增加圆角 */
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* 添加轻微阴影 */
	padding: 5px; /* 添加内边距 */
	margin-bottom: 15px; /* 增加底部间距 */
	transition: transform 0.2s, box-shadow 0.2s; /* 添加过渡效果 */
}

.item-card:hover {
	transform: translateY(-2px); /* 悬停时轻微上浮 */
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 悬停时增加阴影深度 */
}

.item-content {
	display: grid;
	grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
	gap: 10px;
	align-items: center;
	padding: 15px;
	background: white;
	border-radius: 8px;
}

.cell {
	padding: 8px 0;
}

.name {
	font-weight: 500;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.image {
	height: 80px;
	overflow: hidden;
	border-radius: 4px;
}

.goods-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.loading-placeholder {
	background-color: #f0f0f0;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 0.8rem;
	color: #666;
}

.price {
	color: #e53e3e;
	text-align: center;
}

.category {
	text-align: center;
}

.buyer {
	text-align: left;
	color: #666;
}
</style>
	