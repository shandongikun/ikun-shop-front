import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// 新增：导入 ElementPlus 及其样式
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 新增：导入 ElementPlus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const app = createApp(App);
app.use(router);

// 新增：注册 ElementPlus
app.use(ElementPlus);

// 新增：全局注册 ElementPlus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');