<template>
    <router-link to="/">
        <div class="logo" :class="{ [props.size]: true, 'hide': props.autoHide }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81.3 85.88">
                <path
                    d="M40,22.94c-10.22.34-18.18,9.07-18.18,19.3v28.56c0,3.28,2.66,5.95,5.95,5.95h25.75c3.28,0,5.95-2.66,5.95-5.95v-29.05c0-10.61-8.78-19.17-19.47-18.81Z" />
                <path
                    d="M43.16.08c-11.34-.68-22.13,3.21-30.37,10.97C4.66,18.7,0,29.49,0,40.65v39.23c0,3.31,2.69,6,6,6s6-2.69,6-6v-39.23c0-7.98,3.2-15.39,9.02-20.86,5.81-5.47,13.42-8.22,21.42-7.73,14.56.88,26.86,14.26,26.86,29.22v38.6c0,3.31,2.69,6,6,6s6-2.69,6-6v-38.6C81.3,19.83,64.19,1.35,43.16.08Z" />
            </svg>
            <span>SHADOWCRYPT</span>
        </div>
    </router-link>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{ size?: 'small' | 'medium' | 'large', autoHide?: boolean }>(), { size: 'medium', autoHide: false })

</script>

<style scoped lang="scss">
.logo {
    display: flex;
}

.logo span {
    margin-left: 4px;
    letter-spacing: 0px;
    font-size: 28px;
    font-weight: bold;
    transform: translateY(-2px);
}

.logo.hide span {
    @media (max-width: 1000px) {
        display: none;
    }
}


.logo svg {
    width: 32px;
    height: 32px;
}

.logo svg path {
    fill: var(--accent-color);
}

a:hover .logo svg path {
    fill: var(--color-light);
}

.small {
    svg {
        width: 24px;
        height: 24px;
    }

    span {
        margin-left: 1px;
        letter-spacing: 0px;
        font-size: 18px;
        transform: translateY(0px);
    }
}
</style>