import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 从 router 目录导入默认导出的 router 实例

const app = createApp(App);
app.use(router); // 使用正确导入的 router 变量
app.mount('#app');