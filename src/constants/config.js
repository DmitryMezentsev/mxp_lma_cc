// Название приложения
export const APP_TITLE = 'MXP';

// Формат даты для отправки в API
export const DATE_API_FORMAT = 'yyyy-MM-dd';

// Число результатов на странице по умолчанию
export const PER_PAGE_DEFAULT = 10;

// Имена заголовков
export const HEADER_PG_TOTAL_COUNT = 'x-pagination-total-count';
export const HEADER_PG_PAGE_COUNT = 'x-pagination-page-count';

// Заголовки, добавляемые к запросу в случае отправки запроса в ядро
export const coreRequestHeaders = {
  'X-PATCH-HEADER': 1,
};
