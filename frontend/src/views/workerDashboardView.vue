<template>
  <div class="dashboard">

    <!-- SIDEBAR -->
    <aside class="sidebar">

      <div class="back" @click="goBack">
        ← <span>Back</span>
      </div>

      <div class="worker-info">
        <div class="profile-circle">
          {{ workerInitials }}
        </div>

        <h3>
          {{ professional.first_name }}
          {{ professional.last_name }}
        </h3>

        <p>{{ professional.service_name }}</p>

        <RouterLink class="worker-settings-link" :to="{ name: 'worker-settings' }">
          ⚙ Settings
        </RouterLink>
      </div>

    </aside>


    <!-- MAIN -->
    <main class="main">

      <div v-if="loading" class="loading">
        Loading dashboard...
      </div>


      <div v-if="errorMessage" class="error">
        {{ errorMessage }}
      </div>


      <template v-if="!loading">

        <!-- STATS -->
        <div class="stats">

          <div class="card">
            <h2>Earnings</h2>

            <p>
              R{{ formatMoney(statistics.total_earnings) }}
            </p>

            <small>
              Total money earned
            </small>
          </div>


          <div class="card">
            <h2>Jobs Completed</h2>

            <p>
              {{ statistics.completed_jobs }}
            </p>

            <small>
              Completed jobs
            </small>
          </div>

        </div>


        <hr>


        <!-- PROGRESS -->
        <div class="progress-header">

          <div>
            <h3>Progress</h3>

            <p>
              {{ statistics.completed_jobs }}
              of
              {{ statistics.total_jobs }}
              jobs completed
            </p>
          </div>

          <strong>
            {{ statistics.completion_progress }}%
          </strong>

        </div>


        <div class="progress">

          <div
            class="progress-fill"
            :style="{
              width: statistics.completion_progress + '%'
            }"
          >
          </div>

        </div>


        <div class="earnings-progress">

          <span>
            Earnings:
            <b>
              R{{ formatMoney(statistics.total_earnings) }}
            </b>
          </span>

          <span>
            Confirmed:
            <b>
              {{ statistics.confirmed_jobs }}
            </b>
          </span>

        </div>


        <!-- MORE JOBS -->
        <h3 class="section-title">
          More Jobs
        </h3>

        <br>


        <div
          v-if="jobs.length === 0"
          class="empty"
        >
          No new jobs available.
        </div>


        <div
          v-for="job in jobs"
          :key="job.booking_id"
          class="job"
        >

          <div class="job-top">

            <div>
              <span>
                <b>
                  {{ job.first_name }}
                  {{ job.last_name }}
                </b>

                ·

                {{ job.city }}

                ·

                R{{ formatMoney(professional.hourly_rate) }}/hr
              </span>
            </div>


            <div class="buttons">

              <button
                class="accept-button"
                @click="acceptJob(job)"
                :disabled="processingId === job.booking_id"
              >
                {{
                  processingId === job.booking_id
                    ? 'Accepting...'
                    : 'Accept'
                }}
              </button>


              <button
                class="decline-button"
                @click="declineJob(job)"
                :disabled="processingId === job.booking_id"
              >
                {{
                  processingId === job.booking_id
                    ? 'Processing...'
                    : 'Decline'
                }}
              </button>

            </div>

          </div>


          <small>
            {{ job.service_name }}
          </small>


          <p>
            {{ job.notes || 'No description provided.' }}
          </p>


          <div class="job-details">

            <span>
              📅 {{ formatDate(job.booking_date) }}
            </span>

            <span>
              🕐 {{ formatTime(job.booking_time) }}
            </span>

            <span>
              📍 {{ job.service_address }}
            </span>

          </div>

        </div>

      </template>

    </main>


    <!-- BOOKINGS -->
    <aside class="bookings">

      <h1>
        Bookings
      </h1>


      <div
        v-if="bookings.length === 0"
        class="empty"
      >
        No accepted bookings yet.
      </div>


      <div
        v-for="booking in bookings"
        :key="booking.booking_id"
        class="booking"
      >

        <div>

          <b>
            {{ booking.first_name }}
            {{ booking.last_name }}
          </b>

          <small>
            {{ booking.service_name }}
          </small>

          <small>
            {{ formatDate(booking.booking_date) }}
            ·
            {{ formatTime(booking.booking_time) }}
          </small>

          <small>
            {{ booking.service_address }}
          </small>

        </div>


        <button @click="viewBooking(booking)">
          View
        </button>

      </div>

    </aside>

  </div>
