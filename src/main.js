// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router';
import { routes } from './routes';
import 'bootstrap/dist/css/bootstrap.css';
import VueResource from 'vue-resource';
import Vuex from 'vuex';

Vue.config.productionTip = false

Vue.filter('currency', function (value) {
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  });

  return formatter.format(value);
});

export const eventBus = new Vue();
export const authService = { isLoggedIn: false };

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.http.options.root = 'http://localhost:3000';
Vue.http.interceptors.push((request, next) => {
  request.headers.set('X-CSRF-TOKEN', 'VERY_SECURE_TOKEN_HERE');
  next((res) => {
    // console.log(res);
  });
});

const store = new Vuex.Store({
  state: {
    cart: {
      items: []
    },
    cartTotal: 0
  }
})

const router = new VueRouter({
  routes: routes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }

    if (savedPosition) {
      return savedPosition;
    }

    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.isAuthRequired)) {
    if (!authService.isLoggedIn) {
      alert("You must be logged in!");
      return next(false);
    }
  }

  next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router: router,
  store: store,
})
