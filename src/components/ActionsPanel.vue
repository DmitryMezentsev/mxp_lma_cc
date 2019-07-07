<template>
  <div class="actions-panel" :class="{ opened: actions }">
    <div
      v-if="actions"
      v-for="(actionsGroup, i) in actions"
      class="actions-group"
      :class="{ 'right-group': i === 0, 'left-group': i === 1 }"
    >
      <div
        v-for="(action, j) in actionsGroup"
        class="action"
        :key="action.key || j"
        v-if="!action.hideWidth || action.hideWidth < clientWidth"
      >
        <el-button
          :type="action.btnType || 'primary'"
          :disabled="action.disabled"
          :loading="action.loading"
          @click="action.callback()"
        >
          <fa-icon v-if="action.icon" :icon="action.icon" class="btn-margin" />{{ action.name }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ActionsPanel',
  props: {
    actions: { type: Array },
  },
  computed: {
    ...mapState('common', ['clientWidth']),
  },
};
</script>

<style lang="less">
@import '~Common/colors';

.actions-panel {
  @height: 60px;

  position: fixed;
  bottom: -@height;
  right: 0;
  left: 240px;
  height: @height;
  padding: 10px 20px 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  cursor: default;
  user-select: none;
  background-color: rgba(255, 255, 255, 0.85);
  border-top: 1px solid @lighter-border-color;
  font-size: 0;
  z-index: 50;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);

  &.opened {
    transition: bottom 0.2s ease;
    bottom: 0;
  }

  .actions-group {
    @actions-margin: 10px;

    display: flex;

    &.right-group {
      .action {
        &:not(:last-child) {
          margin-right: @actions-margin;
        }
      }
    }

    &.left-group {
      .action {
        &:not(:first-child) {
          margin-left: @actions-margin;
        }
      }
    }
  }
}

.sidebar-collapsed {
  .actions-panel {
    left: 65px;
  }
}
</style>
