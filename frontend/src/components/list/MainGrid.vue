<template>
	<div class="main-grid">
		<CollectionThumbnail v-for="(collection, index) in props.collections" :collection="collection" :key="index"
			:index="index" />
	</div>
</template>

<script lang="ts" setup>
import CollectionThumbnail from '@/components/list/CollectionThumbnail.vue'
import { CollectionWithImages } from '../../model/Data';

const props = defineProps<{ collections: CollectionWithImages[] }>()
</script>

<style scoped lang="scss">
.main-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	grid-auto-rows: 220px;
	gap: 24px;
	margin-bottom: 100px;
}
</style>../../model/Data