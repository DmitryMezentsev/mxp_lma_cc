import moment from 'moment';

import getStore from 'Base/store';

// Разбивает число на разряды
export const number = num => {
  // eslint-disable-next-line
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
