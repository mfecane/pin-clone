<template>
    <div class="colection-container" ref="container" @click.prevent="onClick">
        <div :style="style" class='image-list' ref="imageList">
            <CollectionImage v-for="image of props.collection.images" :id="image.id" :width="image.width ?? 0"
                :height="image.height ?? 0" :src="image.src" :key="image.id" />
        </div>
    </div>
</template>

<script setup lang="ts">

import CollectionImage from '@/components/collection/CollectionImage.vue'

import { StyleValue, computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { grid } from '@/hooks/grid'
import { useCollectionViewer } from '@/hooks/useCollectionViewer'
import { Navigator } from '@/viewer/Navigator'
import { storeToRefs } from 'pinia'
import { Collection } from '@/model/CollectionsModel'

const props = defineProps<{ collection: Collection }>()

const container = ref<HTMLDivElement>()

const imageList = ref<HTMLDivElement>()

const navigator = ref<Navigator | null>(null)

const collectionViewer = useCollectionViewer()
const { resetScale, orientation } = storeToRefs(collectionViewer)

const style = computed<StyleValue>(() => {
    const columns = Math.ceil(Math.sqrt(props.collection.images.length))
    return grid(columns, orientation.value)
})

function onClick(e: MouseEvent) {
    e.stopPropagation()
    collectionViewer.select()
}

watch([resetScale], () => {
    navigator.value?.scaleToFit()
})

onMounted(() => {
    navigator.value = new Navigator(container.value!, imageList.value!)
    navigator.value?.scaleToFit()
})

onBeforeUnmount(() => navigator.value?.destroy())

</script>

<style lang="scss" scoped>
.colection-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.image-list {
    display: inline-grid;
    grid-auto-rows: 40px;
    gap: 4px;
    transform-origin: 0 0;
}
</style>