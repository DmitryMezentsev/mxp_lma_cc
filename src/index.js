import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import 'babel-polyfill'; // for IE11
import ElementUI from 'element-ui';
import * as VueGoogleMaps from 'vue2-google-maps';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCheck,
  faTrash,
  faUser,
  faFileAlt,
  faTruckLoading,
  faWarehouse,
  faUsers,
  faUserTie,
  faMapMarkedAlt,
  faBook,
  faArchive,
  faRedoAlt,
  faIdBadge,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

import 'Common/styles';
import 'Common/element-custom.scss';
import { GOOGLE_MAPS_API_KEY } from 'Common/js/env';
import i18n from 'Base/i18n';
import router from 'Base/router';
import getStore from 'Base/store';
import App from 'Components/App';

Vue.use(VueI18n);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(ElementUI);

library.add(faCheck);
library.add(faTrash);
library.add(faUser);
library.add(faFileAlt);
library.add(faTruckLoading);
library.add(faWarehouse);
library.add(faUsers);
library.add(faUserTie);
library.add(faMapMarkedAlt);
library.add(faBook);
library.add(faArchive);
library.add(faRedoAlt);
library.add(faIdBadge);
library.add(faQuestionCircle);
Vue.component('fa-icon', FontAwesomeIcon);

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
