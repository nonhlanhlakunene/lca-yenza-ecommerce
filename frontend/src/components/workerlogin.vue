<script setup>
import { ref, watch, nextTick } from 'vue'
import router from '@/router'

const email = ref('')
const password = ref('')
const message = ref('')
const loading = ref(false)
const showPassword = ref(false)
const shake = ref(false)

const triggerError = () => {
  shake.value = true
  setTimeout(() => { shake.value = false }, 500)
}

watch(message, async (newValue) => {
  if (!newValue) return
  await nextTick()
  const el = document.getElementById('message')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  triggerError()
})

const workerLogin = async () => {
  message.value = ''
  loading.value = true

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/worker-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const data = await response.json()

    if (!response.ok) {
      message.value = data.message || 'Login failed'
      return
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    if (data.user.verification_status === 'verified') {
      router.push('/worker')
    } else if (data.user.verification_status === 'rejected') {
      router.push('/worker-rejected')
    } else {
      router.push('/worker-pending')
    }
  } catch (error) {
    console.error(error)
    message.value = 'Unable to connect to the server'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="signup-container">

    <div class="signup-card">

      <div class="signup-logo-section">
        <h2>Worker Login</h2>
      </div>

      <form id="signupForm" :class="{ shake: shake }" @submit.prevent="workerLogin">

        <div class="signup-input-group">
          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" placeholder="someone@gmail.com" required>
        </div>

        <div class="signup-input-group">
          <label for="password">Password</label>
          <div class="password-wrapper">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              placeholder="*************"
              required
            >
            <span
              class="password-toggle"
              :class="{ active: showPassword }"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              👁
            </span>
          </div>
        </div>

        <button type="submit" class="signup-button" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <div class="signup-bottom-section">
          <p>Don't have an account?</p>
          <button type="button" class="signup-button-link" @click="router.push('/workersignup')">
            Sign up
          </button>
        </div>

        <p id="message">{{ message }}</p>

      </form>

    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

body {
  margin: 0;
  background: white;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 20px;
}

.signup-card {
  width: 100%;
  max-width: 420px;
  box-sizing: border-box;
}

.signup-logo-section {
  text-align: center;
  margin-bottom: 35px;
}

.signup-logo-section h2 {
  color: #136163;
  font-weight: 900;
  margin: 0 0 8px;
  font-size: 30px;
}

.signup-input-group {
  margin-bottom: 20px;
}

.signup-input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.signup-input-group input {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid #d8d8d8;
  border-radius: 10px;
  outline: none;
  transition: 0.3s;
  font-size: 15px;
}

.signup-input-group input:focus {
  border-color: #136163;
  box-shadow: 0 0 12px rgba(19, 97, 99, 0.18);
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-wrapper input {
  width: 100%;
  padding-right: 45px;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  font-size: 18px;
  cursor: pointer;
  user-select: none;
  opacity: 0.35;
  transition: 0.2s;
}

.password-toggle.active {
  opacity: 1;
  color: #136163;
}

.signup-button {
  font-family: 'Plus Jakarta Sans', sans-serif;
  margin-top: 20px;
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 40px;
  background: #136163;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.signup-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(19, 97, 99, 0.25);
}

.signup-bottom-section {
  text-align: center;
  margin-top: 20px;
}

.signup-button-link {
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  color: #136163;
  font-weight: 600;
  border: none;
  background: none;
  text-decoration: underline;
}

#message {
  font-size: 14px;
  font-weight: 600;
  color: #b00020;
  text-align: center;
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #fff2f2;
  border: 1px solid #fecaca;
  min-height: 0;
}

#message:empty {
  display: none;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}

.shake {
  animation: shake 0.4s ease-in-out;
}

@media (max-width: 768px) {
  .signup-container {
    min-height: 100vh;
    padding: 20px;
  }

  .signup-card {
    max-width: 420px;
  }
}
</style>