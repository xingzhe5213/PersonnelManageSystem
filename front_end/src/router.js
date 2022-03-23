import Vue from 'vue'
import Router from 'vue-router'
import Login from './pages/Login.vue'
import Home from './pages/Home.vue'
import perInfo from './pages/perInfo.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'Login',
			component: Login,
			hidden: true
		},
		{
			path: '/home',
			name: 'Home',
			component: Home,
			hidden: true,
			meta: {
				roles: ['admin', 'user']
			},
			children: [
				{
					path: '/perInfo',
					name: '个人中心',
					component: perInfo,
					hidden: true
				}
			]
		},
		{
			path: "*",
			name: '404',
			component: () =>
				import ("./pages/404.vue")
		}
	]
})