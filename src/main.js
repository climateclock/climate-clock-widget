// Polyfill to support custom elements in IE9 or whatever
import 'document-register-element/build/document-register-element'

import Vue from 'vue'
import App from './App.vue'

import VueCustomElement from 'vue-custom-element'

Vue.use(VueCustomElement)
Vue.customElement('climate-clock', App)
