<template>
  <div>
    <h1>欢迎来到登录页</h1>
    <form @submit.prevent="handleLogin">
      <input 
        type="text" 
        v-model="name" 
        placeholder="请输入用户名" 
        required 
      />
      <button type="submit">登录</button>
      <!-- 错误提示 -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import qwe from '../services/testService';

const router = useRouter();
const name = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    const response = await qwe.pp123(name.value);
    
    if (response.data) {
      localStorage.setItem('userName', name.value);
      router.push('/');
    } else {
      errorMessage.value = "用户名不正确";
    }
  } catch (error) {
    console.error("登录错误:", error);
    
    if (error.response) {
      // 处理服务器返回的错误
      if (error.response.status === 404) {
        errorMessage.value = "用户不存在";
      } else {
        errorMessage.value = "服务器错误，请重试";
      }
    } else {
      // 处理网络错误
      errorMessage.value = "网络连接失败";
    }
  }
};
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>