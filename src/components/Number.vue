<template>
    <span>
        <span v-if="formattedVal !== null">{{ formattedVal }}</span>
        <span v-else>&mdash;</span>
    </span>
</template>

<script>
    export default {
        name: 'number',
        props: {
            val: { type: [String, Number] },
        },
        computed: {
            formattedVal () {
                return (typeof this.val !== 'undefined')
                    ? this.val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                    : null;
            },
        },
    }
</script>