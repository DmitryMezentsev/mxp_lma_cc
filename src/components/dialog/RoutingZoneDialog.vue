<template>
    <el-dialog :title="title"
               :visible="!!zone"
               :width="width > 719 ? '700px' : '100%'"
               :close-on-press-escape="!waiting"
               :show-close="!waiting"
               :close-on-click-modal="!waiting"
               @open="onOpen"
               @close="close"
               top="5vh">
        <el-form v-if="zone"
                 ref="zone"
                 :model="zone"
                 :rules="rules">

            <el-button @click.prevent="save" native-type="submit" class="hidden" />
        </el-form>
        <span v-if="zone" slot="footer" class="dialog-footer">
            <el-button @click="close"
                       :disabled="waiting">
                {{ $t('close') }}
            </el-button>
            <el-button type="primary"
                       @click="save"
                       :disabled="waiting"
                       :loading="waiting">
                {{ $t('save') }}
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    import mixins from 'Common/js/mixins';
    import Waiting from 'Components/Waiting';

    export default {
        name: 'RoutingZoneDialog',
        components: {Waiting},
        mixins: [mixins],
        data () {
            return {
                width: 0,
                waiting: false,
                rules: {

                },
            }
        },
        computed: {
            ...mapState('geo', {
                zone: 'opened',
            }),
            title () {
                return (this.zone)
                    ? this.$t(this.zone.geoId ? 'editingZone' : 'newZone')
                    : null;
            },
        },
        methods: {
            ...mapActions('geo', [
                'close',
            ]),
            save () {
                this.$refs.zone.validate(valid => {
                    if (valid) {
                        this.waiting = true;


                    }
                });
            },
            onOpen () {
                this.waiting = false;
            },
        },
        created () {
            this.bindClientWidth('width');
        },
        destroyed () {
            this.unbindClientWidth();
        },
    }
</script>

<style lang="less" scoped>

</style>