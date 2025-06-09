<template>
  <div class="home-container">
    <!-- 顶部区域 -->
    <div class="top-area">
      <!-- 分类筛选和搜索区域 -->
      <div class="filter-search-container flex flex-col items-center">
        <!-- 搜索框 -->
        <div class="search-container w-full max-w-md mb-4">
          <div class="search-input-wrapper">
            <input type="text" v-model="searchQuery" placeholder="搜索商家或商品名称...">
            <span v-if="searchQuery.length > 0" class="clear-icon" @click="clearSearch">❌</span>
          </div>
        </div>

        <!-- 分类筛选区域 -->
        <div class="category-filter flex justify-center flex-wrap gap-3">
          <button :class="{ 'active': currentCategory === '' }" @click="filterByCategory('')">
            全部商品
          </button>
          <button v-for="category in categories" :key="category"
            :class="{ 'active': currentCategory === category }" @click="filterByCategory(category)">
            {{ category }}
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>加载商品中...</p>
    </div>

    <!-- 商品列表区域 -->
    <div class="goods-list-area" v-else>
      <div class="goods-item" v-for="goods in filteredGoods" :key="goods.goodid"
        @click="goToBuyPage(goods.goodid)">
        <!-- 商品图片 -->
        <div class="goods-image">
          <img :src="`http://localhost:8080${goods.img}`" alt="商品图片" class="goods-img"
            @error="handleImageError" @load="handleImageLoad(goods)">
          <div v-if="!goods.isImageLoaded" class="image-placeholder">
            商品图片上传中
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="goods-info">
          <!-- 商品名称和价格（同一行，左右对齐） -->
          <div class="info-row">
            <div class="goods-name">{{ goods.goodname }}</div>
            <div class="goods-price">¥{{ goods.goodprice }}</div>
          </div>

          <!-- 商家名称（独占一行，居左） -->
          <div class="seller-name">商家：{{ goods.username }}</div>
        </div>
      </div>

      <!-- 无商品提示 -->
      <div v-if="filteredGoods.length === 0" class="no-results">
        暂无匹配商品
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import api from '../services/testService.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToBuyPage = (goodid) => {
  router.push(`/buy/${goodid}`);
};

const goodsList = ref([]);
const loading = ref(true);
const currentCategory = ref('');
const searchQuery = ref('');
const searchTrigger = ref(0);

// 分类列表
const categories = ref([
  '电子数码',
  '书籍教材',
  '服装配饰',
  '运动健身',
  '家具家居',
  '其他'
]);

// 计算属性：筛选商品
const filteredGoods = computed(() => {
  let result = goodsList.value;

  // 按分类筛选
  if (currentCategory.value !== '') {
    result = result.filter(goods => goods.category === currentCategory.value);
  }

  // 按搜索关键词筛选
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(goods =>
      goods.goodname.toLowerCase().includes(query) ||
      goods.username.toLowerCase().includes(query)
    );
  }

  return result;
});

const handleImageLoad = (goods) => {
  goods.isImageLoaded = true;
};

const handleImageError = (e) => {
  const target = e.target;
  target.style.display = 'none';
  target.closest('.goods-item').querySelector('.image-placeholder').style.display = 'flex';
};

onMounted(() => {
  fetchGoodsList();
  searchQuery.value = '';
});

const fetchGoodsList = async () => {
  try {
    loading.value = true;
    const response = await api.getGoodsList();
    if (response.data.success) {
      goodsList.value = response.data.data.map(goods => ({
        ...goods,
        isImageLoaded: false
      }));
    }
  } catch (error) {
    console.error('获取商品列表失败:', error);
  } finally {
    loading.value = false;
  }
};

const filterByCategory = (category) => {
  currentCategory.value = category;
};

const clearSearch = () => {
  searchQuery.value = '';
  nextTick(() => {
    document.querySelector('.search-input-wrapper input').focus();
  });
};
</script>

<style scoped>
.home-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f7fa;
  max-width: 1200px;
  margin: 0 auto;
}

.top-area {
  margin-bottom: 30px;
}

/* 筛选和搜索容器 - 垂直布局 + 居中 */
.filter-search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 搜索框样式 */
.search-container {
  width: 100%;
  max-width: 500px;
  margin-bottom: 15px; /* 与分类筛选的间距 */
}

.search-input-wrapper {
  position: relative;
}

.search-input-wrapper input {
  width: 100%;
  padding: 10px 30px 10px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
}

.clear-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #999;
  font-size: 0.9rem;
}

/* 分类筛选样式 */
.category-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.category-filter button {
  padding: 8px 16px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.category-filter button:hover {
  background-color: #f0f2f5;
}

.category-filter button.active {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e3e8f0;
  border-top-color: #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 商品列表区域 */
.goods-list-area {
  display: grid;
  grid-template-columns: repeat(5, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.goods-item {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.goods-image {
  width: 100%;
  height: 120px;
  position: relative;
}

.goods-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a0aec0;
  font-size: 0.8rem;
}

.goods-info {
  padding: 10px;
  flex-grow: 1;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.goods-name {
  font-size: 0.9rem;
  color: #333;
  font-weight: 600;
  max-width: 65%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-price {
  font-size: 1rem;
  color: #ff4500;
  font-weight: 700;
}

.seller-name {
  font-size: 0.8rem;
  color: #666;
  margin-top: 2px;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px 0;
  color: #999;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .home-container {
    max-width: 100%;
    padding: 15px;
  }
  
  .goods-list-area {
    grid-template-columns: repeat(3, minmax(150px, 1fr));
  }
  
  .search-container {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .goods-list-area {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
  }
  
  .category-filter button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
</style>