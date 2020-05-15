import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource';
import {Input, Col, Row, Button} from 'ant-design-vue';
import 'ant-design-vue/lib/input/style/css'; // 加载 CSS
import 'ant-design-vue/lib/grid/style/css'; // 加载 CSS
import 'ant-design-vue/lib/button/style/css'

Vue.use(VueResource);
Vue.use(Input);
Vue.use(Col);
Vue.use(Row);
Vue.use(Button);
new Vue({
  el: '#app',
  render: h => h(App)
})
