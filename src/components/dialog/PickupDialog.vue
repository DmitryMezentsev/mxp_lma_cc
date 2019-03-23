<template>
    <el-dialog :title="$t('viewPickup')"
               :visible.sync="visible"
               :width="width > 719 ? '700px' : '100%'"
               :close-on-press-escape="!waiting"
               :show-close="!waiting"
               :close-on-click-modal="!waiting"
               top="5vh">
        <el-form v-if="pickup"
                 :model="pickup"
                 :rules="rules"
                 ref="pickup"
                 class="compact-form">
            <el-row :gutter="10">
                <el-col :span="12" :xs="24">
                    <div class="values-section">
                        <Value :name="$t('providerNumber')" :value="pickup.logist.internalNumber" />
                        <Value :name="$t('shopNumber')" :value="pickup.sender.internalNumber" />
                    </div>
                    <div class="values-section">
                        <Value :name="$t('customer')" :value="pickup.sender.name" />
                    </div>
                </el-col>
                <el-col :span="12" :xs="24">
                    <div class="values-section">

                    </div>
                </el-col>
            </el-row>

            <hr class="margin-top margin-bottom-x2">
            <h3>{{ $t('warehouse') }}.</h3>
            <el-row :gutter="10">
                <el-col :span="12" :xs="24">
                    <div class="values-section">
                        <Value :name="$tc('name', 0)" :value="pickup.sender.warehouseName" />
                    </div>
                </el-col>
                <el-col :span="12" :xs="24">
                    <div class="values-section">
                        <Value :name="$t('zone')" :value="pickup.serviceInfo.zoneName" />
                    </div>
                </el-col>
            </el-row>
            <el-form-item :label="$t('address')"
                          prop="sender.warehouseAddress"
                          class="autocomplete-form-item"
                          required>
                <el-autocomplete v-if="currentUser.locale === 'RU' && !lock"
                                 v-model="pickup.sender.warehouseAddress"
                                 :fetch-suggestions="dadataCleanAddress"
                                 :debounce="700"
                                 name="warehouseAddress" />
                <el-input v-else
                          v-model="pickup.sender.warehouseAddress"
                          class="custom-readonly"
                          name="warehouseAddress"
                          :readonly="lock" />
            </el-form-item>
            <el-row :gutter="10">
                <el-col :span="12" :xs="24">
                    <el-form-item :label="$t('contactName')" prop="sender.contacts.name" required>
                        <el-input class="custom-readonly"
                                  name="contactName"
                                  v-model="pickup.sender.contacts.name"
                                  :readonly="lock" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item :label="$t('phone')" prop="sender.contacts.phone" required>
                        <el-input class="custom-readonly"
                                  name="phone"
                                  type="tel"
                                  v-inputmask
                                  v-model="pickup.sender.contacts.phone"
                                  :readonly="lock" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item :label="$t('comment')" prop="sender.notes">
                <el-input type="textarea"
                          class="custom-readonly"
                          name="notes"
                          v-model="pickup.sender.notes"
                          :readonly="lock" />
            </el-form-item>

            <hr class="margin-bottom-x2">
            <h3>{{ $t('declaredDimensions') }}.</h3>
            <el-row :gutter="10">
                <el-col :span="12" :xs="24">
                    <div class="values-section">
                        <Value :name="$t('weight')" :value="pickup.dimensions.weight / 1000" :suffix="$t('kg')" />
                    </div>
                </el-col>
                <el-col :span="12" :xs="24">
                    <div class="values-section">
                        <Value :name="$t('dimensions')" inner>
                            <Dimensions :values="pickup.dimensions" />
                        </Value>
                    </div>
                </el-col>
            </el-row>

            <hr class="margin-top margin-bottom-x2">
            <h3>{{ $t('actualDimensions') }}.</h3>
            <DimensionsInput className="custom-readonly"
                             class="dimensions-input"
                             width-prop-name="dimensions.widthFact"
                             height-prop-name="dimensions.heightFact"
                             length-prop-name="dimensions.lengthFact"
                             :width.sync="pickup.dimensions.widthFact"
                             :height.sync="pickup.dimensions.heightFact"
                             :length.sync="pickup.dimensions.lengthFact"
                             :readonly="lock || !isAdmin" />
            <el-row :gutter="10">
                <el-col :span="8" :xs="24">
                    <el-form-item :label="$t('weight')" prop="dimensions.weightFact">
                        <WeightInput name="weightFact"
                                     className="custom-readonly"
                                     :model.sync="pickup.dimensions.weightFact"
                                     :readonly="lock || !isAdmin" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-button class="hidden" native-type="submit" @click.prevent="save" />
        </el-form>
        <span v-if="pickup" slot="footer" class="dialog-footer">
            <el-button type="primary"
                       @click="save"
                       :loading="waiting"
                       v-show="!lock">
                {{ $t('save') }}
            </el-button>
            <el-button type="primary" @click="lock = false" v-show="lock">
                {{ $t('edit') }}
            </el-button>
            <el-button @click="close" :disabled="waiting">
                {{ $t('close') }}
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {mapState, mapActions, mapGetters} from 'vuex';
    import cloneDeep from 'lodash/cloneDeep';

    import mixins from 'Common/js/mixins';
    import inputmask from 'Directives/inputmask';
    import Dimensions from 'Components/Dimensions';
    import Value from 'Components/Value';
    import WeightInput from 'Base/components/form-elements/WeightInput';
    import DimensionsInput from 'Base/components/form-elements/DimensionsInput';

    export default {
        name: 'PickupDialog',
        mixins: [mixins],
        components: {DimensionsInput, WeightInput, Value, Dimensions},
        directives: {inputmask},
        data () {
            return {
                width: 0,
                pickup: null,
                lock: true,
                waiting: false,
                rules: {
                    'sender.contacts.name': [this.validationRule('required')],
                    'sender.contacts.phone': [this.validationRule('required'), this.validationRule('phone')],
                    'sender.warehouseAddress': [this.validationRule('required')],
                    'dimensions.weightFact': [this.validationRule('numberMin', [1, 0.001])],
                    'dimensions.widthFact': [this.validationRule('numberMin', [1, 1])],
                    'dimensions.heightFact': [this.validationRule('numberMin', [1, 1])],
                    'dimensions.lengthFact': [this.validationRule('numberMin', [1, 1])],
                },
            }
        },
        computed: {
            ...mapState('auth', [
                'currentUser',
            ]),
            ...mapState('pickups', {
                pickups: 'list',
                opened: 'opened',
            }),
            ...mapGetters('auth', [
                'isAdmin',
            ]),
            visible: {
                get () { return !!this.pickup; },
                set () { this.close(); },
            },
        },
        methods: {
            ...mapActions('pickups', [
                'close',
                'updatePickup',
            ]),
            save () {
                this.$refs.pickup.validate(valid => {
                    if (valid) {
                        this.waiting = true;

                        this.updatePickup({
                            pickup: this.pickup,
                            callback: (success) => {
                                if (success) {
                                    this.$emit('update');
                                    this.changesSavedMessage();
                                    this.close();
                                } else {
                                    this.waiting = false;
                                }
                            },
                        });
                    }
                });
            },
        },
        created () {
            this.bindClientWidth('width');
        },
        destroyed () {
            this.unbindClientWidth();
        },
        watch: {
            opened: {
                handler (opened) {
                    this.lock = true;
                    this.waiting = false;

                    this.pickup = (opened !== null)
                        ? cloneDeep(this.pickups.data[opened])
                        : null;
                },
                immediate: true,
            },
        },
    }
</script>

<style lang="less" scoped>
    @import "../../common/colors";

    h3 {
        font-weight: normal;
        margin: 0;
    }

    .autocomplete-form-item {
        .el-autocomplete { display: block; }
    }

    .dimensions-input { margin-top: 8px; }

    @media (max-width: 767px) {
        .el-col {
            &.el-col-xs-24:not(:first-child) {
                .values-section { margin-top: 0; }
            }
        }
    }
</style>