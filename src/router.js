import VueRouter from 'vue-router';


import HomePage from './components/pages/HomePage';
import AccountPage from './components/pages/AccountPage';
import AccountSettingsPage from './components/pages/AccountSettingsPage';
import OrdersPage from './components/pages/OrdersPage';
import PickupsPage from './components/pages/PickupsPage';
import ClientsPage from './components/pages/ClientsPage';
import ClientPage from './components/pages/ClientPage';
import CouriersPage from './components/pages/CouriersPage';
import CourierPage from './components/pages/CourierPage';
import RoutingPage from './components/pages/RoutingPage';
import ReportingPage from './components/pages/ReportingPage';
import CourierCalculationPage from './components/pages/CourierCalculationPage';
import ReportingStatementsPage from './components/pages/ReportingStatementsPage';
import ServiceActsPage from './components/pages/ServiceActsPage';


export default new VueRouter({
    routes: [{
        name: 'home',
        path: '/',
        component: HomePage,
        meta: { isHome: true },
    }, {
        name: 'account',
        path: '/account',
        component: AccountPage,
        redirect: '/account/settings',
        children: [{
            name: 'accountSettings',
            path: 'settings',
            component: AccountSettingsPage,
        }],
    }, {
        name: 'orders',
        path: '/orders',
        component: OrdersPage,
        redirect: '/orders/courier',
        children: [{
            name: 'ordersList',
            path: ':type(courier|point|search)',
            meta: {
                pageName: {
                    param: 'type',
                    values: { courier: 'courierOrders', point: 'pointOrders', search: 'ordersSearchResult' },
                },
            },
        }],
    }, {
        name: 'pickups',
        path: '/pickups',
        component: PickupsPage,
    }, {
        name: 'clients',
        path: '/clients',
        component: ClientsPage,
        children: [{
            name: 'addClient',
            path: 'add',
            component: ClientPage,
        }, {
            name: 'editClient',
            path: ':id',
            component: ClientPage,
        }],
    }, {
        name: 'couriers',
        path: '/couriers',
        component: CouriersPage,
        children: [{
            name: 'addCourier',
            path: 'add',
            component: CourierPage,
        }, {
            name: 'editCourier',
            path: ':id',
            component: CourierPage,
        }],
    }, {
        name: 'routing',
        path: '/routing',
        component: RoutingPage,
    }, {
        name: 'reporting',
        path: '/reporting',
        component: ReportingPage,
        redirect: '/reporting/courier-calculation',
        children: [{
            name: 'courierCalculation',
            path: 'courier-calculation',
            component: CourierCalculationPage,
        }, {
            name: 'reportingStatements',
            path: 'reporting-statements',
            component: ReportingStatementsPage,
        }, {
            name: 'serviceActs',
            path: 'service-acts',
            component: ServiceActsPage,
        }],
    }, {
        path: '*',
        redirect: '/',
    }],
    mode: 'history',
    base: '/',
});