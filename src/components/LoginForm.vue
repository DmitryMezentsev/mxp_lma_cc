<template>
    <div class="login-form">
        <h4>{{ $t('authorizationRequired', lang) }}</h4>

        <el-form label-width="140px" :model="model" :rules="rules" @submit.prevent.native="submit">
            <el-form-item :label="$t('login', lang)" prop="login">
                <el-input v-model="model.login" autofocus></el-input>
            </el-form-item>
            <el-form-item :label="$t('password', lang)" prop="password">
                <el-input v-model="model.password" type="password"></el-input>
            </el-form-item>
            <el-form-item :label="$t('rememberMe', lang)" prop="rememberMe">
                <el-switch v-model="model.rememberMe"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">{{ $t('signIn', lang) }}</el-button>

                <el-select v-model="lang" @change="changeLang">
                    <el-option key="ru_RU" value="ru_RU" label="Русский"></el-option>
                    <el-option key="en_US" value="en_US" label="English"></el-option>
                    <el-option key="zh_CN" value="zh_CN" label="Chinese"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'LoginForm',
        data () {
            return {
                lang: 'ru_RU',
                model: {
                    login: '',
                    password: '',
                    rememberMe: true,
                },
                rules: {
                    login: { required: true, message: this.$t('fieldIsRequired', this.lang) },
                    password: { required: true, message: this.$t('fieldIsRequired', this.lang) },
                },
            }
        },
        methods: {
            submit () {

            },
            changeLang () {

            },
        },
    }
</script>

<style lang="less" scoped>
    .login-form {
        max-width: 480px;
        padding: 0 10px;
        margin: 100px auto;
    }
</style>