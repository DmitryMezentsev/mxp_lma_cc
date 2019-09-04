import Vuex from 'vuex';

import common from './modules/common';
import auth from './modules/auth';
import orders from './modules/orders';
import pickups from './modules/pickups';
import couriers from './modules/couriers';
import routing from './modules/routing';
import reporting from './modules/reporting';
import ordersTemplates from './modules/orders-templates';

export default () =>
  new Vuex.Store({
    modules: {
      common,
      auth,
      orders,
      pickups,
      couriers,
      routing,
      reporting,
      ordersTemplates,
    },
  });
