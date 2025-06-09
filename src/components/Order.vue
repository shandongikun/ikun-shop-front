<template>
  <div class="order-container">
    <!-- 左侧导航栏 -->
    <div class="nav-left">
      <button class="nav-button" @click="currentTab = 'shop'">我出售的</button>
      <button class="nav-button" @click="currentTab = 'user'">我买入的</button>
    </div>

    <!-- 右侧内容区域：根据导航切换子组件 -->
    <div class="content-right">
      <component :is="currentComponent" :username="userName" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import OrderShop from './OrderShop.vue';
import OrderUser from './OrderUser.vue';

const userName = ref(localStorage.getItem('userName') || '');
const currentTab = ref('shop'); 

const currentComponent = computed(() => {
  switch (currentTab.value) {
    case 'shop':
      return OrderShop;
    case 'user':
      return OrderUser;
    default:
      return OrderShop;
  }
});
</script>

<style scoped>
/* 新增：最外层容器设置最大宽度和居中 */
.order-container {
  display: flex;
  min-height: 100vh;
  max-width: 1200px; /* 与主页保持一致的最大宽度 */
  margin: 0 auto; /* 水平居中，两侧自动留白 */
  background-color: #ffffff; /* 可选：白色背景 */
  box-shadow: 0 0 12px rgba(0,0,0,0.05); /* 可选：添加轻阴影 */
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

/* 响应式适配：小屏幕取消最大宽度 */
@media (max-width: 768px) {
  .order-container {
    max-width: 100%;
    margin: 0;
  }
}
</style>