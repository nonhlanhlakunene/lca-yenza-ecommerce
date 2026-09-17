<template>
    <div class="dashboard">
      <aside class="sidebar">
        <div class="back" @click="">← <span>Back</span></div>
        <!-- <div class="profile"></div> -->
        <nav>
          <!-- <a href="#">▢ <span>Messages</span></a>
          <a href="#" @click.prevent="logout">↪ <span>Log out</span></a> -->
        </nav>
      </aside>
  
      <main class="main">
        <div class="stats">
          <div class="card">
            <h2>Earnings:</h2>
            <p>0.00</p>
          </div>
          <div class="card">
            <h2>Jobs Completed:</h2>
            <p>0</p>
          </div>
        </div>
  
        <hr>
  
        <h3>Progress Bar</h3><br>
        <div class="progress">
          <div class="progress-fill"></div>
        </div>
  
        <h3 class="more">More Jobs</h3><br>
  
        <div v-for="job in jobs" :key="job.id" class="job">
          <div class="job-top">
            <span><b>{{ job.name }}</b> · {{ job.location }} · {{ job.price }}</span>
            <div>
              <button @click="acceptJob(job)">accept</button>
              <button @click="declineJob(job)">Decline</button>
            </div>
          </div>
          <small>Description</small>
          <p>{{ job.description }}</p>
        </div>
      </main>
  
      <aside class="bookings">
        <h1>Bookings</h1>
        <div v-for="booking in bookings" :key="booking.id" class="booking">
          <div>
            <b>{{ booking.name }}</b>
            <small>{{ booking.time }}</small>
          </div>
          <button @click="viewBooking(booking)">view</button>
        </div>
      </aside>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const jobs = ref([
    { id: 1, name: 'Jamie', location: 'Highlands drive', price: 'R200,00', description: 'I need my help my faucet is leaking, urgent help needed!' },
    { id: 2, name: 'Jamie', location: 'Highlands drive', price: 'R200,00', description: 'I need my help my faucet is leaking, urgent help needed!' }
  ])
  
  const bookings = ref([
    { id: 1, name: 'Maddison', time: '10:30am' }
  ])
  
  function goBack() {
    window.history.back()
  }
  
  function logout() {
    console.log('Logout')
  }
  
  function acceptJob(job) {
    console.log('Accepted:', job)
  }
  
  function declineJob(job) {
    console.log('Declined:', job)
  }
  
  function viewBooking(booking) {
    console.log('Booking:', booking)
  }
  </script>
  
  <style scoped>
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
  }
  
  .dashboard {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 180px 1fr 265px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  
  .sidebar {
    background: #136163;
    color: white;
    padding: 20px;
  }
  
  .back {
    font-size: 17px;
    cursor: pointer;
    margin-bottom: 50px;
  }
  
  .back span {
    margin-left: 8px;
  }
  
  .profile {
    width: 82px;
    height: 82px;
    background: #ddd;
    border-radius: 50%;
    margin: 0 auto 55px;
  }
  
  nav {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  nav a {
    color: white;
    text-decoration: none;
    font-size: 16px;
  }
  
  nav span {
    margin-left: 8px;
  }
  
  .main {
    padding: 44px 20px;
  }
  
  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }
  
  .card {
    background: #146d70;
    color: white;
    border-radius: 14px;
    padding: 14px 22px;
    height: 116px;
  }
  
  .card h2 {
    margin: 0;
    font-size: 25px;
  }
  
  .card p {
    font-size: 24px;
    margin-top: 15px;
  }
  
  hr {
    margin: 44px 8px 34px;
    border: 0;
    border-top: 1px solid #222;
  }
  
  h3 {
    font-size: 17px;
    font-weight: 400;
  }
  
  .progress {
    width: 70%;
    height: 42px;
    background: #e4e6ea;
    border-radius: 25px;
    overflow: hidden;
  }
  
  .progress-fill {
    width: 50%;
    height: 100%;
    background: #146d70;
    border-radius: 25px;
  }
  
  .more {
    margin-top: 18px;
  }
  
  .job {
    background: #f0f4f8;
    border-radius: 11px;
    padding: 15px;
    margin-bottom: 12px;
  }
  
  .job-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }
  
  .job button,
  .booking button {
    border: 0;
    background: #146d70;
    color: white;
    border-radius: 4px;
    padding: 4px 7px;
    font-size: 8px;
    cursor: pointer;
    margin-left: 8px;
  }
  
  .job small {
    display: block;
    margin-top: 10px;
  }
  
  .job p {
    font-size: 8px;
    margin-bottom: 0;
  }
  
  .bookings {
    border-left: 1px solid #222;
    margin: 44px 20px 25px 0;
    padding-left: 16px;
  }
  
  .bookings h1 {
    color: #146d70;
    font-size: 31px;
    font-weight: 500;
    margin: 0 0 48px;
  }
  
  .booking {
    background: #f0f4f8;
    border-radius: 15px;
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .booking div {
    display: flex;
    flex-direction: column;
  }
  
  .booking b {
    font-size: 9px;
  }
  
  .booking small {
    font-size: 8px;
  }
  
  .booking button {
    border-radius: 10px;
    padding: 5px 13px;
  }
  
  @media (max-width: 900px) {
    .dashboard {
      grid-template-columns: 150px 1fr;
    }
  
    .bookings {
      display: none;
    }
  }
  
  @media (max-width: 600px) {
    .dashboard {
      display: block;
    }
  
    .stats {
      grid-template-columns: 1fr;
    }
  
    .job-top {
      display: block;
    }
  
    .progress {
      width: 100%;
    }
  }
  </style>
  