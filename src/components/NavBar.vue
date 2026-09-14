<template>
  <nav class="home-navbar">
    <ul class="navbar-links">
      <li v-for="(link, index) in navLinks" v-bind:key="index">
        <router-link v-bind:to="link.path">{{ link.text }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const linkList = [
  { text: 'Home', path: '/' },
  { text: 'Services', path: '/services' },
  { text: 'About Us', path: '/about' },
  { text: 'Bookings', path: '/bookings' },
  { text: 'Contact', path: '/contact' }
]

const navLinks = ref(linkList)

</script>


<style scoped>
.home-navbar {
  background-color: var(--color-primary);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: var(--font-main);
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
  transition: opacity 0.3s ease;
}

.navbar-links a:hover {
  opacity: 0.8;
}

.navbar-links a.router-link-active {
    font-weight: 700;
    text-decoration: underline;
}

/* Mobile Layout Adjustment */
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