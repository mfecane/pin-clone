
<template>
    <dialog class="create-dialog" ref="dialogRef" @click="onClick" @close.prevent="() => dialogStore.discardDialog()">
        <form class="container" @submit.prevent="upload">
            <div class="image">
                <UploadFile />
                <button type="submit" class="btn light create-button">Create</button>
            </div>
            <div class="collection">
                <CollectionSelector v-model="collectionId" />
            </div>
        </form>
    </dialog>
</template>
  
<script setup lang="ts">

// TODO clear url upon discard

import UploadFile from '@/components/create/UploadFile.vue'
import CollectionSelector from '@/components/create/CollectionSelector.vue'

import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useUploadDialog } from '@/hooks/useUploadDialog'
import { createPin } from '@/api/loader'
import { useCollectionsLocal } from '@/hooks/useCollectionsLocal'

const dialogStore = useUploadDialog()
const { showCreateModal, selectedCollection } = storeToRefs(dialogStore)

const { reloadCollections } = useCollectionsLocal()

const dialogRef = ref<HTMLDialogElement>()

const collectionId = ref<string | null>(null)

onMounted(() => {
    reloadCollections()
})

watch(showCreateModal, (show) => {
    if (show) {
        dialogRef.value?.showModal()
    } else {
        dialogRef.value?.close()
    }
}, { immediate: true })

function onClick(event: MouseEvent) {
    if (event.target === dialogRef?.value) {
        dialogStore.discardDialog()
    }
}

async function upload() {
    if (dialogStore.imageId && collectionId.value) {
        await createPin(dialogStore.imageId, collectionId.value)
        dialogStore.setImageId(null)
        dialogStore.closeDialog()
        reloadCollections()
    }
}

watch(selectedCollection, (id) => {
    collectionId.value = id
})

</script>
  
<style scoped lang="scss">
.create-dialog {
    background-color: var(--color-light3);
    border-radius: 6px;

    padding: 40px;

    position: fixed;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 80vw;
    min-width: 600px;
    max-width: 1000px;

    height: 80vh;
    max-height: 800px;
    box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.5);

    &::backdrop {
        background-color: rgba(0, 0, 0, 0.3);
        pointer-events: all;
    }
}

.container {
    width: 100%;
    height: 100%;
    display: flex;

    &>*:first-child {
        margin-right: 22px;
    }
}

.image {
    flex: 0 1 50%;

    align-self: stretch;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    & :deep(*:not(:last-child)) {
        margin-bottom: 6px;
        flex: 0 1 auto;
    }
}

.collection {
    flex: 0 1 50%;
}


.create-button {
    margin-top: 12px;
    width: 100%;
}

input[type=text].add {
    border: 1px solid black;
    padding: 12px;
    border-radius: 4px;
}
</style>