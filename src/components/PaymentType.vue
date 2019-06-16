<template>
    <span>
        <span v-if="paymentType">{{ $t(paymentType) }}</span>
        <span v-else>&mdash;</span>
    </span>
</template>

<script>
    import {PREPAY, CASH, CARD, SAFE} from 'Constants/payment-types';

    export default {
        name: 'PaymentType',
        props: {
            type: { type: [Number, String] },
        },
        computed: {
            paymentType () {
                switch (Number(this.type)) {
                    case PREPAY: return 'prepay';
                    case CASH: return 'inCash';
                    case CARD: return 'byCard';
                    case SAFE: return 'safeTransaction';
                }
            },
        },
    }
</script>