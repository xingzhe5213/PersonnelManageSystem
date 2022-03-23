import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		routes: [],
		currentHr: JSON.parse(window.sessionStorage.getItem("user")),
	},
	mutations: {
		initCurrentUser(state, hr) {
			state.currentHr = hr;
		},
		initRoutes(state, data) {
			state.routes = data;
		}
	}
})

export default store;