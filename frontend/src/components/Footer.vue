<template>
  <div>
    <!-- Footer Area -->
    <footer class="footer">
      <p class="footer-tagline">Making it easier to find trusted professionals</p>
      <p class="footer-copyright">&copy; {{ currentYear }} YENZA! All rights reserved.</p>
    </footer>
  </div>
</template>


<script setup>
import { ref } from 'vue'

const currentYear = ref(2026)
</script>


<style scoped>
/* Footer Container */
.footer {
  background-color: var(--color-primary);
  text-align: center;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-page);
  font-family: var(--font-main);
}

.footer-tagline {
  font-size: var(--font-lg);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
}

.footer-copyright {
  font-size: var(--font-sm);
  font-weight: 600;
  margin: 0;
}
</style>