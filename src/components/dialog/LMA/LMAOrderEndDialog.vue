<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :append-to-body="true"
    :width="clientWidth > 480 ? '450px' : '300px'"
    :close-on-press-escape="!waiting"
    :show-close="!waiting"
    :close-on-click-modal="!waiting"
    @open="onOpen"
    @close="onClose"
  >
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item v-if="mode === 'issue'" :label="$t('paymentType')" prop="paymentType" required>
        <br />
        <el-radio-group v-model="form.paymentType" :disabled="waiting">
          <el-radio-button name="paymentType" :label="1">{{ $t('inCash') }}</el-radio-button>
          <el-radio-button name="paymentType" :label="2">{{ $t('byCard') }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('comment')" prop="comment">
        <el-input
          type="textarea"
          class="custom-readonly"
          name="comment"
          ref="comment"
          v-model="form.comment"
          :readonly="waiting"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" :disabled="waiting">{{ $t('cancel') }}</el-button>
      <el-button type="success" v-if="mode === 'issue'" :loading="waiting" @click="end">{{
        $t('toIssue')
      }}</el-button>
      <el-button type="danger" v-if="mode === 'return'" :loading="waiting" @click="end">{{
        $t('return')
      }}</el-button>
      <el-button type="danger" v-if="mode === 'cancel'" :loading="waiting" @click="end">{{
        $t('orderCancel')
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';

import mixins from 'Common/js/mixins';

export default {
  name: 'LMAOrderEndDialog',
  props: {
    mode: { type: String },
  },
  mixins: [mixins],
  data() {
    return {
      waiting: false,
      form: {
        paymentType: 1,
        comment: '',
      },
    };
  },
  computed: {
    ...mapState('common', ['clientWidth']),
    visible: {
      get() {
        return !!this.mode;
      },
      set(visible) {
        if (!visible) this.$emit('cancel');
      },
    },
    title() {
      switch (this.mode) {
        case 'issue':
          return this.$t('orderIssue');
        case 'return':
          return this.$t('orderReturn');
        case 'cancel':
          return this.$t('orderCancel');
        default:
          return '';
      }
    },
    rules() {
      return {
        paymentType: this.mode === 'issue' ? [this.validationRule('selectRequired')] : [],
      };
    },
  },
  methods: {
    end() {
      this.waiting = true;
      this.$emit('end', {
        paymentType: this.mode === 'issue' ? this.form.paymentType : undefined,
        comment: this.form.comment,
      });
    },
    cancel() {
      this.$emit('cancel');
    },
    onOpen() {
      this.$nextTick(() => this.$refs.comment.focus());
    },
    onClose() {
      this.waiting = false;
    },
  },
  watch: {
    mode(mode) {
      if (mode && this.$refs.form) {
        this.$refs.form.resetFields();
        this.$refs.form.clearValidate();
      }
    },
  },
};
</script>
