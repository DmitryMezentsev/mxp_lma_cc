<template>
    <el-dialog :title="$t('order') + ' ' + ' [' + $t('numInShop') + ': ' + ']'"
               :visible.sync="visible"
               :width="width > 719 ? '700px' : '100%'"
               top="5vh">
        <el-row>
            <el-col :span="12" :xs="24">
                <div class="values-section">
                    <div class="value">
                        <span class="value-label">{{ $t('shop') }}: </span> 11.
                    </div>
                </div>
                <div class="values-section">
                    <div class="value">
                        <span class="value-label">{{ $t('recipient') }}: </span> 11.
                    </div>
                    <div class="value">
                        <span class="value-label">{{ $t('phone') }}: </span> 11.
                    </div>
                </div>
                <div class="values-section">
                    <div class="value">
                        <span class="value-label">{{ $t('city') }}: </span> 11.
                    </div>
                    <div class="value">
                        <span class="value-label">{{ $t('issuePoint') }}: </span> 11.
                    </div>
                    <div class="value">
                        <span class="value-label">{{ $t('storageTime') }}: </span> {{ $tc('to', 2) }} 11.
                    </div>
                    <div class="value">
                        <span class="value-label">{{ $t('arrivalDate') }}: </span> 11.
                    </div>
                </div>
            </el-col>
            <el-col :span="12" :xs="24">
                <div class="values-section">
                    <div class="value">
                        <span class="value-label">{{ $t('weight') }}: </span> 11{{ $t('kg') }}.
                    </div>
                    <div class="value">
                        <span class="value-label">{{ $t('dimensions') }}: </span> <Dimensions :values="{}" />.
                    </div>
                </div>
                <div class="values-section">
                    <div class="value">
                        <span class="value-label">{{ $t('assessedValue') }}: </span> 11.
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="comment" v-show="true">
            <h4>{{ $t('comment') }}:</h4>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to make a type
            specimen book.
        </div>
        <div class="services">
            <h4>{{ $t('services') }}:</h4>
            <div class="services-list">
                <div class="tags-wrap">
                    <TagChecked label="opening" :checked="true" />
                    <TagChecked label="fitting" :checked="false" />
                    <TagChecked label="partialIssue" :checked="false" />
                    <TagChecked label="attachedDocuments" :checked="true" v-show="false" />
                    <TagChecked label="printDocument" :checked="true" active @click="printDocument()" />
                </div>
            </div>
        </div>
        <div class="products">
            <h4>{{ $t('products') }}:</h4>
            <el-table :data="[]"
                      :empty-text="$t('noProducts')">
                <el-table-column
                        v-if="width > 639"
                        type="index"
                        label="#"
                        width="40">
                </el-table-column>
                <el-table-column
                        prop=""
                        :label="$tc('name', 3)">
                </el-table-column>
                <el-table-column
                        prop=""
                        :label="$tc('quantity', 2)"
                        width="120">
                    <template slot-scope="scope">
                        <el-input-number v-model="order.id"
                                         controls-position="right"
                                         size="mini"
                                         placeholder="1"
                                         class="compact"
                                         @change="productAmountOnChange"
                                         :min="1"
                                         :max="10" />
                    </template>
                </el-table-column>
                <el-table-column
                        v-if="width > 479"
                        prop=""
                        :label="$t('price')">
                </el-table-column>
                <el-table-column
                        v-if="width > 579"
                        prop=""
                        :label="$t('sum')">
                </el-table-column>
                <el-table-column fixed="right" width="65">
                    <template slot-scope="scope">
                        <el-tooltip :content="$t('remove')" placement="left">
                            <el-button @click="removeProduct(scope.$index)"
                                       type="danger"
                                       size="mini">
                                <i class="fas fa-trash"></i>
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <br>
            <el-row>
                <el-col :span="12">
                    <div class="value">
                        <span class="value-label">{{ $t('totalProductsPrice') }}: </span> {{ productsSum }}.
                    </div>
                </el-col>
                <el-col :span="12" class="text-right">
                    <el-button @click="saveProductsList"
                               size="mini"
                               type="warning"
                               v-show="productsChanged"
                               plain>
                        {{ $t('saveProducts') }}
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="partialIssue" :v-show="true">
                {{ $t('partialIssue') }}
            </el-button>
            <el-button @click="toIssue" type="success">
                {{ $t('toIssue') }}
            </el-button>
            <el-button @click="toReturn" type="danger">
                {{ $t('return') }}
            </el-button>
            <el-button @click="close">
                {{ $t('close') }}
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
    import Dimensions from '../Dimensions';
    import TagChecked from '../TagChecked';

    import mixins from '../../common/mixins';

    export default {
        name: 'OrderDialog',
        mixins: [mixins],
        components: {TagChecked, Dimensions},
        props: {
            data: { type: Object, required: true },
        },
        data () {
            return {
                width: 0,
                order: { ...this.data },
                productsChanged: false,
            }
        },
        computed: {
            visible: {
                get () { return !!this.order; },
                set () { this.close(); },
            },
            productsSum () {
                return 0;
            },
        },
        methods: {
            printDocument () {

            },
            saveProductsList () {
                this.productsChanged = false;
                this.$message({
                    message: this.$t('productsSaved'),
                    type: 'success',
                });
            },
            removeProduct (index) {
                this.productsChanged = true;


            },
            productAmountOnChange () {
                this.productsChanged = true;
            },
            partialIssue () {

            },
            toIssue () {

            },
            toReturn () {

            },
            close () {
                this.$emit('close');
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
    @import "../../common/colors";

    h4 {
        font-size: 13px;
        font-weight: normal;
        color: @secondary-text-color;
        margin:  0 0 .3em 0;
    }

    .block-border {
        margin: 1em 0;
        padding-top: 1em;
        border-top: 1px solid @lighter-border-color;
    }

    .el-col {
        &.el-col-xs-24 {
            &:not(:last-child) {
                @media (max-width: 767px) { margin-bottom: 1em; }
            }
        }
    }

    .comment {
        .block-border;
    }

    .services {
        .block-border;

        .services-list {
            margin-top: .5em;

            .tags-wrap { font-size: 0; }
        }
    }

    .products {
        .block-border;


    }
</style>