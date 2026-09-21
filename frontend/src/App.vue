```vue
<script setup>
import {ref} from 'vue'
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'


const route = useRoute()

const hideLayout = computed(() => {
  return [
    '/login',
    '/signup',
    '/worker',
    '/workerlogin',
    '/admin',
    '/workersignup'
  ].includes(route.path) ||
  (route.name === 'profile' && route.query.fromAdmin === 'true')
})
</script>

<template>
  <NavBar v-if="!hideLayout" />

  <RouterView />

  <Footer v-if="!hideLayout" />
    <NavBar v-if="!['/login', '/signup', '/worker', '/workerlogin', '/admin'].includes(route.path)" />
    
    <RouterView />
    
    <Footer v-if="!['/login', '/signup', '/worker', '/workerlogin', '/admin'].includes(route.path)" />
    

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
}

#app {
  width: 100%;
  min-height: 100vh;
  height: auto !important;
}
</style>
```
