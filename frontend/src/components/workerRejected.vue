<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/workerlogin')
}
</script>

<template>
  <div class="rejected-container">
    <div class="rejected-card">
      <div class="icon">⚠️</div>

      <h1>Application Not Approved</h1>

      <p>
        Unfortunately, your verification application
        was not approved at this time.
      </p>

      <p>
        This may be due to incomplete or unclear
        documents. Please contact support if you
        believe this was a mistake.
      </p>

      <button class="logout-button" @click="logout">
        Log Out
      </button>
    </div>
  </div>
</template>

<style scoped>
.rejected-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f5f8f8;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.rejected-card {
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

.rejected-card h1 {
  margin: 0 0 20px;
  color: #b00020;
  font-size: 26px;
}

.rejected-card p {
  margin: 0 0 16px;
  color: #555;
  font-size: 14px;
  line-height: 1.6;
}

.logout-button {
  margin-top: 30px;
  padding: 12px 32px;
  border: none;
  border-radius: 40px;
  background: #136163;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.logout-button:hover {
  background: #0d4f51;
}
</style>