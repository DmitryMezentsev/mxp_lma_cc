<template>
    <span>{{ formattedVal }}</span>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: 'currency',
        props: {
            val: { type: Number, default: 0 },
        },
        computed: {
            ...mapState('auth', [
                'currentUser',
            ]),
            formattedVal () {
                const locales = { RU: 'ru-RU', EN: 'en-US', ZH: 'zh-CN' };
                const currencies = { rub: 'RUB', usd: 'USD', cny: 'CNY' };
                const currSymbols = { rub: '₽', usd: '$', cny: '¥' };

                const val = this.val / 100; // Ибо цены в копейках передаются

                return val.toLocaleString
                    ? val.toLocaleString(locales[this.currentUser.locale], {
                        style: 'currency',
                        currency: currencies[this.currentUser.currency],
                    })
                    // Для браузеров без поддержки toLocaleString()
                    : val.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, ' ') + ' ' + currSymbols[this.currentUser.currency];
            },
        },
    }
</script>