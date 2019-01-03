import App from './src/App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import Vuex from 'vuex';
import Store from './src/store/Store.js';

Vue.use(ElementUI);
Vue.use(Vuex);

let store = Store.createStore();
new Vue({
  el: '#app',
  store: store,
  render: h => h(App)
});