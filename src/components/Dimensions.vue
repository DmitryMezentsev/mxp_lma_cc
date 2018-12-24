<template>
    <span>{{ values.width || 0 }}{{ $t('cm') }} x {{ values.height || 0 }}{{ $t('cm') }} x {{ values.length || 0 }}{{ $t('cm') }}</span>
</template>

<script>
    export default {
        name: 'Dimensions',
        props: {
            values: { type: Object, required: true },
        },
    }
</script>