<script setup>
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
</script>

<template>
    <NavBar v-if="!['/login', '/signup', '/worker', '/workerlogin', '/admin', '/workersignup'].includes(route.path)" />

    <RouterView />

    <Footer v-if="!['/login', '/signup', '/worker', '/workerlogin', '/admin', '/workersignup'].includes(route.path)" />
</template>



<style>
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
    height: auto !important;
    /* overflow-x: hidden !important;
    overflow-y: auto !important; */
}

#app {
    width: 100%;
    min-height: 100vh;
    height: auto !important;
    /* overflow: visible !important; */
}
</style>
