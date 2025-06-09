<template>
  <div class="shelf-container">
    <!-- 表头区域 -->
    <div class="table-header">
      <div class="header-cell name">商品名称</div>
      <div class="header-cell image">商品图片</div>
      <div class="header-cell price">商品价格</div>
      <div class="header-cell category">商品类别</div>
      <div class="header-cell actions">操作</div>
    </div>

    <div v-if="loading" class="loading">
      加载中...
      <div v-if="errorMessage">错误：{{ errorMessage }}</div>
    </div>

    <div v-else class="goods-list">
      <div class="empty-state" v-if="goodsList.length === 0">
        暂无商品，请先上传商品
      </div>

      <!-- 商品列表 -->
      <div class="good-item" v-for="item in goodsList" :key="item.goodid">
        <div class="item-card"> <!-- 新增卡片容器 -->
          <div class="item-content">
            <!-- 商品名称 -->
            <div class="cell name">
              <div v-if="!item.isEditing">{{ item.goodname || '未命名商品' }}</div>
              <input v-else v-model="item.goodname" type="text" placeholder="商品名称" class="edit-input">
            </div>

            <!-- 商品图片（禁止编辑） -->
            <div class="cell image">
              <img :src="getImageUrl(item)" alt="商品图片" class="goods-img"
                :class="{ loaded: item.isImageLoaded }" @load="(e) => handleImageLoad(e, item)"
                @error="handleImageError" />
              <div v-if="!item.isImageLoaded" class="loading-placeholder">
                加载中...
              </div>
            </div>

            <!-- 商品价格 -->
            <div class="cell price">
              <div v-if="!item.isEditing">¥{{ (item.goodprice || 0).toFixed(2) }}</div>
              <input v-else v-model.number="item.goodprice" type="number" min="0" step="0.01"
                placeholder="商品价格" class="edit-input">
            </div>

            <!-- 商品类别（下拉选择） -->
            <div class="cell category">
              <div v-if="!item.isEditing">{{ item.category || '未分类' }}</div>
              <select v-else v-model="item.category" class="edit-input">
                <option value="">请选择类别</option>
                <option value="电子数码">电子数码</option>
                <option value="书籍教材">书籍教材</option>
                <option value="服装配饰">服装配饰</option>
                <option value="运动健身">运动健身</option>
                <option value="家具家居">家具家居</option>
                <option value="其他">其他</option>
              </select>
            </div>

            <!-- 操作按钮 -->
            <div class="cell actions">
              <button v-if="!item.isEditing" @click="startEditing(item)">编辑</button>
              <button v-else @click="saveGood(item)">保存</button>
              <button @click="deleteGood(item)">删除</button>
              <!-- 仅当存在买家时显示确认出售按钮 -->
              <button @click="confirmSale(item)" v-if="item.buyername" class="confirm-btn">
                确认出售
              </button>
            </div>
          </div>
        </div> <!-- 卡片容器结束 -->
      </div>
    </div>
  </div>
</template>

<script setup>
// 脚本部分与原代码一致，无需修改
import { ref, onMounted } from 'vue';
import api from '../services/testService.js';

const props = defineProps({
  username: {
    type: String,
    required: true
  }
});

const loading = ref(true);
const errorMessage = ref('');
const goodsList = ref([]);

// 获取图片URL
const getImageUrl = (item) => {
  return item.img ? `http://localhost:8080${item.img}` : '/placeholder.png';
};

// 处理图片加载成功
const handleImageLoad = (e, item) => {
  item.isImageLoaded = true;
  e.target.classList.add('loaded');
};

// 处理图片加载失败
const handleImageError = (e) => {
  const target = e.target;
  target.style.display = 'none';
  const placeholder = target.nextElementSibling;
  if (placeholder) placeholder.style.display = 'flex';
};

// 获取商品列表
const fetchGoods = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';

    const response = await api.getUserGoods(props.username);
    if (!response.data.success) {
      throw new Error(response.data.message || '获取商品列表失败');
    }

    goodsList.value = response.data.data.map(item => ({
      ...item,
      isImageLoaded: false,
      isEditing: false,
      originalData: null
    }));

  } catch (error) {
    console.error('获取商品列表失败:', error);
    errorMessage.value = error.message || '无法连接到服务器';
  } finally {
    loading.value = false;
  }
};

// 开始编辑商品
const startEditing = (item) => {
  item.originalData = {
    ...item
  };
  item.isEditing = true;
};

// 保存商品修改
const saveGood = async (item) => {
  try {
    const formData = new FormData();
    formData.append('goodid', item.goodid);
    formData.append('goodname', item.goodname);
    formData.append('goodprice', item.goodprice);
    formData.append('category', item.category);

    await api.updateGood(formData);
    alert('商品信息更新成功');
    item.isEditing = false;
    fetchGoods();
  } catch (error) {
    console.error('更新商品失败:', error);
    alert('更新商品失败，请重试');
  }
};

// 删除商品
const deleteGood = async (item) => {
  if (confirm(`确定删除商品 "${item.goodname}" 吗？`)) {
    try {
      await api.deleteGood(item.goodid);
      alert('删除成功');
      fetchGoods();
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
  }
};

// 确认出售商品
const confirmSale = async (item) => {
  if (!confirm(`确认出售商品 "${item.goodname}"？该操作将标记商品为已售出`)) return;

  try {
    await api.confirmSale(item.goodid);
    alert('出售确认成功！商品状态已更新');
    fetchGoods(); // 刷新列表
  } catch (error) {
    console.error('确认出售失败:', error);
    alert('操作失败，请检查网络或重试');
  }
};

onMounted(() => {
  fetchGoods();
});
</script>

<style scoped>
.shelf-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px; /* 顶部间距调整 */
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
  padding: 15px 20px;
  background-color: #66BB6A; /* 表头背景色 */
  color: white;
  border-radius: 8px; /* 统一圆角 */
  font-weight: 600;
}

.item-card {
  background-color: #f9fafb; /* 浅灰色背景 */
  border-radius: 10px; /* 圆角 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* 阴影 */
  padding: 5px; /* 卡片内边距 */
  margin-bottom: 15px; /* 商品间距 */
  transition: transform 0.2s, box-shadow 0.2s; /* 过渡效果 */
}

.item-card:hover {
  transform: translateY(-2px); /* 悬停上浮 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 悬停阴影加深 */
}

.item-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 10px;
  align-items: center;
  padding: 15px; /* 内容内边距 */
  background: white; /* 内容区白色背景 */
  border-radius: 8px; /* 内容区圆角 */
}

.cell {
  padding: 8px 0;
}

.cell.name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cell.image {
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

.cell.price {
  color: #e53e3e;
  text-align: center;
}

.cell.category {
  text-align: center;
}

.cell.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cell.actions button {
  padding: 6px 12px;
  background-color: #66BB6A;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.cell.actions button:hover {
  background-color: #558B2F;
  transform: translateY(-1px);
}

.edit-input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.confirm-btn {
  background-color: #EF5350;
}

.confirm-btn:hover {
  background-color: #E53935;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .table-header,
  .item-content {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }

  .cell.category,
  .header-cell.category {
    display: none;
  }

  .cell.image {
    height: 60px;
  }
}
</style>