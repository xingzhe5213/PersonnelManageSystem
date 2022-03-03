import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import md5 from 'js-md5';

import ElementUI from  'element-ui';
Vue.use(ElementUI);
import 'element-ui/lib/theme-chalk/index.css';

import ElSelectTree from 'el-select-tree';
Vue.use(ElSelectTree);

Vue.prototype.$ELEMENT = {size: 'small', zIndex: 3000};

import {Post} from "./utils/api";
import {PostKey} from "./utils/api";
import {Put} from "./utils/api";
import {Delete} from "./utils/api";
import {Get} from "./utils/api";
import {initMenu} from "./utils/menus";

Vue.prototype.Post = Post;
Vue.prototype.PostKey = PostKey;
Vue.prototype.Put = Put;
Vue.prototype.Delete = Delete;
Vue.prototype.Get = Get;
Vue.prototype.$md5 = md5;
Vue.prototype.$store = store;

import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.path == '/') {
    next();
  } else {
    if (window.sessionStorage.getItem("user")) {
      initMenu(router, store);
      next();
    } else {
      next('/?redirect=' + to.path);
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
