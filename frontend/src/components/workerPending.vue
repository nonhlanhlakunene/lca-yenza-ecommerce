<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const checking = ref(false)
const message = ref('')

let pollTimer = null

const checkStatus = async () => {
  checking.value = true
  message.value = ''

  try {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/workerlogin')
      return
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/verification-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {
      message.value = data.message || 'Could not check status'
      return
    }

    if (data.verification_status === 'verified') {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      storedUser.verification_status = 'verified'
      localStorage.setItem('user', JSON.stringify(storedUser))

      router.push('/worker')
      return
    }

    if (data.verification_status === 'rejected') {
      router.push('/worker-rejected')
      return
    }

    message.value = 'Still under review. Please check again later.'

  } catch (error) {
    console.error('Status check error:', error)
    message.value = 'Unable to check status. Please try again.'
  } finally {
    checking.value = false
  }
}

const logout = () => {
  clearInterval(pollTimer)
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/workerlogin')
}

onMounted(() => {
  checkStatus()
  pollTimer = setInterval(checkStatus, 15000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<template>
  <div class="pending-container">
    <div class="pending-card">
      <div class="icon">⏳</div>

      <h1>Application Under Review</h1>

      <p>
        Thank you for completing your verification.
        Our team is currently reviewing your documents.
      </p>

      <p>
        You will be automatically redirected once your
        application has been approved.
      </p>

      <p class="small">
        This page checks for updates every 15 seconds.
      </p>

      <p v-if="message" class="status-message">{{ message }}</p>

      <div class="button-row">
        <button
          class="refresh-button"
          :disabled="checking"
          @click="checkStatus"
        >
          {{ checking ? 'Checking...' : 'Check Now' }}
        </button>

        <button class="logout-button" @click="logout">
          Log Out
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pending-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f5f8f8;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.pending-card {
  max-width: 500px;
  width: 100%;
  padding: 50px 40px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.pending-card h1 {
  margin: 0 0 20px;
  color: #136163;
  font-size: 26px;
}

.pending-card p {
  margin: 0 0 16px;
  color: #555;
  font-size: 14px;
  line-height: 1.6;
}

.pending-card .small {
  font-size: 12px;
  color: #888;
  margin-top: 24px;
}

.status-message {
  margin-top: 20px !important;
  padding: 10px 16px;
  border-radius: 8px;
  background: #fff3e0;
  color: #b26a00 !important;
  font-size: 13px !important;
}

.button-row {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.refresh-button,
.logout-button {
  flex: 1;
  padding: 12px;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.refresh-button {
  border: none;
  background: #136163;
  color: white;
}

.refresh-button:hover:not(:disabled) {
  background: #0d4f51;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.logout-button {
  border: 2px solid #136163;
  background: white;
  color: #136163;
}

.logout-button:hover {
  background: #136163;
  color: white;
}
</style>