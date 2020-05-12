// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import PageHeader from '@/components/PageHeader'

//引入公共js
import common from '@/common/common.js'
//引入CRC
import CRC from '@/common/CRC.js'
//引入剪切板
import clipboard from 'vue-clipboard2'


Vue.component('page-Header',PageHeader)
Vue.use(clipboard)
Vue.use(ElementUI)
Vue.prototype.common = common;
Vue.prototype.CRC = CRC;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