</template>


<script setup>

import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Swal from 'sweetalert2'


const jobs = ref([])

const bookings = ref([])

const loading = ref(true)

const errorMessage = ref('')

const processingId = ref(null)


const professional = ref({
  first_name: '',
  last_name: '',
  service_name: '',
  hourly_rate: 0
})


const statistics = ref({
  total_jobs: 0,
  pending_jobs: 0,
  confirmed_jobs: 0,
  completed_jobs: 0,
  cancelled_jobs: 0,
  total_earnings: 0,
  completion_progress: 0
})


const workerInitials = computed(() => {

  const first =
    professional.value.first_name?.charAt(0) || ''

  const last =
    professional.value.last_name?.charAt(0) || ''

  return first + last
})


/*
    Get token from localStorage
*/
function getToken() {

  return (
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken')
  )
}


/*
    Load dashboard
*/
async function loadDashboard() {

  try {

    loading.value = true

    errorMessage.value = ''


    const token = getToken()


    if (!token) {

      errorMessage.value =
        'You are not logged in.'

      await Swal.fire({
        icon: 'warning',
        title: 'Not logged in',
        text: 'Please log in before accessing the worker dashboard.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#136163'
      })

      return
    }


    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/professionals/dashboard`,
      {
        method: 'GET',

        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )


    const data = await response.json()


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Could not load dashboard'
      )
    }


    professional.value =
      data.professional


    statistics.value =
      data.statistics


    jobs.value =
      data.pending_jobs || []


    bookings.value =
      data.confirmed_bookings || []


  } catch (error) {

    console.error(
      'Dashboard error:',
      error
    )

    errorMessage.value =
      error.message

    await Swal.fire({
      icon: 'error',
      title: 'Dashboard Error',
      text: error.message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#136163'
    })

  } finally {

    loading.value = false
  }
}


/*
    Accept job
*/
async function acceptJob(job) {

  try {

    processingId.value =
      job.booking_id


    const token = getToken()


    if (!token) {

      throw new Error(
        'You are not logged in.'
      )
    }


    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/professionals/bookings/${job.booking_id}/accept`,
      {
        method: 'PATCH',

        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )


    const data =
      await response.json()


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Could not accept booking'
      )
    }


    /*
        Remove the job from More Jobs
    */
    jobs.value =
      jobs.value.filter(
        item =>
          item.booking_id !== job.booking_id
      )


    /*
        Add it to Bookings
    */
    if (data.booking) {

      bookings.value.push(
        data.booking
      )

    }


    /*
        Update counts
    */
    statistics.value.pending_jobs =
      Math.max(
        0,
        statistics.value.pending_jobs - 1
      )


    statistics.value.confirmed_jobs += 1


    /*
        Success message
    */
    await Swal.fire({
      icon: 'success',
      title: 'Job Accepted',
      text: 'The booking has been added to your bookings.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#136163'
    })


  } catch (error) {

    console.error(
      'Accept error:',
      error
    )


    await Swal.fire({
      icon: 'error',
      title: 'Could Not Accept Job',
      text: error.message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#136163'
    })


  } finally {

    processingId.value = null

  }
}


