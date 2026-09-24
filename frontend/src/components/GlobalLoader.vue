<template>
  <div v-if="isLoading" class="global-loader-overlay">
    <div class="global-loader-box">
      <div class="global-spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { isLoading } from '@/api/loadingState'
</script>

<style scoped>
.global-loader-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: all;
}

.global-loader-box {
  background: white;
  padding: 24px 32px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}

.global-loader-box p {
  margin: 0;
  color: #136163;
  font-weight: 600;
  font-size: 14px;
}

.global-spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #e5e7eb;
  border-top-color: #136163;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>