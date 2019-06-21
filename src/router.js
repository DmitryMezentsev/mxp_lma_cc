import VueRouter from 'vue-router';

import HomePage from 'Components/pages/HomePage';
import SettingsPage from 'Components/pages/SettingsPage';
import OrdersPage from 'Components/pages/OrdersPage';
import PickupsPage from 'Components/pages/PickupsPage';
import ClientsPage from 'Components/pages/ClientsPage';
import ClientPage from 'Components/pages/ClientPage';
import CouriersPage from 'Components/pages/CouriersPage';
import CourierPage from 'Components/pages/CourierPage';
import RoutingPage from 'Components/pages/RoutingPage';
import ReportingPage from 'Components/pages/ReportingPage';
import CourierCalculationPage from 'Components/pages/CourierCalculationPage';
import CodReportsPage from 'Components/pages/CodReportsPage';
import ServiceActsPage from 'Components/pages/ServiceActsPage';
import RoutingMapPage from 'Components/pages/RoutingMapPage';
import RoutingSummaryPage from 'Components/pages/RoutingSummaryPage';
import RoutingZonesPage from 'Components/pages/RoutingZonesPage';

export default new VueRouter({
  routes: [
    {
      name: 'home',
      path: '/',
      component: HomePage,
      meta: { isHome: true },
    },
    {
      name: 'settings',
      path: '/settings',
      component: SettingsPage,
    },
    {
      name: 'orders',
      path: '/orders',
      component: OrdersPage,
      redirect: '/orders/courier',
      children: [
        {
          name: 'ordersList',
          path: ':type(courier|point|search)',
          meta: {
            pageName: {
              param: 'type',
              values: {
                courier: 'courierOrders',
                point: 'pointOrders',
                search: 'ordersSearchResult',
              },
            },
          },
        },
      ],
    },
    {
      name: 'pickups',
      path: '/pickups',
      component: PickupsPage,
    },
    {
      name: 'clients',
      path: '/clients',
      component: ClientsPage,
      children: [
        {
          name: 'addClient',
          path: 'add',
          component: ClientPage,
        },
        {
          name: 'editClient',
          path: ':id',
          component: ClientPage,
        },
      ],
    },
    {
      name: 'couriers',
      path: '/couriers',
      component: CouriersPage,
      children: [
        {
          name: 'addCourier',
          path: 'add',
          component: CourierPage,
        },
        {
          name: 'editCourier',
          path: ':id',
          component: CourierPage,
        },
      ],
    },
    {
      name: 'routing',
      path: '/routing',
      component: RoutingPage,
      redirect: '/routing/map',
      children: [
        {
          name: 'routingMap',
          path: 'map',
          component: RoutingMapPage,
          meta: { pageName: 'map' },
        },
        {
          name: 'routingSummary',
          path: 'summary',
          component: RoutingSummaryPage,
          meta: { pageName: 'summary' },
        },
        {
          name: 'routingZones',
          path: 'zones',
          component: RoutingZonesPage,
          meta: { pageName: 'zones' },
        },
      ],
    },
    {
      name: 'reporting',
      path: '/reporting',
      component: ReportingPage,
      redirect: '/reporting/courier-calculation',
      children: [
        {
          name: 'courierCalculation',
          path: 'courier-calculation',
          component: CourierCalculationPage,
        },
        {
          name: 'codReports',
          path: 'cod',
          component: CodReportsPage,
        },
        {
          name: 'serviceActs',
          path: 'service-acts',
          component: ServiceActsPage,
        },
      ],
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
  mode: 'history',
  base: '/',
});
