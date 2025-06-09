<template>
  <div class="shop-container">
    <!-- 左侧导航栏 -->
    <div class="nav-left">
      <button class="nav-button" @click="currentTab = 'upload'">
        上传商品
      </button>
      <button class="nav-button" @click="currentTab = 'shelf'">
        我的货架
      </button>
      <!-- <button class="nav-button" @click="currentTab = 'history'">
        出售历史
      </button> -->
    </div>

    <!-- 右侧内容区域：根据导航切换子组件 -->
    <div class="content-right">
      <component :is="currentComponent" :username="userName" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ShopPut from './MyShopPut.vue'; // 上传商品组件
import ShopShelf from './MyShopShelf.vue'; // 我的货架组件
// import ShopHistory from './MyShopHistory.vue'; // 出售历史组件

// 从本地存储获取用户名
const userName = ref(localStorage.getItem('userName') || '');

// 导航状态管理
const currentTab = ref('upload');
const currentComponent = computed(() => {
  switch (currentTab.value) {
    case 'upload':
      return ShopPut;
    case 'shelf':
      return ShopShelf;
    case 'history':
      return ShopHistory;
    default:
      return ShopPut;
  }
});

// 验证用户登录状态
onMounted(() => {
  if (!userName.value) {
    alert('请先登录');
    // router.push('/login')
  }
});
</script>

<style scoped>
/* 最外层容器：限制宽度 + 水平居中 + 两侧留空 */
.shop-container {
  display: flex;
  min-height: 100vh;
  max-width: 1200px; /* 与主页保持一致的最大宽度 */
  margin: 0 auto; /* 水平居中，两侧自动留空 */
  background-color: #fff; /* 可选：设置背景色区分内容区域 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); /* 可选：添加阴影增强层次感 */
}

.nav-left {
  width: 200px;
  background: #f5f7fa;
  padding: 20px;
  border-right: 1px solid #e2e8f0;
}

.nav-button {
  width: 100%;
  padding: 12px;
  margin-bottom: 8px;
  border: none;
  border-radius: 4px;
  background: #42b983;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.nav-button:hover {
  background: #359e6e;
}

.content-right {
  flex-grow: 1;
  padding: 30px;
}

/* 响应式适配：小屏幕下取消最大宽度限制 */
@media (max-width: 768px) {
  .shop-container {
    max-width: 100%; /* 小屏幕铺满 */
    margin: 0; /* 取消居中 */
  }
}
</style>