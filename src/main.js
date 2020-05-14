import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource';
import {Input, Col, Row} from 'ant-design-vue';
import 'ant-design-vue/lib/input/style/css'; // 加载 CSS
import 'ant-design-vue/lib/grid/style/css'; // 加载 CSS

Vue.use(VueResource);
Vue.use(Input);
Vue.use(Col);
Vue.use(Row);

new Vue({
  el: '#app',
  render: h => h(App)
})
