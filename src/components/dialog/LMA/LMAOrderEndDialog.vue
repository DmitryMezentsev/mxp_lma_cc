<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :append-to-body="true"
    :width="clientWidth > 480 ? '450px' : '300px'"
  >
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item v-if="mode === 'issue'" :label="$t('paymentType')" prop="paymentType" required>
        <br />
        <el-radio-group v-model="form.paymentType">
          <el-radio-button name="paymentType" :label="1">{{ $t('inCash') }}</el-radio-button>
          <el-radio-button name="paymentType" :label="2">{{ $t('byCard') }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('comment')" prop="comment">
        <el-input type="textarea" v-model="form.comment" name="comment" />
      </el-form-item>
    </el-form>
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
      this.$emit('end', this.form);
    },
    cancel() {
      this.$emit('cancel');
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
