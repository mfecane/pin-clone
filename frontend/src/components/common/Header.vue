<template>
	<div class='header-content' ref="header">
		<div class="container">
			<div class='header-content2'>
				<Logo auto-hide />
				<div class="header-content__search">
					<SearchBar hint="Search your collections" v-model="filter" />
				</div>
				<User />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import User from '@/components/auth/User.vue';
import Logo from '@/components/common/Logo.vue'
import SearchBar from '@/components/common/inputs/SearchBar.vue'

import { onUnmounted, ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';

import { useCollectionList } from '@/hooks/useCollectionList';

const { filter } = storeToRefs(useCollectionList())

const header = ref<HTMLDivElement>()

function scrollHander() {
	const el = header.value!
	const scroll = document.documentElement.scrollTop
	if (scroll > 10) {
		el.classList.toggle('darkbg', true)
	} else {
		el.classList.toggle('darkbg', false)
	}
}

const clearWatch = watchEffect(() => {
	window.addEventListener('scroll', scrollHander)
})

onUnmounted(() => {
	clearWatch()
	window.removeEventListener('scroll', scrollHander)
})

</script>

<style scoped lang="scss">
.header-content {
	position: sticky;
	top: 0;
	z-index: 1;

	background-color: rgba(255, 255, 255, 0);
	backdrop-filter: blur(10px);
	transition: background-color 300ms ease;

	&.darkbg {
		background-color: rgba(15, 16, 16, 0.5);
		box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.4);
	}

}

.header-content2 {
	display: flex;
	align-items: center;
	justify-content: space-between;

	width: 100%;
	padding-top: 24px;
	padding-bottom: 24px;
}

.logo-and-search {
	flex: 1 0 auto;
	display: flex;
	align-items: center;
}

.logo-and-search>*:first-child {
	margin-right: 24px;
}

.header-content__logo {
	flex: 0 0 30px;
	height: 30px;
	border-radius: 20px;
	background: var(--accent-color);
}

.header-content__search {
	flex: 1 0 300px;
	max-width: 600px;
}

.header-content__name {
	color: var(--accent-color);
	font-weight: bold;
	font-size: 16px;
}

.header-content__face {
	flex: 0 0 30px;
	width: 30px;
	height: 30px;
	border-radius: 20px;
	background: var(--accent-color);
}

.header__login {
	display: flex;
	gap: 12px;
	margin: 40px 0;
}

.user {
	flex: 1 0 auto;
	max-width: fit-content;
	display: flex;
	align-items: center;

	&>*:first-child {
		flex: 0 0 auto;
		margin-right: 12px;
	}
}
</style>