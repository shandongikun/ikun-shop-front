import {
	createRouter,
	createWebHistory
} from 'vue-router';
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import MyShop from '../components/MyShop.vue';
import prin from "../components/TestButton.vue";

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
	{
		path: '/register',
		name: 'Register',
		component: Register
	},
	{
		path: '/my-shop',
		name: 'MyShop',
		component: MyShop
	},
	{
		path: '/prin',
		name: 'prin',
		component: prin
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router;