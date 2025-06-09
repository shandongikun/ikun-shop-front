// frontend/src/services/testService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // 后端API地址


export default {
	test() {
		return axios.get(`${API_URL}/print`);
	},

	/* 登录 */
	login(credentials) {
		return axios.post(`${API_URL}/login`, credentials);
	},

	// 注册接口：发送 POST 请求，携带 JSON 数据
	register(userData) {
		return axios.post(`${API_URL}/register`, userData, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	},
	
	// 检查用户名和邮箱是否匹配用于找回密码
	checkUsernameAndEmail(username, email) {
    return axios.get(`${API_URL}/user/checkUsernameAndEmail`, {
      params: {
        username,
         email
        }
      });
	},
	// 找回密码修改密码
	resetPassword(username, newPassword) {
    return axios.post(`${API_URL}/user/resetPassword`, {
      username,
      newPassword
    });
	},


	// 商品上传接口
	uploadGood(formData) {
		return axios.post(`${API_URL}/goods/upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	},


	// 获取商品列表（新增）
	getGoodsList() {
		return axios.get(`${API_URL}/goods/list`);
	},

	// 获取商品列表（主页展示）
	getGoodsList() {
		return axios.get(`${API_URL}/goods/list`);
	},


	// 获取用户商品列表（商铺编辑）
	getUserGoods(username) {
		return axios.get(`${API_URL}/goods/user/${username}`);
	},

	// 更新商品接口（新增）
	updateGood(formData) {
		return axios.post(`${API_URL}/goods/update`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	},

	// 删除商品
	deleteGood(goodId) {
		return axios.delete(`${API_URL}/goods/${goodId}`);
	},


	// 获取卖家历史订单
	// getSellerOrders(sellerUsername) {
	//   return axios.get(`${API_URL}/history/seller/${sellerUsername}`);
	// },

	// 获取用户信息
	getUserInfo(username) {
		return axios.get(`${API_URL}/user/info`, {
			params: {
				username
			}
		});
	},

	// 更新用户信息
	updateProfile(userId, userData) {
		return axios.post(`${API_URL}/user/update`, {
			...userData,
			id: userId
		});
	},

	// 修改密码
	changePassword(username, oldPassword, newPassword) {
		return axios.post(`${API_URL}/user/changePassword`, {
			username,
			oldPassword,
			newPassword
		});
	},

	// 获取商品详情
	getGoodsDetail(goodid) {
		return axios.get(`${API_URL}/goods/${goodid}`);
	},

	// 下单接口
	placeOrder(orderData) {
		return axios.post(`${API_URL}/order/place`, orderData);
	},

	// 确认出售接口
	confirmSale(goodid) {
		return axios.post(`${API_URL}/goods/confirm-sale/${goodid}`);
	},

	// 获取卖家已出售的商品（ing=1 且 username=卖家用户名）
	getSoldGoodsBySeller(username) {
		return axios.get(`${API_URL}/goods/sold/seller/${username}`);
	},

	// 获取买家已买入的商品（ing=1 且 buyername=买家用户名）
	getSoldGoodsByBuyer(username) {
		return axios.get(`${API_URL}/goods/sold/buyer/${username}`);
	}



};