import {
	createRouter,
	createWebHistory
} from 'vue-router';
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import MyShop from '../components/MyShop.vue';
import personal from "../components/Personal.vue";
import fon from "../components/FoundPass.vue";
import order from "../components/Order.vue";
import BuyGoods from "../components/BuyGoods.vue"; // 新增导入购买页面组件

const routes = [{
		path: '/',
		name: 'Home',
		component: Home
	},
	
	
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	
	
	//注册
	{
		path: '/register',
		name: 'Register',
		component: Register
	},
	
	
	//商店
	{
		path: '/my-shop',
		name: 'MyShop',
		component: MyShop,
		meta: {
			requiresAuth: true
		}
	},
	
	
	
	//个人主页
	{
		path: '/personal',
		name: 'personal',
		component: personal,
		meta: {
			requiresAuth: true
		}
	},
	
	
	//找回密码
	{
		path: '/fon',
		name: 'fon',
		component: fon
	},
	
	
	//订单
	{
		path: '/order',
		name: 'order',
		component: order,
		meta: {
			requiresAuth: true
		}
	},
	
	
	//购买
	{
		path: '/buy/:goodid',
		name: 'BuyGoods',
		component: BuyGoods,
		meta: {
			requiresAuth: true
		}
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
	const isLoggedIn = localStorage.getItem('userName');

	if (to.meta.requiresAuth) {
		if (isLoggedIn) {
			next();
		} else {
			next(`/login?redirect=${to.path}`);
		}
	} else {
		next();
	}
});

export default router;