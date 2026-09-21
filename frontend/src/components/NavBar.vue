<template>
  <nav class="home-navbar">
    <ul class="navbar-links">
      <li v-for="(link, index) in navLinks" :key="index">
        <router-link v-if="link.text !== 'Logout'" :to="link.path">{{ link.text }}</router-link>
        <a v-else href="/login" @click.prevent="logout">{{ link.text }}</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const currentUser = ref(null)

const linkList = [
  { text: 'Home', path: '/' },
  { text: 'Services', path: '/services' },
  { text: 'About Us', path: '/about' },
  { text: 'Bookings', path: '/bookings' },
  { text: 'Contact', path: '/contact' }
]

const loadUser = () => {
  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  if (!storedToken || !storedUser) {
    currentUser.value = null
    return
  }

  try {
    currentUser.value = JSON.parse(storedUser)
  } catch (error) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    currentUser.value = null
  }
}

watch(
  () => route.path,
  loadUser,
  { immediate: true }
)

const navLinks = computed(() => {
  const links = [...linkList]

  if (
    currentUser.value?.role === 'professional' ||
    currentUser.value?.role === 'worker'
  ) {
    links.push({
      text: 'Dashboard',
      path: '/worker'
    })
  }

  if (currentUser.value) {
    links.push({
      text: 'Logout',
      path: '/login'
    })
  } else {
    links.push({
      text: 'Login',
      path: '/login'
    })
  }

  return links
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('authToken')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')

  currentUser.value = null

  router.push('/login')
}
</script>

<style scoped>
.home-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;

  background-color: var(--color-primary);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
}

.navbar-links {
  gap: var(--spacing-md);
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar-links a {
  color: var(--color-page);
  text-decoration: none;
  font-size: var(--font-sm);
  transition: all 0.3s ease;
}

.navbar-links a:hover {
  opacity: 0.8;
}

.navbar-links a.router-link-active {
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 5px;
}

.navbar-links li:last-child a {
  background-color: #ffffff;
  color: #136163;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  border: 2px solid #ffffff;
  transition: all 0.3s ease;
}

.navbar-links li:last-child a:hover {
  background-color: transparent;
  color: #ffffff;
  opacity: 1;
}

@media (max-width: 768px) {
  .home-navbar {
    flex-direction: column;
    justify-content: center;
  }

  .navbar-links {
    flex-direction: column;
    gap: var(--spacing-xs);
    margin: var(--spacing-xs) 0;
    text-align: center;
  }
}
</style>