<template>
	<div class="upload-form">
		<h2>上传新商品</h2>
		<form @submit.prevent="handleUpload">
			<!-- 商品基本信息 -->
			<div class="form-group">
				<label>商品名称：</label>
				<input type="text" v-model="form.goodname" required />
			</div>

			<div class="form-group">
				<label>商品价格：</label>
				<input type="number" v-model="form.goodprice" required min="0.01" step="0.01" />
			</div>

			<!-- 商品类别选择 -->
			<div class="form-group">
				<label>商品类别：</label>
				<select v-model="form.category" required>
					<option value="">请选择类别</option>
					<option value="电子数码">电子数码</option>
					<option value="书籍教材">书籍教材</option>
					<option value="服装配饰">服装配饰</option>
					<option value="运动健身">运动健身</option>
					<option value="家具家居">家具家居</option>
					<option value="其他">其他</option>
				</select>
			</div>

			<div class="form-group">
				<label>商品描述：</label>
				<textarea v-model="form.detail" rows="5"></textarea>
			</div>

			<!-- 图片上传 -->
			<div class="form-group">
				<label>上传图片：</label>
				<input type="file" accept="image/*" @change="handleImageUpload" />
				<div v-if="imageUrl" class="preview-image">
					<img :src="imageUrl" alt="预览" />
				</div>
			</div>

			<!-- 提交按钮 -->
			<button type="submit" :disabled="isLoading">
				{{ isLoading ? '上传中...' : '提交商品' }}
			</button>
		</form>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue';


	import api from '../services/testService.js'; // 引入封装的 API 服务

	// 定义接收的 props
	const props = defineProps({
		username: {
			type: String,
			required: true
		}
	});

	// 上传表单数据
	const form = reactive({
		goodid: '',
		username: props.username, // 使用父组件传递的用户名
		goodname: '',
		goodprice: 0,
		category: '',
		img: '',
		detail: ''
	});

	// 图片上传相关
	const imageUrl = ref('');
	const imageFile = ref(null);
	const isLoading = ref(false);

	// 生成商品 ID（使用时间戳+随机数确保唯一性）
	onMounted(() => {
		form.goodid = generateGoodId();
	});

	const generateGoodId = () => {
		return Date.now() + Math.floor(Math.random() * 1000);
	};

	// 图片上传处理
	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			imageFile.value = file;
			const reader = new FileReader();
			reader.onload = (event) => {
				imageUrl.value = event.target.result;
			};
			reader.readAsDataURL(file);
		}
	};

	// 提交上传（修改 API 调用部分）
	const handleUpload = async () => {
		if (!validateForm()) return;

		isLoading.value = true;

		try {
			const formData = new FormData();
			form.goodid = generateGoodId();
			formData.append('goodid', form.goodid);
			formData.append('username', form.username);
			formData.append('goodname', form.goodname);
			formData.append('goodprice', form.goodprice);
			formData.append('category', form.category);
			formData.append('details', form.detail);
			formData.append('image', imageFile.value);

			// 使用封装的 api 调用
			const response = await api.uploadGood(formData); // 假设后端接口名为 uploadGood

			if (response.data.success) {
				console.log('商品上传成功:', response.data.message);
				// 清空表单
				form.goodid = generateGoodId();
				form.goodname = '';
				form.goodprice = 0;
				form.category = '';
				form.detail = '';
				imageUrl.value = '';
				imageFile.value = null;
				alert('商品上传成功！');
			} else {
				alert(response.data.message);
			}
		} catch (error) {
			console.error('上传失败:', error);
			alert('上传失败，请重试');
		} finally {
			isLoading.value = false;
		}
	};

	// 表单验证保持不变
	const validateForm = () => {
		if (!form.goodname) {
			alert('请填写商品名称');
			return false;
		}
		if (form.goodprice <= 0) {
			alert('请填写有效价格');
			return false;
		}
		if (!form.category) {
			alert('请选择商品类别');
			return false;
		}
		if (!imageFile.value) {
			alert('请上传商品图片');
			return false;
		}
		return true;
	};
</script>

<style scoped>
	.upload-form {
		max-width: 600px;
		margin: 0 auto;
	}

	.form-group {
		margin-bottom: 18px;
	}

	.form-group label {
		display: block;
		margin-bottom: 6px;
		color: #4a5568;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 10px;
		border: 1px solid #e2e8f0;
		border-radius: 4px;
		font-size: 14px;
	}

	.form-group textarea {
		height: 120px;
	}

	.preview-image {
		margin-top: 10px;
		max-width: 300px;
		height: 200px;
		object-fit: cover;
		border: 1px solid #e2e8f0;
		border-radius: 4px;
	}

	button[type="submit"] {
		width: 100%;
		padding: 14px;
		background: #42b983;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 16px;
		cursor: pointer;
		transition: transform 0.2s;
	}

	button[type="submit"]:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>