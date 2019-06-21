import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import 'babel-polyfill'; // for IE11

import 'Common/styles';
import 'Common/element-custom.scss';
import 'Base/element-ui';
import 'Base/icons';
import i18n from 'Base/i18n';
import router from 'Base/router';
import getStore from 'Base/store';
import App from 'Components/App';

Vue.use(VueI18n);
Vue.use(VueRouter);
Vue.use(Vuex);

window.app = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store: getStore(),
  i18n: new VueI18n({ messages: i18n, locale: 'EN' }),
});
