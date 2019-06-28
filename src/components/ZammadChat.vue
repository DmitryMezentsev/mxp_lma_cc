<template></template>

<script>
/* global ZammadChat */
import { mapState, mapMutations } from 'vuex';

import { addScript } from 'Common/js/helpers';
import { ZAMMAD_CHAT_JS } from 'Common/js/env';
import { BLUE_COLOR } from 'Constants/colors';
import mixins from 'Common/js/mixins';

export default {
  name: 'ZammadChat',
  mixins: [mixins],
  data() {
    return {
      zammadChat: null,
    };
  },
  computed: {
    ...mapState('common', ['showZammadChat']),
  },
  methods: {
    ...mapMutations('common', ['closeZammadChat']),
    init() {
      if (!this.zammadChat) {
        this.zammadChat = new ZammadChat({
          title: this.$t('chatWithSupport'),
          background: BLUE_COLOR,
          fontSize: '12px',
          flat: true,
          chatId: 1,
        });

        this.zammadChat.onError = err => {
          this.warning(err, this.$t('chatWithSupport'));
          this.closeZammadChat();
        };
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
