<template>
    <LoggedIn>
        <CollectionsList v-if="user" />
    </LoggedIn>
</template>

<script setup lang="ts">

import CollectionsList from '@/components/list/CollectionsList.vue'
import LoggedIn from '@/components/pages/LoggedIn.vue'

import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import { useAuth } from '@/hooks/useAuth';

const router = useRouter()
const { user } = storeToRefs(useAuth())

watch(user, (user) => {
    if (!user) {
        router.push('/landing')
    }
}, { immediate: true })

</script>

<style lang="scss" scoped></style>
