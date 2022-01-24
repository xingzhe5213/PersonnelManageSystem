import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        routes: [],
        sessions: {},
        token:null,
        hrs: [],
        currentSession: null,
        currentHr: JSON.parse(window.sessionStorage.getItem("user")),
        filterKey: '',
        stomp: null,
        isDot: {}
    },
    mutations: {
        initCurrentUser(state, hr) {
            state.currentHr = hr;
        },
        initRoutes(state, data) {
            state.routes = data;
        },
        initToken(state, token) {
            state.token = token;
        }
    },
    actions: {

    }
})

store.watch(function (state) {
    return state.sessions
}, function (val) {
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true
})

export default store;