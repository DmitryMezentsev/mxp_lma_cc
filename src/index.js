import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import 'babel-polyfill'; // for IE11
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import * as VueGoogleMaps from 'vue2-google-maps';

import 'Common/styles';
import { GOOGLE_MAPS_API_KEY } from 'Common/js/env';
import i18n from 'Base/i18n';
import router from 'Base/router';
import getStore from 'Base/store';
import App from 'Components/App';

Vue.use(VueI18n);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(ElementUI);

window.app = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store: getStore(),
  i18n: new VueI18n({ messages: i18n, locale: 'EN' }),
  methods: {
    includeGoogleMaps(language) {
      Vue.use(VueGoogleMaps, {
        load: {
          key: GOOGLE_MAPS_API_KEY,
          language,
        },
      });
    },
  },
});
