<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import painterpicture from '../assets/painterpicture.png'
import VerifyIdentity from './VerifyIdentity.vue'

const router = useRouter()

const first_name = ref('')
const last_name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const shake = ref(false)

const passwordRequirements =
  '8-16 characters, with uppercase, lowercase, number and special character'

const validatePassword = () => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/.test(password.value)
}

const showVerification = ref(false)
const newUserId = ref(1)

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

const signup = async () => {
  loading.value = true
  message.value = ''

  if (!validatePassword()) {
    message.value = passwordRequirements
    loading.value = false
    return
  }

  if (password.value !== confirmPassword.value) {
    message.value = 'Passwords do not match'
    loading.value = false
    return
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: first_name.value,
          last_name: last_name.value,
          email: email.value,
          password: password.value,
          confirmPassword: confirmPassword.value
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      message.value = data.message || 'Signup failed'
      return
    }

    newUserId.value = data.user.user_id

    message.value = 'Signup successful!'

    showVerification.value = true

  } catch (error) {
    console.error('Signup error:', error)

    message.value =
      'Could not connect to the server'

  } finally {
    loading.value = false
  }
}

const onVerificationComplete = () => {
  showVerification.value = false
  router.push('/login')
}

const goToLogin = () => {
  router.push('/login')
}

const continueWithoutAccount = () => {
  router.push('/')
}
</script>

<template>
  <div class="signup-container">
    <div class="signup-left-side">
      <div class="signup-card">
        <div class="signup-logo-section"><h2>Sign up</h2></div>

        <form id="signupForm" :class="{ shake: shake }" @submit.prevent="signup">

          <div class="signup-input-group">
            <label for="firstName">First Name</label>
              <input type="text" id="firstName" v-model="first_name" placeholder="First Name" autocomplete="given-name" required>
          </div>

          <div class="signup-input-group">
            <label for="lastName">Last Name</label>
              <input type="text" id="lastName" v-model="last_name" placeholder="Last Name" autocomplete="family-name" required>
          </div>

          <div class="signup-input-group">
            <label for="email">Email</label>
              <input type="email" id="email" v-model="email" placeholder="someone@gmail.com" autocomplete="email" required>
          </div>

          <div class="signup-input-group">
            <label for="password">Password</label>
            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                placeholder="*************"
                autocomplete="new-password"
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

          <div class="signup-input-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-wrapper">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="confirmPassword"
                placeholder="*************"
                autocomplete="new-password"
                required
              >
              <span
                class="password-toggle"
                :class="{ active: showConfirmPassword }"
                @click="showConfirmPassword = !showConfirmPassword"
                :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
              >
                👁
              </span>
            </div>

            <small v-if="password && !validatePassword()" class="password-help">
              {{ passwordRequirements }}
            </small>

            <small v-else-if="confirmPassword && password !== confirmPassword" class="password-help">
              Passwords do not match
            </small>
          </div>

          <button type="submit" class="signup-button" :disabled="loading">
            {{ loading ? 'Signing up...' : 'Signup' }}
          </button>

          <div class="signup-bottom-section">
            <p>Already have an account?</p>
            <button type="button" class="signup-button-link" @click="goToLogin">
              login
            </button>

            <button
              type="button"
              class="guest-button"
              @click="continueWithoutAccount"
            >
              Use without an account
            </button>
          </div>

          <p id="message">{{ message }}</p>

        </form>
      </div>
    </div>

    <div class="signup-right-side">
      <img :src="painterpicture" alt="Painter">
    </div>

    <VerifyIdentity
      v-if="showVerification"
      :showVerification="true"
      :userType="'customer'"
      :userId="newUserId"
      @close="onVerificationComplete"
      @complete="onVerificationComplete"
    />
  </div>
</template>

<style scoped>
@import url('https://googleapis.com');

body {
  background: white;
}

.signup-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.signup-left-side {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.signup-right-side {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.signup-right-side img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.signup-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.guest-button {
  display: block;
  margin: 14px auto 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  color: #136163;
  font-weight: 600;
  border: none;
  background: none;
  text-decoration: underline;
}

.guest-button:hover {
  opacity: 0.8;
}

.password-help {
  display: block;
  color: crimson;
  margin-top: 6px;
  font-size: 13px;
  font-weight: 500;
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
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
  }

  .signup-right-side {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    background-color: #ffffff;
  }

  .signup-right-side img {
    max-height: 100%;
    width: auto;
    object-fit: contain;
  }

  .signup-left-side {
    width: 100%;
    height: auto;
    padding: 20px 20px 60px 20px;
    display: block;
  }

  .signup-card {
    margin: 0 auto;
  }
}
</style>