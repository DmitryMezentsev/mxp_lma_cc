import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import 'babel-polyfill'; // for IE11
import {
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Alert,
  Icon,
  Row,
  Col,
  Progress,
  Badge,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Loading,
  MessageBox,
  Message,
  Notification,
} from 'element-ui';
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

// Element UI components
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Alert);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Progress);
Vue.use(Badge);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

// Font Awesome icons
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
