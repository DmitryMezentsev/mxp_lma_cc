<template></template>

<script>
/* global ZammadChat */
import { mapState } from 'vuex';

import { addScript } from 'Common/js/helpers';
import { ZAMMAD_CHAT_JS } from 'Common/js/env';
import { BLUE_COLOR } from 'Constants/colors';

export default {
  name: 'ZammadChat',
  data() {
    return {
      zammadChat: null,
    };
  },
  computed: {
    ...mapState('common', ['showZammadChat']),
  },
  methods: {
    init() {
      if (!this.zammadChat) {
        this.zammadChat = new ZammadChat({
          title: this.$t('chatWithSupport'),
          background: BLUE_COLOR,
          fontSize: '12px',
          flat: true,
          chatId: 1,
        });
      }
    },
    destroy() {
      if (this.zammadChat) {
        // Если чат открыт, его сначала надо закрыть, потому что иначе destroy() не сработает
        if (this.zammadChat.isOpen) {
          this.zammadChat.close();

          setTimeout(() => {
            this.zammadChat.destroy();
            this.zammadChat = null;
          }, 850);
        } else {
          this.zammadChat.destroy();
          this.zammadChat = null;
        }
      }
    },
  },
  mounted() {
    addScript(ZAMMAD_CHAT_JS, () => {
      if (this.showZammadChat) this.init();
    });
  },
  watch: {
    showZammadChat(showZammadChat) {
      if (showZammadChat) this.init();
      else this.destroy();
    },
  },
};
</script>
