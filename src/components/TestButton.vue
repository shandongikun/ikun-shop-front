<!-- frontend/src/components/TestButton.vue -->
<template>
  <button @click="testConnection">测试前后端连接</button>
</template>

<script setup>
import { ref } from 'vue';
import testService from '../services/testService.js';

const message = ref('');

const testConnection = async () => {
  try {
    const response = await testService.test();
	console.log(response.data);
    message.value = response.data;
    alert('连接成功！查看后端控制台输出');
  } catch (error) {
    message.value = `连接失败: ${error.message}`;
    alert('连接失败，请检查后端是否启动');
  }
};
</script>

<style scoped>
button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>