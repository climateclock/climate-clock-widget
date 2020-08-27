
import Vue from 'vue'
import Widget from './Widget.vue'

import VueCustomElement from 'vue-custom-element'
import axios from 'axios'


Vue.prototype.$http = axios
Vue.config.ignoredElements = [/^ccw-/]

Vue.use(VueCustomElement)

Vue.customElement('climate-clock', Widget)
