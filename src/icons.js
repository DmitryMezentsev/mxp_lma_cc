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
  faDownload,
  faHeadset,
  faFileUpload,
  faPencilAlt,
  faReply,
  faFileExcel,
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
library.add(faDownload);
library.add(faHeadset);
library.add(faFileUpload);
library.add(faPencilAlt);
library.add(faReply);
library.add(faFileExcel);

Vue.component('fa-icon', FontAwesomeIcon);
