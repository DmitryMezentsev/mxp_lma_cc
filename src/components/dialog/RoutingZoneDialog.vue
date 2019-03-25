<template>
    <el-dialog :title="title"
               :visible="!!zone"
               :width="width > 719 ? '700px' : '95%'"
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
            <el-row>
                    <el-col :span="14" :xs="24">
                        <el-form-item :label="$tc('name', 0)" prop="properties.name" required>
                            <el-input class="custom-readonly"
                                      name="name"
                                      v-model="zone.properties.name"
                                      :readonly="waiting" />
                        </el-form-item>
                    </el-col>
                <el-col :span="10" :xs="24">
                    <el-form-item prop="properties.isOperating" class="active-switch">
                        <el-switch v-model="zone.properties.isOperating"
                                   name="isOperating"
                                   :disabled="waiting"
                                   :inactive-color="DANGER_COLOR"
                                   :active-color="SUCCESS_COLOR"
                                   :active-text="$tc('active', 0)"
                                   :inactive-text="$t('inArchive')">
                        </el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
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

    import {DANGER_COLOR, SUCCESS_COLOR} from 'Constants/colors';
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
                    'properties.name': [this.validationRule('required')],
                },
                DANGER_COLOR,
                SUCCESS_COLOR,
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
    .active-switch {
        @media (min-width: 768px) {
            text-align: right;
            margin-top: 38px;
        }
    }
</style>