/*
    Decline job
*/
async function declineJob(job) {

  const result = await Swal.fire({
    title: 'Decline this job?',
    text: 'Are you sure you want to decline this booking?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, decline',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#b94a48',
    cancelButtonColor: '#136163',
    reverseButtons: true,
    focusCancel: true
  })


  if (!result.isConfirmed) {
    return
  }


  try {

    processingId.value =
      job.booking_id


    const token = getToken()


    if (!token) {

      throw new Error(
        'You are not logged in.'
      )
    }


    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/professionals/bookings/${job.booking_id}/decline`,
      {
        method: 'PATCH',

        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )


    const data =
      await response.json()


    if (!response.ok) {

      throw new Error(
        data.message ||
        'Could not decline booking'
      )
    }


    /*
        Remove it from More Jobs
    */
    jobs.value =
      jobs.value.filter(
        item =>
          item.booking_id !== job.booking_id
      )


    statistics.value.pending_jobs =
      Math.max(
        0,
        statistics.value.pending_jobs - 1
      )


    statistics.value.cancelled_jobs += 1


    /*
        Success message
    */
    await Swal.fire({
      icon: 'success',
      title: 'Job Declined',
      text: 'The booking has been declined.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#136163'
    })


  } catch (error) {

    console.error(
      'Decline error:',
      error
    )


    await Swal.fire({
      icon: 'error',
      title: 'Could Not Decline Job',
      text: error.message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#136163'
    })


  } finally {

    processingId.value = null

  }
}


/*
    View booking
*/
async function viewBooking(booking) {

  await Swal.fire({

    title: 'Booking Details',

    html: `
      <div style="text-align: left; line-height: 1.8; font-size: 14px;">

        <p>
          <strong>Customer:</strong>
          ${booking.first_name || ''} ${booking.last_name || ''}
        </p>

        <p>
          <strong>Service:</strong>
          ${booking.service_name || 'Not provided'}
        </p>

        <p>
          <strong>Date:</strong>
          ${formatDate(booking.booking_date)}
        </p>

        <p>
          <strong>Time:</strong>
          ${formatTime(booking.booking_time)}
        </p>

        <p>
          <strong>Address:</strong>
          ${booking.service_address || 'Not provided'}
        </p>

      </div>
    `,

    icon: 'info',

    confirmButtonText: 'Close',

    confirmButtonColor: '#136163',

    background: '#ffffff',

    color: '#222222'

  })

}


/*
    Format money
*/
function formatMoney(amount) {

  return Number(amount || 0)
    .toFixed(2)

}


/*
    Format date
*/
function formatDate(date) {

  if (!date) {
    return ''
  }

  return new Date(date)
    .toLocaleDateString(
      'en-ZA',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )

}


/*
    Format time
*/
function formatTime(time) {

  if (!time) {
    return ''
  }

  return String(time).substring(0, 5)

}


/*
    Go back
*/
function goBack() {

  window.history.back()

}


onMounted(() => {

  loadDashboard()

})

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

  grid-template-columns:
    180px
    1fr
    300px;

  font-family:
    'Plus Jakarta Sans',
    sans-serif;
}


/* SIDEBAR */

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


.worker-info {
  text-align: center;
}


.profile-circle {
  width: 75px;
  height: 75px;

  border-radius: 50%;

  background: white;

  color: #136163;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 24px;

  font-weight: bold;

  margin: 0 auto 15px;
}


.worker-info h3 {
  font-size: 14px;

  margin: 0 0 5px;
}


.worker-info p {
  font-size: 11px;

  margin: 0;

  opacity: .8;
}

.worker-settings-link {
  display: inline-block;
  margin-top: 15px;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 6px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.worker-settings-link:hover {
  background: #ffffff;
  color: #136163;
}


/* MAIN */

.main {
  padding: 44px 30px;

  min-width: 0;
}


.stats {

  display: grid;

  grid-template-columns:
    1fr
    1fr;

  gap: 28px;
}


.card {

  background: #146d70;

  color: white;

  border-radius: 14px;

  padding: 20px 24px;

  min-height: 140px;
}


.card h2 {

  margin: 0;

  font-size: 21px;
}


.card p {

  font-size: 28px;

  font-weight: bold;

  margin: 18px 0 5px;
}


.card small {

  opacity: .8;

  font-size: 11px;
}


hr {

  margin:
    44px
    8px
    34px;

  border: 0;

  border-top:
    1px solid #ddd;
}


/* PROGRESS */

.progress-header {

  display: flex;

  justify-content:
    space-between;

  align-items:
    flex-end;

  margin-bottom: 12px;
}


.progress-header h3 {

  margin: 0;

  font-size: 18px;
}


.progress-header p {

  margin: 5px 0 0;

  color: #777;

  font-size: 12px;
}


.progress-header strong {

  color: #146d70;

  font-size: 20px;
}


.progress {

  width: 100%;

  height: 42px;

  background: #e4e6ea;

  border-radius: 25px;

  overflow: hidden;
}


.progress-fill {

  height: 100%;

  background: #146d70;

  border-radius: 25px;

  transition:
    width .4s ease;
}


.earnings-progress {

  display: flex;

  justify-content:
    space-between;

  margin-top: 12px;

  color: #777;

  font-size: 12px;
}


.earnings-progress b {

  color: #146d70;
}


/* SECTION */

.section-title {

  margin-top: 32px;

  font-size: 18px;

  font-weight: 500;
}


/* JOB */

.job {

  background: #f0f4f8;

  border-radius: 11px;

  padding: 18px;

  margin-bottom: 14px;
}


.job-top {

  display: flex;

  justify-content:
    space-between;

  align-items:
    center;

  gap: 15px;

  font-size: 13px;
}


.job small {

  display: block;

  margin-top: 12px;

  color: #136163;

  font-weight: bold;
}


.job p {

  font-size: 12px;

  margin: 8px 0;
}


.job-details {

  display: flex;

  flex-wrap: wrap;

  gap: 15px;

  margin-top: 12px;

  color: #666;

  font-size: 10px;
}


.buttons {

  display: flex;

  gap: 6px;
}


.job button,
.booking button {

  border: 0;

  color: white;

  border-radius: 5px;

  padding: 7px 12px;

  font-size: 10px;

  cursor: pointer;
}


.accept-button {

  background: #146d70;
}


.decline-button {

  background: #b94a48;
}


.job button:disabled {

  opacity: .5;

  cursor: not-allowed;
}


/* BOOKINGS */

.bookings {

  border-left:
    1px solid #ddd;

  margin:
    44px
    20px
    25px
    0;

  padding-left: 20px;
}


.bookings h1 {

  color: #146d70;

  font-size: 31px;

  font-weight: 500;

  margin:
    0
    0
    30px;
}


.booking {

  background: #f0f4f8;

  border-radius: 15px;

  padding: 14px;

  margin-bottom: 12px;

  display: flex;

  justify-content:
    space-between;

  align-items:
    center;

  gap: 10px;
}


.booking div {

  display: flex;

  flex-direction:
    column;

  gap: 4px;
}


.booking b {

  font-size: 11px;
}


.booking small {

  font-size: 9px;

  color: #666;
}


.booking button {

  background: #146d70;

  border-radius: 10px;

  padding:
    7px
    13px;
}


.empty {

  background: #f0f4f8;

  border-radius: 10px;

  padding: 20px;

  color: #777;

  font-size: 12px;

  text-align: center;
}


.loading {

  padding: 50px;

  text-align: center;

  color: #136163;
}


.error {

  background: #ffe5e5;

  color: #a00000;

  padding: 15px;

  border-radius: 8px;

  margin-bottom: 20px;
}


/* RESPONSIVE */

@media (max-width: 1000px) {

  .dashboard {

    grid-template-columns:
      150px
      1fr;
  }


  .bookings {

    display: none;
  }

}


@media (max-width: 650px) {

  .dashboard {

    display: block;
  }


  .sidebar {

    min-height: auto;
  }


  .stats {

    grid-template-columns: 1fr;
  }


  .job-top {

    display: block;
  }


  .buttons {

    margin-top: 15px;
  }


  .earnings-progress {

    flex-direction: column;

    gap: 5px;
  }

}

</style>
