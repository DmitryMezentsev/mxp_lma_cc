import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import 'babel-polyfill'; // for IE11
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './common/styles';
import i18n from './i18n';
import router from './router';
import getStore from './store';
import App from './components/App';


Vue.use(VueI18n);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(ElementUI);


new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store: getStore(),
    i18n: new VueI18n({ messages: i18n }),
});