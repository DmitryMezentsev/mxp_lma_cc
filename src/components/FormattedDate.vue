<template>
    <span>{{ formattedDate }}</span>
</template>

<script>
    import {mapState} from 'vuex';
    import moment from 'moment';

    export default {
        name: 'FormattedDate',
        props: {
            date: { type: [Number, String], required: true },
            showTime: { type: Boolean, default: false },
        },
        computed: {
            ...mapState('auth', [
                'currentUser',
            ]),
            formattedDate () {
                switch (this.currentUser.locale) {
                    case 'RU': moment.locale('ru'); break;
                    case 'ZH': moment.locale('zh-cn'); break;
                    default:   moment.locale('en');
                }

                const momentDate = (typeof this.date === 'number')
                    // timestamp
                    ? moment.unix(this.date / 1000).utc().utcOffset(this.currentUser.timezone)
                    // iso date
                    : moment(this.date);

                let result = momentDate.format('L');
                if (this.showTime) result += ' ' + momentDate.format('LT');

                return result;
            },
        },
    }
</script>