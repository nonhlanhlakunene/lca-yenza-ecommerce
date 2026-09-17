
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

</script>

<template>
  <div class="signup-container">

    <div class="signup-card">

      <div class="signup-logo-section">
        <h2>Worker Signup</h2>
      </div>

      <form id="signupForm">
        <div class="signup-input-group">
          <label>first name</label>
          <input type="text" id="email" placeholder="first name" required>
        </div>

        <div class="signup-input-group">
          <label>last name</label>
          <input type="text" id="email" placeholder="last name" required>
        </div>

        <div class="signup-input-group">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="someone@gmail.com" required>
        </div>

        <div class="signup-input-group">
          <label for="password">Password</label>
          <input type="password" id="password" placeholder="*************" required>
        </div>

        <button type="submit" class="signup-button">
          Login
        </button>

        <div class="signup-bottom-section">
          <p>Already have a account?</p>
          <button type="button" class="signup-button-link" @click="router.push('/workerlogin')">
            Login
          </button>
        </div>

        <p id="message"></p>

      </form>

    </div>

  </div>
</template>

<style>
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
  text-align: center;
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