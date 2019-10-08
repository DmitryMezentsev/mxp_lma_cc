import VueRouter from 'vue-router';

import BasePage from 'Components/pages/BasePage';
// LMA
import LMAHomePage from 'Components/pages/LMA/LMAHomePage';
import LMASettingsPage from 'Components/pages/LMA/LMASettingsPage';
import LMAOrdersPage from 'Components/pages/LMA/LMAOrdersPage';
import LMAPickupsPage from 'Components/pages/LMA/LMAPickupsPage';
import LMAClientsPage from 'Components/pages/LMA/LMAClientsPage';
import LMAClientPage from 'Components/pages/LMA/LMAClientPage';
import LMACouriersPage from 'Components/pages/LMA/LMACouriersPage';
import LMACourierPage from 'Components/pages/LMA/LMACourierPage';
import LMARoutingPage from 'Components/pages/LMA/LMARoutingPage';
import LMAReportingPage from 'Components/pages/LMA/LMAReportingPage';
import LMAAcceptanceCodFromCourierPage from 'Components/pages/LMA/LMAAcceptanceCodFromCourierPage';
import LMACodReportsPage from 'Components/pages/LMA/LMACodReportsPage';
import LMAServiceActsPage from 'Components/pages/LMA/LMAServiceActsPage';
import LMARoutingMapPage from 'Components/pages/LMA/LMARoutingMapPage';
import LMARoutingSummaryPage from 'Components/pages/LMA/LMARoutingSummaryPage';
import LMARoutingZonesPage from 'Components/pages/LMA/LMARoutingZonesPage';
// CC
import CCHomePage from 'Components/pages/CC/CCHomePage';
import CCSettingsPage from 'Components/pages/CC/CCSettingsPage';
import CCOrdersPage from 'Components/pages/CC/CCOrdersPage';
import CCOrdersImportPage from 'Components/pages/CC/CCOrdersImportPage';
import CCOrdersImportTemplatesPage from 'Components/pages/CC/CCOrdersImportTemplatesPage';
import CCOrdersImportTemplatePage from 'Components/pages/CC/CCOrdersImportTemplatePage';
import CCOrderPage from 'Components/pages/CC/CCOrderPage';

export default new VueRouter({
  routes: [
    {
      name: 'base',
      path: '/',
      component: BasePage,
      meta: { isBase: true },
    },
    {
      name: 'lma',
      path: '/lma',
      component: LMAHomePage,
      children: [
        {
          name: 'lmaSettings',
          path: 'settings',
          component: LMASettingsPage,
          meta: { pageName: 'settings' },
        },
        {
          name: 'lmaOrders',
          path: 'orders',
          component: LMAOrdersPage,
          redirect: 'orders/courier',
          meta: { pageName: 'orders' },
          children: [
            {
              name: 'lmaOrdersList',
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
          name: 'lmaPickups',
          path: 'pickups',
          component: LMAPickupsPage,
          meta: { pageName: 'pickups' },
        },
        {
          name: 'lmaClients',
          path: 'clients',
          component: LMAClientsPage,
          meta: { pageName: 'clients' },
          children: [
            {
              name: 'lmaAddClient',
              path: 'add',
              component: LMAClientPage,
              meta: { pageName: 'addClient' },
            },
            {
              name: 'lmaEditClient',
              path: ':id',
              component: LMAClientPage,
              meta: { pageName: 'editClient' },
            },
          ],
        },
        {
          name: 'lmaCouriers',
          path: 'couriers',
          component: LMACouriersPage,
          meta: { pageName: 'couriers' },
          children: [
            {
              name: 'lmaAddCourier',
              path: 'add',
              component: LMACourierPage,
              meta: { pageName: 'addCourier' },
            },
            {
              name: 'lmaEditCourier',
              path: ':id',
              component: LMACourierPage,
              meta: { pageName: 'editCourier' },
            },
          ],
        },
        {
          name: 'lmaRouting',
          path: 'routing',
          component: LMARoutingPage,
          meta: { pageName: 'routing' },
          redirect: '/routing/map',
          children: [
            {
              name: 'lmaRoutingMap',
              path: 'map',
              component: LMARoutingMapPage,
              meta: { pageName: 'map' },
            },
            {
              name: 'lmaRoutingSummary',
              path: 'summary',
              component: LMARoutingSummaryPage,
              meta: { pageName: 'summary' },
            },
            {
              name: 'lmaRoutingZones',
              path: 'zones',
              component: LMARoutingZonesPage,
              meta: { pageName: 'zones' },
            },
          ],
        },
        {
          name: 'lmaReporting',
          path: 'reporting',
          component: LMAReportingPage,
          meta: { pageName: 'reporting' },
          redirect: '/reporting/acceptance-cod-from-courier',
          children: [
            {
              name: 'lmaAcceptanceCodFromCourier',
              path: 'acceptance-cod-from-courier',
              component: LMAAcceptanceCodFromCourierPage,
              meta: { pageName: 'acceptanceCodFromCourier' },
            },
            {
              name: 'lmaCodReports',
              path: 'cod',
              component: LMACodReportsPage,
              meta: { pageName: 'codReports' },
            },
            {
              name: 'lmaServiceActs',
              path: 'service-acts',
              component: LMAServiceActsPage,
              meta: { pageName: 'serviceActs' },
            },
          ],
        },
      ],
    },
    {
      name: 'cc',
      path: '/cc',
      component: CCHomePage,
      children: [
        {
          name: 'ccSettings',
          path: 'settings',
          component: CCSettingsPage,
          meta: { pageName: 'settings' },
        },
        {
          name: 'ccOrders',
          path: 'orders',
          component: CCOrdersPage,
          meta: { pageName: 'orders' },
          children: [
            {
              name: 'ccOrdersSearch',
              path: 'search',
              meta: { pageName: 'ordersSearchResult' },
            },
            {
              name: 'ccOrdersImport',
              path: 'import',
              component: CCOrdersImportPage,
              meta: { pageName: 'ordersImport' },
              children: [
                {
                  name: 'ccOrdersImportTemplates',
                  path: 'templates',
                  component: CCOrdersImportTemplatesPage,
                  meta: { pageName: 'templates' },
                  children: [
                    {
                      name: 'ccOrdersAddImportTemplate',
                      path: 'add',
                      component: CCOrdersImportTemplatePage,
                      meta: { pageName: 'addTemplate' },
                    },
                    {
                      name: 'ccOrdersEditImportTemplate',
                      path: ':id',
                      component: CCOrdersImportTemplatePage,
                      meta: { pageName: 'editTemplate' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'ccAddOrder',
              path: 'add',
              component: CCOrderPage,
              meta: { pageName: 'addOrder' },
            },
          ],
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
