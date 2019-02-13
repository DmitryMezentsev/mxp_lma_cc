import Vuex from 'vuex';

import auth from './modules/auth';
import orders from './modules/orders';
import couriers from './modules/couriers';


export default () =>
    new Vuex.Store({
        modules: {
            auth,
            orders,
            couriers,
        },
    });