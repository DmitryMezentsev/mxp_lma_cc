import moment from 'moment';

import getStore from 'Base/store';
import { COURIER, DRON, POINT, POST } from 'Constants/delivery-types';
import { PREPAY, CASH, CARD, SAFE } from 'Constants/payment-types';

// Разбивает число на разряды
export const number = num => {
  // eslint-disable-next-line prettier/prettier, eqeqeq
  return (num || num == 0)
    ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    : '—';
};

// Выводит денежную сумму в отформатированном виде
export const currency = (val = 0) => {
  /* eslint-disable */
  const { locale, currency } = getStore().getters['auth/getCurrentUser'];

  const locales = { RU: 'ru-RU', EN: 'en-US', ZH: 'zh-CN' };
  const currencies = { rub: 'RUB', usd: 'USD', cny: 'CNY' };
  const currSymbols = { rub: '₽', usd: '$', cny: '¥' };

  // Ибо цены передаются в копейках
  val /= 100;

  return val.toLocaleString
    ? val.toLocaleString(locales[locale], {
      style: 'currency',
      currency: currencies[currency],
    })
    // Для браузеров без поддержки toLocaleString()
    : val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, ' ') + ' ' + currSymbols[currency];
  /* eslint-enable */
};

// Выводит в отформатированном виде дату (и время)
export const formatDate = (date, showTime) => {
  if (!date) return '—';

  const { locale, timezone } = getStore().getters['auth/getCurrentUser'];

  switch (locale) {
    case 'RU':
      moment.locale('ru');
      break;
    case 'ZH':
      moment.locale('zh-cn');
      break;
    default:
      moment.locale('en');
  }

  const momentDate =
    typeof date === 'number'
      ? // timestamp
        moment
          .unix(date / 1000)
          .utc()
          .utcOffset(timezone)
      : // iso date
        moment(date);

  let result = momentDate.format('L');
  if (showTime) result += ` ${momentDate.format('LT')}`;

  return result;
};

// Тип доставки (самовывоз / курьерская / почта)
export const deliveryType = type => {
  switch (Number(type)) {
    case COURIER:
      return window.app.$t('courier');
    case POINT:
      return window.app.$t('issuePoint');
    case POST:
      return window.app.$t('post');
    case DRON:
      return window.app.$t('dron');
    default:
      return '—';
  }
};

// Тип оплаты (предоплата / наличными / картой / безопасная сделка)
export const paymentType = type => {
  switch (Number(type)) {
    case PREPAY:
      return window.app.$t('prepay');
    case CASH:
      return window.app.$t('inCash');
    case CARD:
      return window.app.$t('byCard');
    case SAFE:
      return window.app.$t('safeTransaction');
    default:
      return '—';
  }
};

// Выводит название склада по ID
export const warehouseName = id => {
  const { permissions } = getStore().getters['auth/getCurrentUser'];
  return permissions.warehouseIds[id] || '—';
};

// Выводит название договора по ID
export const contractName = id => {
  const { permissions } = getStore().getters['auth/getCurrentUser'];
  return permissions.contracts[id] || '—';
};
