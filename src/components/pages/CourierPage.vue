<template>
    <div>
        <el-form v-if="courier"
                 ref="courier"
                 :model="courier"
                 :rules="rules"
                 :key="courier.courierId">
            <div class="form-wrap">
                <el-row :gutter="10">
                    <el-col :span="8" :xs="24">
                        <h4>{{ $t('basic') }}</h4>
                        <el-form-item :label="$t('fullName')" prop="fullname" required>
                            <el-input v-model="courier.fullname" name="fullname"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('shortName')" prop="shortname" required>
                            <el-input v-model="courier.shortname" name="shortname"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('phone')" prop="phone1" required>
                            <el-input v-model="courier.phone1" v-inputmask name="phone1" type="tel"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('additionalPhone')" prop="phone2">
                            <el-input v-model="courier.phone2" v-inputmask name="phone2" type="tel"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('livingArea')" prop="livingArea" required>
                            <el-input v-model="courier.livingArea" name="livingArea"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :xs="24">
                        <h4>{{ $t('passportData') }}</h4>
                        <el-form-item :label="$t('registrationAddress')" prop="passport.address" required>
                            <el-input v-model="courier.passport.address" name="passport.address"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('passportNumber')" prop="passport.series" required>
                            <el-input v-model="courier.passport.series" name="passport.series"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('whenAndWhoIssuedPassport')" prop="passport.issueInfo" required>
                            <el-input v-model="courier.passport.issueInfo" name="passport.issueInfo"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('birthday')" prop="passport.birthday" required>
                            <br>
                            <el-date-picker v-model="courier.passport.birthday" type="date"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :xs="24">
                        <h4>{{ $t('carData') }}</h4>
                        <el-form-item :label="$t('brand')" prop="transport.brand" class="transport-brand">
                            <el-autocomplete
                                    name="transport.brand"
                                    v-model="courier.transport.brand"
                                    :fetch-suggestions="carBrands">
                            </el-autocomplete>
                        </el-form-item>

                        <el-form-item :label="$t('model')" prop="transport.model">
                            <el-input v-model="courier.transport.model" name="transport.model"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('govNumber')" prop="transport.registrationNumber">
                            <el-input v-model="courier.transport.registrationNumber" name="transport.registrationNumber"></el-input>
                        </el-form-item>

                        <br>
                        <h4>{{ $t('authorizationData') }}</h4>
                        <el-form-item :label="$t('login')" prop="access.login" required>
                            <el-input v-model="courier.access.login" name="access.login" :readonly="!isAdd" class="custom-readonly"></el-input>
                        </el-form-item>
                        <el-form-item v-if="isAdd" :label="$t('password')" prop="access.password" required>
                            <el-input v-model="courier.access.password"
                                      name="access.password"
                                      :placeholder="$tc('atLeastCharacters', 1, { quantity: minPasswordLength })">
                            </el-input>
                            <el-button size="mini" @click="generatePassword">{{ $t('generatePassword') }}</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="documents">
                    <h4>{{ $t('documents') }}</h4>
                    <div v-if="courier.documentsPhotos.length">

                    </div>
                    <div v-else>
                        <small>{{ $t('noDocuments') }}.</small>
                    </div>
                    <div class="upload-button-wrap">
                        <el-button size="mini" @click="openUploadDocumentDialog" type="primary">{{ $t('uploadDocument') }}</el-button>
                    </div>
                </div>
            </div>

            <div class="buttons-panel">
                <div>
                    <div v-if="!isAdd">
                        <el-button v-if="courier.isActive"
                                   :disabled="!!processing"
                                   :loading="processing === 'changeActive'"
                                   @click="changeActive(false)"
                                   type="danger"
                                   class="to-archive">
                            <i class="fas fa-archive btn-margin"></i>{{ $t('toArchive') }}
                        </el-button>
                        <el-button v-else
                                   :disabled="!!processing"
                                   :loading="processing === 'changeActive'"
                                   @click="changeActive(true)"
                                   type="primary"
                                   class="restore">
                            <i class="fas fa-redo-alt btn-margin"></i>{{ $t('restore') }}
                        </el-button>
                        <el-button :disabled="!!processing"
                                   @click="sendNewPassword"
                                   class="send-new-password">
                            {{ $t('sendNewPasswordInSMS') }}
                        </el-button>
                    </div>
                </div>
                <div>
                    <router-link :to="{ name: 'couriers' }">
                        <el-button :disabled="!!processing"
                                   class="cancel">
                            {{ $t('cancel') }}
                        </el-button>
                    </router-link>
                    <el-button :disabled="!!processing"
                               :loading="processing === 'saving'"
                               @click.prevent="submit"
                               native-type="submit"
                               type="success">
                        {{ $t(isAdd ? 'createCourier' : 'saveChanges') }}
                    </el-button>
                </div>
            </div>
        </el-form>
        <Waiting v-else />
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    import mixins from '../../common/js/mixins';
    import {generateRandomString} from '../../common/js/helpers';
    import cars from '../../common/js/cars';
    import inputmask from '../../directives/inputmask';
    import Waiting from '../Waiting';

    // Минимальная длина пароля при создании нового курьера
    const minPasswordLength = 6;

    export default {
        name: 'CourierPage',
        components: {Waiting},
        mixins: [mixins],
        directives: {inputmask},
        data () {
            return {
                minPasswordLength,
                processing: false,
                isAdd: this.$route.name === 'addCourier',
                rules: {
                    fullname: [this.validationRule('required')],
                    shortname: [this.validationRule('required')],
                    phone1: [this.validationRule('required'), this.validationRule('phone')],
                    phone2: [this.validationRule('phone')],
                    livingArea: [this.validationRule('required')],
                    'passport.address': [this.validationRule('required')],
                    'passport.series': [this.validationRule('required')],
                    'passport.issueInfo': [this.validationRule('required')],
                    'passport.birthday': [this.validationRule('required')],
                    'access.login': [this.validationRule('required')],
                    'access.password': [this.validationRule('required'), { type: 'string', min: minPasswordLength, message: this.$t('passwordIsTooShort') }],
                },
            }
        },
        computed: {
            ...mapState('auth', [
                'currentUser',
            ]),
            ...mapState('couriers', [
                'courier',
            ]),
        },
        methods: {
            ...mapActions('couriers', [
                'createNewCourier',
                'openCourier',
                'saveCourier',
                'patchCourier',
            ]),
            carBrands (query, cb) {
                query = query.trim().toLowerCase();

                const result = (query.length > 1)
                    ? cars[this.currentUser.locale].filter(car => car.toLowerCase().indexOf(query) !== -1)
                    : [];

                cb(result.map(value => {
                    return { value };
                }));
            },
            openUploadDocumentDialog () {

            },
            changeActive (active) {
                let dialogTitle = this.$t(active ? 'restoreCourierConfirmation' : 'toArchiveCourierConfirmation');

                this.confirm(dialogTitle, ok => {
                    if (ok) {
                        this.processing = 'changeActive';

                        this.patchCourier({
                            id: this.courier.courierId,
                            params: { isActive: active },
                            callback: success => {
                                this.processing = false;
                                if (success) this.courier.isActive = active;
                            },
                        });
                    }
                });
            },
            sendNewPassword () {
                this.confirm(this.$t('sendPasswordDialogText'), ok => {
                    if (ok) {

                    }
                }, this.$t('sendPassword'));
            },
            generatePassword () {
                this.courier.access.password = generateRandomString();
            },
            submit () {
                this.$refs.courier.validate(valid => {
                    if (valid) {
                        this.processing = 'saving';
                        this.saveCourier({
                            courier: this.courier,
                            callback: success => {
                                this.processing = false;
                                if (success) this.$router.push({ name: 'couriers' });
                            },
                        });
                    }
                });
            },
        },
        mounted () {
            if (this.$route.name === 'editCourier')
                this.openCourier(this.$route.params.id);
            else
                this.createNewCourier();
        },
    }
</script>

<style lang="less" scoped>
    @import "../../common/colors";

    .form-wrap {
        padding-bottom: 45px;

        .transport-brand {
            .el-autocomplete {
                display: block;
            }
        }

        .documents {
            margin-top: 2em;
            border-top: 1px solid @light-border-color;

            .upload-button-wrap {
                margin: 1em 0;
                text-align: right;
            }
        }
    }

    .buttons-panel {
        .to-archive,
        .restore,
        .cancel {
            @media (max-width: 849px) {
                display: none;
            }
        }

        .send-new-password {
            @media (max-width: 849px) {
                margin-left: 0;
            }

            @media (max-width: 579px) {
                display: none;
            }
        }
    }
</style>