<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import VerifyIdentity from '../components/VerifyIdentity.vue'

const router = useRouter()

const first_name = ref('')
const last_name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const loading = ref(false)

const showVerification = ref(false)
const newUserId = ref(1)
const newProfessionalId = ref(1)

const passwordRequirements =
  '8-16 characters, with uppercase, lowercase, number and special character'

const validatePassword = () => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/.test(password.value)
}

const workerSignup = async () => {
  message.value = ''
  loading.value = true

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
      'http://localhost:3000/api/auth/worker-signup',
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
    newProfessionalId.value = data.professional.professional_id

    message.value = 'Signup successful!'
    showVerification.value = true

  } catch (error) {
    console.error(error)
    message.value = 'Unable to connect to the server'

  } finally {
    loading.value = false
  }
}

const onVerificationComplete = () => {
  showVerification.value = false
  router.push('/workerlogin')
}
</script>

<template>
  <div class="signup-container">
    <div class="signup-card">

      <button type="button" class="back-button" @click="router.push('/')">
        ← Back to Home
      </button>

      <div class="signup-logo-section">
        <h2>Worker Signup</h2>
      </div>

      <form id="signupForm" @submit.prevent="workerSignup">

        <div class="signup-input-group">
          <label>first name</label>
          <input v-model="first_name" type="text" id="first_name" placeholder="first name" required>
        </div>

        <div class="signup-input-group">
          <label>last name</label>
          <input v-model="last_name" type="text" id="last_name" placeholder="last name" required>
        </div>

        <div class="signup-input-group">
          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" placeholder="someone@gmail.com" required>
        </div>

        <div class="signup-input-group">
          <label for="password">Password</label>
          <input v-model="password" type="password" id="password" placeholder="*************" required>
        </div>

        <div class="signup-input-group">
          <label for="confirmPassword">Confirm Password</label>
          <input v-model="confirmPassword" type="password" id="confirmPassword" placeholder="*************" required>

          <small v-if="password && !validatePassword()" class="password-help">
            {{ passwordRequirements }}
          </small>

          <small v-else-if="confirmPassword && password !== confirmPassword" class="password-help">
            Passwords do not match
          </small>
        </div>

        <button type="submit" class="signup-button" :disabled="loading">
          {{ loading ? 'Signing up...' : 'Sign up' }}
        </button>

        <div class="signup-bottom-section">
          <p>Already have a account?</p>

          <button
            type="button"
            class="signup-button-link"
            @click="router.push('/workerlogin')"
          >
            Login
          </button>
        </div>

        <p id="message">{{ message }}</p>

      </form>
    </div>

    <VerifyIdentity
      v-if="showVerification"
      :showVerification="true"
      :userType="'worker'"
      :userId="newUserId"
      :professionalId="newProfessionalId"
      @close="onVerificationComplete"
      @complete="onVerificationComplete"
    />
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

.back-button {
  border: none;
  background: none;
  color: #136163;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-bottom: 25px;
}

.back-button:hover {
  text-decoration: underline;
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

.password-help {
  display: block;
  color: crimson;
  margin-top: 6px;
  font-size: 12px;
}

#message {
  text-align: center;
  color: crimson;
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