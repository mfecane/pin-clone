<template>
    <div class='header' ref="parent">
        <div class="collection-title">
            <div class='item__name'>{{ name }}</div>
            <div class='item__count'>{{ count }} items</div>
        </div>
        <Transition>
            <IconButton :type="IconType.dots" :size="1.2" class="icon-options" @click="switchMenu" />
        </Transition>
        <Transition>
            <CollectionOptions :collectionId="props.collectionId" v-if="showMenu2" :collection="collection" />
        </Transition>
    </div>
</template>

<script setup lang="ts">

import IconButton from '../common/inputs/IconButton.vue'
import CollectionOptions from './CollectionOptions.vue';

import { onBeforeUnmount, ref, watch } from 'vue';

import { IconType } from '../common/icons/IconType'
import { CollectionWithImages } from '@/model/Data';

const props = defineProps<{ collection: CollectionWithImages, name: string, big: boolean, count: number, collectionId: string }>()

const showMenu2 = ref<boolean>(false)

const parent = ref<HTMLDivElement>()

function switchMenu() {
    showMenu2.value = !showMenu2.value
}

function outsideClickHandler(event: MouseEvent) {
    //@ts-expect-error
    if (parent.value && !parent.value.contains(event.target)) {
        if (showMenu2.value === true) {
            showMenu2.value = false
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
        }
    }
}

watch(showMenu2, (value) => {
    if (value) {
        document.addEventListener('pointerdown', outsideClickHandler)
    } else {
        document.removeEventListener('pointerdown', outsideClickHandler)
    }
})

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', outsideClickHandler)
})

</script>

<style scoped lang="scss">
.header {
    flex: 0 0 26px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
}

.header :deep(svg) {
    path {
        fill: var(--color-light3);
    }
}

.header :deep(svg) {
    path {
        fill: var(--color-light3);
    }
}

.collection-title {
    flex: 1 0 auto;
}

.item__header-data {
    display: flex;
    flex-direction: column;
}

.item__name {
    color: #000;
    font-size: 16px;
    font-weight: 500;
    color: var(--color-light);
    padding-left: 2px;
}

.item__count {
    font-size: 12px;
    font-weight: 500;
    color: var(--accent-color-alt);
    margin-bottom: 2px;
    padding-left: 2px;
}

.icon-options {
    margin-left: 6px;
    flex: 0 0 28px;
    height: 28px;
    border-radius: 999px;
    background: var(--color-darker);
    padding: 4px;
    opacity: 1;
}

.icon-options :deep(.icon path),
:deep(.icon circle) {
    fill: var(--accent-color-dim);
}

.v-enter-active,
.v-leave-active {
    transition: opacity 300ms ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
