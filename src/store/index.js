import Vuex from 'vuex';

import common from './modules/common';
import auth from './modules/auth';
import orders from './modules/orders';
import pickups from './modules/pickups';
import couriers from './modules/couriers';
import geo from './modules/geo';


export default () =>
    new Vuex.Store({
        modules: {
            common,
            auth,
            orders,
            pickups,
            couriers,
            geo,
        },
    });