import App from './src/App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue'

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App)
});