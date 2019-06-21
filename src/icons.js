import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCheck,
  faTrash,
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
  faSignOutAlt,
  faCogs,
} from '@fortawesome/free-solid-svg-icons';

library.add(faCheck);
library.add(faTrash);
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
library.add(faSignOutAlt);
library.add(faCogs);

Vue.component('fa-icon', FontAwesomeIcon);
