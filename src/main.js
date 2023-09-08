// Polyfill to support custom elements in IE9 or whatever
import 'document-register-element/build/document-register-element'

import Vue from 'vue'
import Widget from './Widget.vue'

import VueCustomElement from 'vue-custom-element'
import browserDetect from 'vue-browser-detect-plugin'
import axios from 'axios'


Vue.prototype.$http = axios
Vue.config.ignoredElements = [/^ccw-/]

Vue.use(browserDetect)
Vue.use(VueCustomElement)

Vue.customElement('flatten-widget', Widget)
