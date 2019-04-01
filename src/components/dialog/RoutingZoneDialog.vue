<template>
    <el-dialog :title="title"
               :visible="!!zone"
               :close-on-press-escape="!waiting"
               :show-close="!waiting"
               :close-on-click-modal="!waiting"
               @open="onOpen"
               @close="close"
               width="95%"
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
            <Map class="map"
                 height="600px"
                 :help="$t('markOnMapZoneBoundaries')"
                 @init="mapInit" />
            <el-button @click.prevent="save" native-type="submit" class="hidden" />
        </el-form>
        <span v-if="zone" slot="footer" class="dialog-footer">
            <el-button @click="clearMap"
                       :disabled="waiting">
                {{ $t('clearMap') }}
            </el-button>
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
    import isEqual from 'lodash/isEqual';
    import get from 'lodash/get';
    import {mapState, mapActions} from 'vuex';

    import {centerCoordsFromGeometry} from 'Common/js/helpers';
    import {DANGER_COLOR, SUCCESS_COLOR} from 'Constants/colors';
    import mixins from 'Common/js/mixins';
    import Waiting from 'Components/Waiting';
    import Map from 'Components/Map';

    export default {
        name: 'RoutingZoneDialog',
        components: {Waiting, Map},
        mixins: [mixins],
        data () {
            return {
                waiting: false,
                map: null,
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
                'saveZone',
            ]),
            mapInit (map) {
                const refreshGeoJson = () => {
                    map.data.toGeoJson(geo => {
                        if (geo.features.length > 1)
                            this.warning(this.$t('polygonsCantBeSeveral'));

                        this.zone.type = get(geo, 'features[0].type', '');
                        this.zone.geometry = get(geo, 'features[0].geometry', null);
                    });
                };

                map.data.setControls(['Polygon']);
                map.data.setStyle({ editable: true });
                map.data.addListener('addfeature', refreshGeoJson);
                map.data.addListener('removefeature', refreshGeoJson);
                map.data.addListener('setgeometry', refreshGeoJson);

                this.map = map;
                this.updateMap(this.zone.type, this.zone.geometry, true);
            },
            clearMap () {
                this.zone.type = '';
                this.zone.geometry = null;
            },
            updateMap (type, geometry, center) {
                const newGeometry = {
                    type: 'FeatureCollection',
                    features: geometry
                        ? [{ type, geometry, properties: {} }]
                        : [],
                };

                this.map.data.toGeoJson(currentGeometry => {
                    if (!isEqual(currentGeometry.features, newGeometry.features)) {
                        // Снос прежних полигонов
                        this.map.data.forEach(poly => this.map.data.remove(poly));

                        // Добавление нового полигона
                        this.map.data.addGeoJson(newGeometry);

                        if (center) this.map.setCenter(centerCoordsFromGeometry(newGeometry));
                    }
                });
            },
            save () {
                this.$refs.zone.validate(valid => {
                    if (valid) {
                        if (this.zone.geometry) {
                            this.waiting = true;

                            this.saveZone({
                                zone: this.zone,
                                callback: success => {
                                    this.waiting = false;

                                    if (success) {
                                        this.$emit('update');
                                        this.changesSavedMessage();
                                        this.close();
                                    }
                                },
                            });
                        } else {
                            this.warning(this.$t('zoneNotSet'));
                        }
                    }
                });
            },
            onOpen () {
                this.waiting = false;
            },
        },
        watch: {
            'zone.geometry': {
                handler (geometry) {
                    if (this.map && this.zone)
                        this.updateMap(this.zone.type, geometry);
                },
                deep: true,
            },
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

    .map {
        margin-top: 5px;
    }
</style>