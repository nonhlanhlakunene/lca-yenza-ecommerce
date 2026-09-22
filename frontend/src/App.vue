<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import GlobalLoader from './components/GlobalLoader.vue'

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

  <GlobalLoader />
</template>