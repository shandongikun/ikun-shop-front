<template>
  <div>
    <h1>欢迎来到首页</h1>
    
    <div v-if="userName">
      <p>欢迎，{{ userName }}！</p>
      <button @click="handleLogout">退出登录</button>
    </div>
    
    <div v-else>
      <router-link to="/login">登录</router-link>
      <router-link to="/register">注册</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userName = ref(localStorage.getItem('userName') || '');

const handleLogout = () => {
  // 浏览器原生 confirm 弹窗
  const isConfirmed = window.confirm('是否确认退出登录？');
  
  if (isConfirmed) {
    // 确认退出：清除 localStorage 并跳转
    localStorage.removeItem('userName');
    userName.value = ''; // 清空响应式变量
    router.push('/'); // 跳转到登录页
  }
};
</script>