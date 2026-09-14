<script setup>
import painterpicture from '../assets/painterpicture.png'
</script>

<template>
  <div class="signup-container">
    <div class="signup-left-side">
      <div class="signup-card">
        <div class="signup-logo-section">
          <h2>Sign up</h2>
        </div>

        <form id="signupForm">
          <div class="signup-input-group">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" placeholder="First Name" required>
          </div>

          <div class="signup-input-group">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" placeholder="Last Name" required>
          </div>

          <div class="signup-input-group">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="someone@gmail.com" required>
          </div>

          <div class="signup-input-group">
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="*************" required>
          </div>

          <button type="submit" class="signup-button">Signup</button>
          
          <div class="signup-bottom-section">
            <p>Already have an account?</p>
            <button type="button" class="signup-button-link">login</button>
          </div>

          <p id="message"></p>
        </form>
      </div>
    </div>

    <div class="signup-right-side">
      <img :src="painterpicture" alt="Painter">
    </div>
  </div>
</template>

<style>
@import url('https://googleapis.com');

/* html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden; 
  background: white;
  color: black;
  font-family: 'Plus Jakarta Sans', sans-serif;
} */

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
