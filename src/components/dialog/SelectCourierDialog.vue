<template>
  <el-dialog
    :title="$t('selectCourier')"
    :visible="visible"
    :width="clientWidth > 450 ? '400px' : '300px'"
    :close-on-press-escape="!waiting"
    :show-close="!waiting"
    :close-on-click-modal="!waiting"
    @open="onOpen"
    @close="cancel"
  >
    <CourierSelect :model.sync="courier" :disabled="waiting" />
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="waiting" @click="cancel">
        {{ $t('cancel') }}
      </el-button>
      <el-button type="primary" :disabled="waiting || !courier" :loading="waiting" @click="select">
        {{ $t('done') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';

import CourierSelect from 'Components/form-elements/CourierSelect';

export default {
  name: 'SelectCourierDialog',
  components: { CourierSelect },
  props: {
    visible: { type: Boolean },
  },
  data() {
    return {
      waiting: false,
      courier: null,
    };
  },
  computed: {
    ...mapState('common', ['clientWidth']),
  },
  methods: {
    onOpen() {
      this.waiting = false;
      this.courier = null;
    },
    cancel() {
      this.$emit('cancel');
    },
    select() {
      this.waiting = true;
      this.$emit('select', this.courier);
    },
  },
};
</script>
