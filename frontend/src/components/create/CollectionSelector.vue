<template>
    <div class="collection-container">
        <label for="collection-selector-prompt">Add to collection</label>
        <input type="text" id="collection-selector-prompt" v-model="searchPrompt" class="prompt">
        <button class="btn light create-button" v-if="canCreateCollection" @click="createCollection2">Create</button>
        <div v-if="filteredList.length" class="list">
            <div v-if="selected" :key="selected.id" class="item selected">
                {{ selected.name }}
            </div>
            <div class="filteredlist">
                <div v-for="collection in filteredList" :key="collection.id" class="item"
                    @click="() => onSelect(collection.id)">
                    {{ collection.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue'
import FuzzySearch from 'fuzzy-search';

import { Collection } from '@/model/Data';
import { useAuth } from '@/hooks/useAuth';
import { useCollectionSelector, fetch } from '@/hooks/useCollectionSelector'
import { createCollection } from '@/model/CollectionsModel'

/**
 * TODO
 * 
 * clear search button
 */

const { collections } = storeToRefs(useCollectionSelector())

const { user } = storeToRefs(useAuth())

const searchPrompt = ref('')

const collectionId = defineModel<string | null>({ default: null })

const filteredList = computed<Collection[]>(() => {
    const value: string | undefined = searchPrompt.value
    let filtered
    if (value) {
        const searcher = new FuzzySearch(collections.value, ['name'], {
            caseSensitive: false,
            sort: true,
        })
        filtered = searcher.search(value.toLocaleLowerCase())
    } else {
        filtered = collections.value
    }
    return filtered.filter(c => c.id !== collectionId.value)
})

const selected = computed<Collection | null>(() => {
    if (!collectionId.value) {
        return null
    }
    const found = collections.value.find(c => c.id === collectionId.value)
    if (!found) {
        throw 'Internal error'
    }
    return found
})

function onSelect(name: string) {
    collectionId.value = name
    searchPrompt.value = ''
}

async function createCollection2() {
    const value: string | undefined = searchPrompt.value
    if (value) {
        searchPrompt.value = ''
        const id = await createCollection(value, user.value!.id)
        fetch()
        collectionId.value = id
    }
}

function strEqual(str1: string, str2: string) {
    return str1.trim().toLowerCase() === str2.trim().toLowerCase()
}

const canCreateCollection = computed(() => {
    return searchPrompt.value && !strEqual(searchPrompt.value, selected.value?.name ?? '')
})

watch(searchPrompt, (value) => {
    if (filteredList.value.length === 1) {
        collectionId.value = filteredList.value[0].id
    } else {
        const found = filteredList.value.find(el => strEqual(value, el.name))
        if (found) {
            collectionId.value = found.id
        }
    }
})

onMounted(() => fetch())

</script>

<style scoped lang="scss">
.create-button {
    margin-top: 20px;
}

.collection-container {
    display: grid;
    grid-template-columns: 1fr;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 100%;

    & *:not(:last-child) {
        margin-bottom: 6px;
    }
}

.list {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
}

.prompt {
    border: 1px solid black;
    padding: 12px;
    border-radius: 4px;
}

.item {
    background-color: var(--color-light);
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 16px;

    &:last-of-type {
        margin-bottom: 0px;
    }

    &:hover {
        box-shadow: inset 0px 0px 0px 1px black;
    }

    &.selected {
        margin-top: 20px;
        background-color: var(--accent-color-dark);
        font-weight: 500;
        color: var(--color-light);
    }
}

.filteredlist {
    overflow-y: scroll;
    padding-right: 4px;
}
</style>