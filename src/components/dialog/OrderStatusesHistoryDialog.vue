<template>
  <el-dialog
    :title="$t('statusesHistory')"
    :visible="!!statusesHistory"
    :width="clientWidth > 450 ? '400px' : '300px'"
    @close="setStatusesHistory(null)"
  >
    <el-timeline class="huge blue" reverse>
      <el-timeline-item
        v-for="(status, i) in statusesHistory"
        :color="colors[status.orderStatusModelId]"
        :icon="icons[status.orderStatusModelId]"
        :key="i"
        :timestamp="status.sourceCreatedAt | formatDate(true)"
      >
        {{ status.name }}</el-timeline-item
      >
    </el-timeline>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import { formatDate } from 'Common/js/filters';
import { SUCCESS_COLOR, WARNING_COLOR, DANGER_COLOR } from 'Constants/colors';

export default {
  name: 'OrderStatusesHistoryDialog',
  filters: { formatDate },
  data() {
    return {
      colors: {
        '101000': null, // Черновик
        '102000': null, // Подтвержден
        '104000': null, // Обработан
        '205000': null, // Передан в службу доставки
        '206000': null, // Принят для транспортировки
        '207000': null, // Передан на склад
        '308000': null, // Принят на склад
        '309000': null, // Сортировка
        '310000': null, // Отгружен со склада
        '412000': null, // Передан на ПВЗ
        '413000': null, // Принят на ПВЗ
        '414000': null, // Продлен срок хранения
        '415000': null, // Выдан на доставку
        '416000': null, // Курьер направился к получателю
        '417000': SUCCESS_COLOR, // Вручен
        '418000': null, // Перенос даты доставки
        '419000': WARNING_COLOR, // Вручен частично
        '420000': DANGER_COLOR, // Оформлен возврат
        '420206': DANGER_COLOR, // Оформлен возврат
        '420207': DANGER_COLOR, // Оформлен возврат
        '427000': null, // Возврат выдан на доставку
        '431000': null, // Курьер на месте
        '521000': null, // Возврат принят на склад
        '522000': WARNING_COLOR, // Возврат принят на склад частично
        '523000': null, // Сортировка возврата
        '524000': null, // Возврат отгружен со склада
        '525000': null, // Возврат принят для транспортировки
        '526000': null, // Возврат передан на склад
        '528000': SUCCESS_COLOR, // Возврат вручен
        '629000': DANGER_COLOR, // Отмена
        '630000': DANGER_COLOR, // Утерян
        '691000': WARNING_COLOR, // Неизвестный статус
        '692000': DANGER_COLOR, // Ошибка интеграции
      },
      icons: {
        '101000': 'el-icon-document', // Черновик
        '102000': 'el-icon-circle-check', // Подтвержден
        '104000': 'el-icon-refresh', // Обработан
        '205000': 'el-icon-truck', // Передан в службу доставки
        '206000': 'el-icon-truck', // Принят для транспортировки
        '207000': 'el-icon-s-home', // Передан на склад
        '308000': 'el-icon-s-home', // Принят на склад
        '309000': 'el-icon-refresh', // Сортировка
        '310000': 'el-icon-truck', // Отгружен со склада
        '412000': 'el-icon-receiving', // Передан на ПВЗ
        '413000': 'el-icon-receiving', // Принят на ПВЗ
        '414000': 'el-icon-date', // Продлен срок хранения
        '415000': 'el-icon-truck', // Выдан на доставку
        '416000': 'el-icon-bicycle', // Курьер направился к получателю
        '417000': 'el-icon-check', // Вручен
        '418000': 'el-icon-date', // Перенос даты доставки
        '419000': 'el-icon-finished', // Вручен частично
        '420000': 'el-icon-refresh-left', // Оформлен возврат
        '420206': 'el-icon-refresh-left', // Оформлен возврат
        '420207': 'el-icon-refresh-left', // Оформлен возврат
        '427000': 'el-icon-truck', // Возврат выдан на доставку
        '431000': 'el-icon-location', // Курьер на месте
        '521000': 'el-icon-s-home', // Возврат принят на склад
        '522000': 'el-icon-s-home', // Возврат принят на склад частично
        '523000': 'el-icon-refresh', // Сортировка возврата
        '524000': 'el-icon-truck', // Возврат отгружен со склада
        '525000': 'el-icon-truck', // Возврат принят для транспортировки
        '526000': 'el-icon-s-home', // Возврат передан на склад
        '528000': 'el-icon-check', // Возврат вручен
        '629000': 'el-icon-close', // Отмена
        '630000': 'el-icon-warning', // Утерян
        '691000': 'el-icon-question', // Неизвестный статус
        '692000': 'el-icon-close', // Ошибка интеграции
      },
    };
  },
  computed: {
    ...mapState('common', ['clientWidth']),
    ...mapState('orders', ['statusesHistory']),
  },
  methods: {
    ...mapMutations('orders', ['setStatusesHistory']),
  },
  destroyed() {
    this.setStatusesHistory(null);
  },
  watch: {
    $route() {
      this.setStatusesHistory(null);
    },
  },
};
</script>
