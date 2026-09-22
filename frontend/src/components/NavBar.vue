<template>
  <nav class="home-navbar">
    <!-- Hamburger button (mobile only) -->
    <button
      class="hamburger"
      type="button"
      @click="menuOpen = !menuOpen"
      :aria-expanded="menuOpen"
      aria-label="Toggle navigation"
    >
      <span :class="{ open: menuOpen }"></span>
      <span :class="{ open: menuOpen }"></span>
      <span :class="{ open: menuOpen }"></span>
    </button>

    <!-- Navigation links -->
    <!-- <ul class="navbar-links" :class="{ open: menuOpen }"> -->
    <!-- Hamburger button (mobile only) -->
    <button
      class="hamburger"
      type="button"
      @click="menuOpen = !menuOpen"
      :aria-expanded="menuOpen"
      aria-label="Toggle navigation"
    >
      <span :class="{ open: menuOpen }"></span>
      <span :class="{ open: menuOpen }"></span>
      <span :class="{ open: menuOpen }"></span>
    </button>

    <!-- Navigation links -->
    <ul class="navbar-links" :class="{ open: menuOpen }">
      <li v-for="(link, index) in navLinks" :key="index">
        <router-link
          v-if="link.text !== 'Logout'"
          :to="link.path"
          @click="closeMenu"
        >
          {{ link.text }}
        </router-link>
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
const menuOpen = ref(false)

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
  () => {
    loadUser()
    menuOpen.value = false
  },
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

    links.push({
      text: 'Sign Up',
      path: '/signup'
    })
  }

  return links
})

const closeMenu = () => {
  menuOpen.value = false
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('authToken')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')

  currentUser.value = null
  menuOpen.value = false

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
  box-sizing: border-box;
}

/* ---------- DESKTOP LINKS ---------- */
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
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
  }

  .hamburger {
    display: flex;
  }

  .navbar-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    margin: 0;
    padding: 0;
    background-color: var(--color-primary);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .navbar-links.open {
    max-height: 500px;
  }

  .navbar-links li {
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }

  .navbar-links li:first-child {
    border-top: none;
  }

  .navbar-links a {
    display: block;
    padding: 16px 20px;
    text-align: left;
    width: 100%;
    box-sizing: border-box;
  }

  .navbar-links a.router-link-active {
    text-decoration: none;
    background-color: rgba(255, 255, 255, 0.1);
  }

  /* Override the "Login button" style on mobile so it fills the row */
  .navbar-links li:last-child a {
    background-color: transparent;
    color: #ffffff;
    border: none;
    border-radius: 0;
    padding: 16px 20px;
    font-weight: 600;
  }

  .navbar-links li:last-child a:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
}
</style>