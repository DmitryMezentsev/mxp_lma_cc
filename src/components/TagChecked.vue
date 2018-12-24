<template>
    <el-tag :disable-transitions="true" :type="checked ? null : 'info'" :class="{ active }">
        <i class="fas" :class="{ 'fa-check': checked, 'fa-times': !checked }"></i>{{ $t(label) }}
    </el-tag>
</template>

<script>
    export default {
        name: 'TagChecked',
        props: {
            label: { type: String, required: true },
            checked: { type: Boolean },
            active: { type: Boolean },
        },
    }
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 0 .5em .5em 0;

        &.active {
            cursor: pointer;
            user-select: none;

            &:hover {
                text-decoration: underline;
            }
        }

        i {
            margin-right: .5em;
        }
    }
</style>