<script setup>
import {ref} from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import VerifyIdentity from './components/VerifyIdentity.vue';
const showVerify = ref(false)

const route = useRoute()
</script>

<template>
    <NavBar v-if="!['/login', '/signup', '/worker', '/workerlogin', '/admin'].includes(route.path)" />
    
    <RouterView />
    
    <Footer v-if="!['/login', '/signup', '/worker', '/workerlogin', '/admin'].includes(route.path)" />
    
    <button
        @click="showVerify = true"
        style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 12px 20px; background: #136163; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;"
         >
   Test Verification
    </button>

    <VerifyIdentity
       v-if="showVerify"
       :showVerification="true"
       :userType="'worker'"
       @close="showVerify = false"
       @complete="showVerify = false"
     />

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
