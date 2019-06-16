import moment from 'moment';

import getStore from 'Base/store';


// Разбивает число на разряды
export const number = number => {
    return (number || number == 0)
        ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        : '—';
};

// Выводит денежную сумму в отформатированном виде
export const currency = (val = 0) => {
    const {locale, currency} = getStore().getters['auth/getCurrentUser'];

    const locales = { RU: 'ru-RU', EN: 'en-US', ZH: 'zh-CN' };
    const currencies = { rub: 'RUB', usd: 'USD', cny: 'CNY' };
    const currSymbols = { rub: '₽', usd: '$', cny: '¥' };

    val /= 100; // Ибо цены передаются в копейках

    return val.toLocaleString
        ? val.toLocaleString(locales[locale], {
            style: 'currency',
            currency: currencies[currency],
        })
        // Для браузеров без поддержки toLocaleString()
        : val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, ' ') + ' ' + currSymbols[currency];
};

// Выводит в отформатированном виде дату (и время)
export const formatDate = (date, showTime) => {
    const {locale, timezone} = getStore().getters['auth/getCurrentUser'];

    switch (locale) {
        case 'RU': moment.locale('ru'); break;
        case 'ZH': moment.locale('zh-cn'); break;
        default:   moment.locale('en');
    }

    const momentDate = (typeof date === 'number')
        // timestamp
        ? moment.unix(date / 1000).utc().utcOffset(timezone)
        // iso date
        : moment(date);

    let result = momentDate.format('L');
    if (showTime) result += ' ' + momentDate.format('LT');

    return result;
};

