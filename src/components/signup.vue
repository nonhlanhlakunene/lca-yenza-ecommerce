```vue
<script setup>
import plumberImage from '../assets/stickman plumber.png'
</script>

<template>
  <div class="login-container">
    <div class="login-left-side">
      <img :src="plumberImage" alt="Plumber">
    </div>

    <div class="right-side">
      <div class="login-card">
        <div class="logo-section">
          <h2>Login</h2>
        </div>

        <form id="loginForm">
          <div class="input-group">
            <label>Email</label>
            <input type="text" id="username" placeholder="someone@gmail.com" required>
          </div>

          <div class="input-group">
            <label>Password</label>
            <input type="password" id="password" placeholder="*************" required>
          </div>

          <button type="submit" class="login-button">Login</button>
          <div class="bottom-section">
                <p>no account?</p>
            <button class="signup-button-link">
                sign up
            </button>
          </div>

          <p id="message"></p>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

/* html,
body,
#app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: white;
  color: black;
  font-family: 'Plus Jakarta Sans', sans-serif;
} */

.login-container {
  display: flex;
  width: 100%;
  height: 100vh;
}

/* LEFT SIDE - PLUMBER */
.login-left-side {
  width: 50%;
  height: 100vh;
  width: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.login-left-side img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* RIGHT SIDE - LOGIN */
.right-side {
  width: 50%;
  width: 400px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  box-sizing: border-box;
}

.logo-section {
  text-align: center;
  margin-bottom: 35px;
}

.logo-section h2 {
  color: #136163;
  font-weight: 900;
  margin: 0 0 8px;
  font-size: 30px;
}

.logo-section p {
  color: #777;
  margin: 0;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.input-group input {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid #d8d8d8;
  border-radius: 10px;
  outline: none;
  transition: 0.3s;
  font-size: 15px;
}

.input-group input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 12px rgba(13, 110, 253, 0.18);
}

.login-button {
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

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(13, 110, 253, 0.25);
}

.bottom-section{
    text-align: center;
    margin-top: 40px;
}

.signup-button{
    font-family: 'Plus Jakarta Sans', sans-serif;
    background-color: #136163;
    cursor: pointer;
    color: gray;
    border: none;
    color: white;
    text-align: center;
}

.signup-button-link{
  font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer;
  color: #136163;
  font-weight: 600;
  border: none;
  background: none;
  text-decoration: underline;
}

/* MOBILE */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    height: auto;
  }

  .login-left-side {
    width: 100%;
    height: 40vh;
  }

  .right-side {
    width: 100%;
    height: 60vh;
  }

  .login-card {
    padding: 25px;
  }
}
</style>