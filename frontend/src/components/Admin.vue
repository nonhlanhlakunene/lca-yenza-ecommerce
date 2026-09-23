<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

const bookingsByService = ref([])

const currentPage = ref(1)
const workersPerPage = 5

const workers = ref([])
const loading = ref(true)
const message = ref('')

const stats = ref({
  total_workers: 0,
  total_customers: 0,
  total_bookings: 0,
  total_revenue: 0
})

const activity = ref({
  active: 0,
  completed: 0,
  pending: 0
})

const workerServices = ref([])
const bookingStatuses = ref([])

// ============================================================
// PENDING VERIFICATIONS
// ============================================================

const pendingVerifications = ref([])
const pendingLoading = ref(false)
const selectedWorker = ref(null)
const selectedDetails = ref(null)
const detailsLoading = ref(false)

const loadPendingVerifications = async () => {
  pendingLoading.value = true
  try {
    const response = await fetch(
      'http://localhost:3000/api/admin/pending-verifications',
      { headers: getAuthHeaders() }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to load pending')
    pendingVerifications.value = data
  } catch (error) {
    console.error('Pending verifications error:', error)
  } finally {
    pendingLoading.value = false
  }
}

const openVerificationDetails = async (professionalId) => {
  selectedWorker.value = professionalId
  selectedDetails.value = null
  detailsLoading.value = true

  try {
    const response = await fetch(
      `http://localhost:3000/api/admin/verifications/${professionalId}`,
      { headers: getAuthHeaders() }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to load details')
    selectedDetails.value = data
  } catch (error) {
    console.error('Details error:', error)
    Swal.fire({
      title: 'Could not load details',
      text: error.message,
      icon: 'error',
      confirmButtonColor: '#136163'
    })
  } finally {
    detailsLoading.value = false
  }
}

const closeVerificationDetails = () => {
  selectedWorker.value = null
  selectedDetails.value = null
}

const approveWorker = async (professionalId) => {
  const result = await Swal.fire({
    title: 'Approve this worker?',
    text: 'They will be able to receive jobs on the platform.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, approve',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#136163',
    cancelButtonColor: '#183b56',
    reverseButtons: true
  })

  if (!result.isConfirmed) return

  try {
    const response = await fetch(
      `http://localhost:3000/api/admin/verifications/${professionalId}/approve`,
      { method: 'POST', headers: getAuthHeaders() }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Approve failed')

    Swal.fire({
      title: 'Worker approved',
      text: 'The worker can now receive jobs.',
      icon: 'success',
      confirmButtonColor: '#136163'
    })

    closeVerificationDetails()
    await loadPendingVerifications()
    await loadWorkers()
    await loadStats()
  } catch (error) {
    console.error('Approve error:', error)
    Swal.fire({
      title: 'Approve failed',
      text: error.message,
      icon: 'error',
      confirmButtonColor: '#136163'
    })
  }
}

const rejectWorker = async (professionalId) => {
  const result = await Swal.fire({
    title: 'Reject this worker?',
    text: 'They will not be able to receive jobs on the platform.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, reject',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#b00020',
    cancelButtonColor: '#183b56',
    reverseButtons: true
  })

  if (!result.isConfirmed) return

  try {
    const response = await fetch(
      `http://localhost:3000/api/admin/verifications/${professionalId}/reject`,
      { method: 'POST', headers: getAuthHeaders() }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Reject failed')

    Swal.fire({
      title: 'Worker rejected',
      text: 'The application has been rejected.',
      icon: 'info',
      confirmButtonColor: '#136163'
    })

    closeVerificationDetails()
    await loadPendingVerifications()
    await loadWorkers()
    await loadStats()
  } catch (error) {
    console.error('Reject error:', error)
    Swal.fire({
      title: 'Reject failed',
      text: error.message,
      icon: 'error',
      confirmButtonColor: '#136163'
    })
  }
}

const openDocument = (documentId) => {
  const token = localStorage.getItem('token')
  const url = `http://localhost:3000/api/admin/documents/${documentId}?token=${token}`
  window.open(url, '_blank')
}

const formatDocumentType = (type) => {
  const labels = {
    id: 'ID Document',
    address: 'Proof of Address',
    police_clearance: 'Police Clearance',
    affidavit: 'Affidavit'
  }
  return labels[type] || type
}

// ============================================================

const loadWorkers = async () => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/admin/workers',
      { headers: getAuthHeaders() }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to load workers')
    workers.value = data
  } catch (error) {
    console.error('Workers error:', error)
    message.value = error.message
  }
}

const loadStats = async () => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/admin/stats',
      { headers: getAuthHeaders() }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to load statistics')

    stats.value = {
      total_workers: Number(data.total_workers) || 0,
      total_customers: Number(data.total_customers) || 0,
      total_bookings: Number(data.total_bookings) || 0,
      total_revenue: Number(data.total_revenue) || 0
    }
  } catch (error) {
    console.error('Stats error:', error)
  }
}

const loadBookingsByService = async () => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/admin/bookings-by-service',
      { headers: getAuthHeaders() }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to load booking service statistics')

    bookingsByService.value = data.map(service => ({
      service_name: service.service_name,
      booking_count: Number(service.booking_count) || 0
    }))
  } catch (error) {
    console.error('Bookings by service error:', error)
  }
}

const loadActivity = async () => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/admin/activity',
      { headers: getAuthHeaders() }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to load activity')

    activity.value = {
      active: Number(data.active) || 0,
      completed: Number(data.completed) || 0,
      pending: Number(data.pending) || 0
    }
  } catch (error) {
    console.error('Activity error:', error)
  }
}

const loadWorkerServices = async () => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/admin/services',
      { headers: getAuthHeaders() }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to load worker services')

    workerServices.value = data.map(service => ({
      service_name: service.service_name,
      worker_count: Number(service.worker_count) || 0
    }))
  } catch (error) {
    console.error('Worker services error:', error)
  }
}

const loadBookingStatuses = async () => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/admin/booking-status',
      { headers: getAuthHeaders() }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to load booking statuses')

    bookingStatuses.value = data.map(status => ({
      status: status.status,
      booking_count: Number(status.booking_count) || 0
    }))
  } catch (error) {
    console.error('Booking status error:', error)
  }
}

const loadAdminData = async () => {
  loading.value = true
  message.value = ''

  await Promise.all([
    loadWorkers(),
    loadStats(),
    loadActivity(),
    loadWorkerServices(),
    loadBookingStatuses(),
    loadBookingsByService(),
    loadPendingVerifications()
  ])

  loading.value = false
}

const bookingServiceChart = computed(() => {
  const max = Math.max(
    ...bookingsByService.value.map(
      service => Number(service.booking_count) || 0
    ),
    1
  )

  return bookingsByService.value.map(service => ({
    service_name: service.service_name,
    value: Number(service.booking_count) || 0,
    height: Math.max(
      Math.round(
        (Number(service.booking_count) / max) * 100
      ),
      service.booking_count > 0 ? 8 : 3
    )
  }))
})

const removeWorker = async (professionalId) => {
  const result = await Swal.fire({
    title: 'Delete worker?',
    text: 'Are you sure you want to delete this worker? This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#136163',
    cancelButtonColor: '#183b56',
    reverseButtons: true
  })

  if (!result.isConfirmed) return

  try {
    const response = await fetch(
      `http://localhost:3000/api/admin/workers/${professionalId}`,
      { method: 'DELETE', headers: getAuthHeaders() }
    )
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to delete worker')

    workers.value = workers.value.filter(
      worker => worker.professional_id !== professionalId
    )

    await loadStats()
    await loadActivity()
    await loadWorkerServices()
    await loadBookingStatuses()

    if (currentPage.value > 1 && paginatedWorkers.value.length === 0) {
      currentPage.value--
    }

    Swal.fire({
      title: 'Worker deleted',
      text: 'The worker was successfully removed.',
      icon: 'success',
      confirmButtonColor: '#136163'
    })
  } catch (error) {
    console.error('Delete worker error:', error)
    Swal.fire({
      title: 'Delete failed',
      text: error.message,
      icon: 'error',
      confirmButtonColor: '#136163'
    })
  }
}

const paginatedWorkers = computed(() => {
  const start = (currentPage.value - 1) * workersPerPage
  return workers.value.slice(start, start + workersPerPage)
})

const pages = computed(() => {
  return Math.ceil(workers.value.length / workersPerPage)
})

const chartGroups = computed(() => {
  const active = Number(activity.value.active) || 0
  const completed = Number(activity.value.completed) || 0
  const pending = Number(activity.value.pending) || 0

  const max = Math.max(active, completed, pending, 1)

  return [
    { label: 'Active', value: active, height: Math.max(Math.round((active / max) * 100), active > 0 ? 8 : 3) },
    { label: 'Completed', value: completed, height: Math.max(Math.round((completed / max) * 100), completed > 0 ? 8 : 3) },
    { label: 'Pending', value: pending, height: Math.max(Math.round((pending / max) * 100), pending > 0 ? 8 : 3) }
  ]
})

const totalServiceWorkers = computed(() => {
  return workerServices.value.reduce(
    (total, service) => total + Number(service.worker_count || 0),
    0
  )
})

const serviceSegments = computed(() => {
  const total = totalServiceWorkers.value
  if (!total) return []

  let currentDegree = 0
  const colours = ['#136163', '#4b8fa0', '#183b56', '#70aeb0', '#245f7a', '#91c4c5', '#31516b', '#b4d8d8']

  return workerServices.value.map((service, index) => {
    const percentage = Number(service.worker_count) / total
    const degrees = percentage * 360
    const start = currentDegree
    currentDegree += degrees

    return {
      ...service,
      percentage: Math.round(percentage * 100),
      start,
      end: currentDegree,
      colour: colours[index % colours.length]
    }
  })
})

const donutStyle = computed(() => {
  if (!serviceSegments.value.length) return { background: '#e5eeee' }
  const parts = serviceSegments.value.map(
    segment => `${segment.colour} ${segment.start}deg ${segment.end}deg`
  )
  return { background: `conic-gradient(${parts.join(', ')})` }
})

const bookingStatusChart = computed(() => {
  const max = Math.max(
    ...bookingStatuses.value.map(item => Number(item.booking_count) || 0),
    1
  )

  return bookingStatuses.value.map((item, index) => ({
    status: item.status,
    value: Number(item.booking_count) || 0,
    height: Math.max(Math.round((Number(item.booking_count) / max) * 100), item.booking_count > 0 ? 8 : 3),
    colour: index % 3 === 0 ? '#136163' : index % 3 === 1 ? '#4b8fa0' : '#183b56'
  }))
})

const formattedRevenue = computed(() => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 2
  }).format(Number(stats.value.total_revenue) || 0)
})

const today = computed(() => {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
})

const viewProfile = (slug) => {
  router.push({
    name: 'profile',
    params: { slug },
    query: { fromAdmin: 'true' }
  })
}

onMounted(() => {
  loadAdminData()
})
</script>

<template>
  <main class="admin-page">

    <!-- BACK -->
    <button
      class="back-button"
      type="button"
      @click="router.back()"
      aria-label="Go back"
    >
      <span aria-hidden="true">←</span>
      <span>Back</span>
    </button>

    <!-- PAGE HEADER -->
    <header class="admin-header">
      <div>
        <span class="admin-eyebrow">YENZA ADMINISTRATION</span>
        <br>
        <h1>Admin Dashboard</h1>
        <p>Manage workers and monitor platform activity.</p>
      </div>

      <div class="header-date">
        <span>Today</span>
        <strong>{{ today }}</strong>
      </div>
    </header>

    <!-- TOP STATS -->
    <section class="stat-grid">

      <div class="stat-card">
        <div class="stat-icon teal-icon">
          W
        </div>

        <div>
          <span>Workers</span>
          <strong>{{ stats.total_workers }}</strong>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon blue-icon">
          C
        </div>

        <div>
          <span>Customers</span>
          <strong>{{ stats.total_customers }}</strong>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon navy-icon">
          B
        </div>

        <div>
          <span>Bookings</span>
          <strong>{{ stats.total_bookings }}</strong>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon revenue-icon">
          R
        </div>

        <div>
          <span>Total Payments</span>
          <strong>{{ formattedRevenue }}</strong>
        </div>
      </div>

    </section>

    <!-- MAIN LAYOUT -->
    <section class="admin-layout" aria-label="Admin dashboard">

      <div class="dashboard-main">

        <!-- PENDING VERIFICATIONS -->
        <section class="dashboard-card pending-section">

          <div class="section-heading">
            <div>
              <span class="section-label">VERIFICATION</span>
              <h2>Pending Verifications</h2>
              <p>Review and approve new worker applications.</p>
            </div>

            <span class="pending-count">
              {{ pendingVerifications.length }} pending
            </span>
          </div>

          <div v-if="pendingLoading" class="loading-row">
            Loading pending verifications...
          </div>

          <div v-else-if="pendingVerifications.length === 0" class="empty-pending">
            No pending verifications. All caught up!
          </div>

          <div v-else class="pending-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service</th>
                  <th>City</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in pendingVerifications"
                  :key="item.professional_id"
                >
                  <td class="worker-name">{{ item.name }}</td>
                  <td>{{ item.service_name }}</td>
                  <td>{{ item.city }}</td>
                  <td>
                    <button
                      class="review-button"
                      type="button"
                      @click="openVerificationDetails(item.professional_id)"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </section>

        <!-- WORKERS -->
        <section class="dashboard-card workers-section">

          <div class="section-heading">
            <div>
              <span class="section-label">MANAGEMENT</span>
              <h2>Workers</h2>
              <p>Manage and view your registered workers.</p>
            </div>

            <span class="worker-count">
              {{ workers.length }} workers
            </span>
          </div>

          <p
            v-if="message"
            class="error-message"
          >
            {{ message }}
          </p>

          <div class="worker-table">
            <table>

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>City</th>
                  <th>Profile</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>

                <tr v-if="loading">
                  <td
                    colspan="5"
                    class="loading-row"
                  >
                    Loading workers...
                  </td>
                </tr>

                <tr
                  v-else-if="paginatedWorkers.length === 0"
                >
                  <td
                    colspan="5"
                    class="loading-row"
                  >
                    No workers found.
                  </td>
                </tr>

                <tr
                  v-for="worker in paginatedWorkers"
                  :key="worker.professional_id"
                >
                  <td class="worker-name">
                    {{ worker.name }}
                  </td>

                  <td>
                    <span class="role-badge">
                      {{ worker.role }}
                    </span>
                  </td>

                  <td>
                    {{ worker.city || 'Not provided' }}
                  </td>

                  <td>
                    <button
                      class="profile-button"
                      type="button"
                      @click="viewProfile(worker.slug)"
                    >
                      View Profile
                    </button>
                  </td>

                  <td>
                    <button
                      class="delete-button"
                      type="button"
                      @click="removeWorker(worker.professional_id)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          <!-- PAGINATION -->
          <nav
            v-if="pages > 1"
            class="pagination"
            aria-label="Worker pages"
          >
            <button
              type="button"
              class="page-arrow"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              ←
            </button>

            <button
              v-for="page in pages"
              :key="page"
              type="button"
              :class="{ active: currentPage === page }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>

            <button
              type="button"
              class="page-arrow"
              :disabled="currentPage === pages"
              @click="currentPage++"
            >
              →
            </button>
          </nav>

        </section>

        <!-- ANALYTICS -->
        <section class="dashboard-card analytics-section">

          <div class="section-heading analytics-heading">
            <div>
              <span class="section-label">ANALYTICS</span>
              <h2>Platform Activity</h2>
              <p>Live information from your database.</p>
            </div>
          </div>

          <div class="analytics">

            <!-- WORKER ACTIVITY -->
            <div class="chart-container">

              <h3>Worker Activity</h3>

              <div class="chart-subtitle">
                Booking activity
              </div>

              <div class="bar-chart">

                <div class="chart-grid"></div>

                <div class="chart-bars">

                  <div
                    v-for="(group, index) in chartGroups"
                    :key="index"
                    class="bar-group"
                  >
                    <i
                      :class="{
                        teal: index === 0,
                        blue: index === 1,
                        navy: index === 2
                      }"
                      :style="{
                        height: `${group.height}%`
                      }"
                      :title="`${group.label}: ${group.value}`"
                    ></i>

                    <span class="bar-value">
                      {{ group.value }}
                    </span>
                  </div>

                </div>
              </div>

              <div class="chart-labels">
                <span>Active</span>
                <span>Completed</span>
                <span>Pending</span>
              </div>

              <div class="chart-key">
                <span>
                  <i class="teal"></i>
                  Active
                </span>

                <span>
                  <i class="blue"></i>
                  Completed
                </span>

                <span>
                  <i class="navy"></i>
                  Pending
                </span>
              </div>

            </div>

            <!-- WORKER SERVICES -->
            <div class="donut-container">

              <h3>Workers by Service</h3>

              <div class="chart-subtitle">
                Current professionals
              </div>

              <div
                class="donut-chart"
                :style="donutStyle"
              >
                <div class="donut-hole"></div>

                <div class="donut-label">
                  <strong>{{ totalServiceWorkers }}</strong>
                  <span>Workers</span>
                </div>
              </div>

              <div
                v-if="serviceSegments.length"
                class="service-legend"
              >

                <div
                  v-for="service in serviceSegments"
                  :key="service.service_name"
                  class="legend-item"
                >
                  <span
                    class="legend-dot"
                    :style="{
                      background: service.colour
                    }"
                  ></span>

                  <span class="legend-name">
                    {{ service.service_name }}
                  </span>

                  <strong>
                    {{ service.worker_count }}
                  </strong>
                </div>

              </div>

              <p
                v-else
                class="no-chart-data"
              >
                No worker service data available.
              </p>

            </div>

          </div>
        </section>

        <!-- BOOKING STATUS -->
        <section class="dashboard-card booking-section">

          <div class="section-heading">

            <div>
              <span class="section-label">BOOKINGS</span>
              <h2>Booking Status</h2>

              <p>
                Current booking distribution.
              </p>
            </div>

            <span class="booking-total">
              {{ stats.total_bookings }} total
            </span>

          </div>

          <div
            v-if="bookingStatusChart.length"
            class="booking-chart"
          >

            <div
              v-for="booking in bookingStatusChart"
              :key="booking.status"
              class="booking-bar-group"
            >

              <div class="booking-bar-area">

                <span class="booking-value">
                  {{ booking.value }}
                </span>

                <div
                  class="booking-bar"
                  :style="{
                    height: `${booking.height}%`,
                    background: booking.colour
                  }"
                ></div>

              </div>

              <span class="booking-status">
                {{ booking.status }}
              </span>

            </div>

          </div>

          <div
            v-else
            class="no-bookings"
          >
            No booking data available.
          </div>

        </section>

      </div>

      <!-- RIGHT PANEL -->
      <aside class="reports-panel">

        <!-- SUMMARY -->
        <div class="summary">

          <div class="summary-item">
            <span class="summary-title">
              Today
            </span>

            <strong>
              {{ today }}
            </strong>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-item">
            <span class="summary-title">
              Workers
            </span>

            <strong>
              {{ stats.total_workers }}
            </strong>
          </div>

        </div>

        <!-- DASHBOARD OVERVIEW -->
        <div class="reports-card">

          <div class="reports-header">

            <div>
              <span class="section-label">
                OVERVIEW
              </span>

              <h1>Dashboard</h1>

              <p>
                Current platform information.
              </p>
            </div>

            <span class="reports-icon">
              ≡
            </span>

          </div>

          <div class="reports-rule"></div>

          <div class="overview-list">

            <div class="overview-item">
              <span>
                Active bookings
              </span>

              <strong>
                {{ activity.active }}
              </strong>
            </div>

            <div class="overview-item">
              <span>
                Completed bookings
              </span>

              <strong>
                {{ activity.completed }}
              </strong>
            </div>

            <div class="overview-item">
              <span>
                Pending bookings
              </span>

              <strong>
                {{ activity.pending }}
              </strong>
            </div>

            <div class="overview-item">
              <span>
                Customers
              </span>

              <strong>
                {{ stats.total_customers }}
              </strong>
            </div>

            <div class="overview-item">
              <span>
                Total Payments
              </span>

              <strong>
                {{ formattedRevenue }}
              </strong>
            </div>

          </div>

          <div class="system-status">
            <span class="status-dot"></span>

            <span>
              System data connected
            </span>
          </div>

        </div>

        <!-- REPORTS -->
        <div class="reports-card reports-section">

          <div class="reports-header">

            <div>
              <span class="section-label">
                REPORTS
              </span>

              <h1>Reports</h1>

              <p>
                Platform performance summary.
              </p>
            </div>

            <span class="reports-icon">
              ▤
            </span>

          </div>

          <div class="reports-rule"></div>

          <div class="report-list">

          </div>

          <div class="report-footer">
            <span class="status-dot"></span>

            <span>
              Report generated from live database data
            </span>
          </div>

        </div>

      </aside>

    </section>

    <!-- VERIFICATION MODAL -->
    <div v-if="selectedWorker" class="verify-modal-overlay" @click.self="closeVerificationDetails">
      <div class="verify-modal">

        <button class="verify-close" @click="closeVerificationDetails">×</button>

        <div v-if="detailsLoading" class="loading-row">
          Loading details...
        </div>

        <div v-else-if="selectedDetails">

          <h2>{{ selectedDetails.profile.first_name }} {{ selectedDetails.profile.last_name }}</h2>
          <p class="verify-subtitle">
            {{ selectedDetails.profile.email }} · {{ selectedDetails.profile.service_name }}
          </p>

          <div class="verify-section">
            <h3>Profile</h3>
            <div class="verify-info">
              <div><strong>City:</strong> {{ selectedDetails.profile.city || 'Not provided' }}</div>
              <div><strong>Phone:</strong> {{ selectedDetails.profile.phone || 'Not provided' }}</div>
              <div><strong>Experience:</strong> {{ selectedDetails.profile.experience_years || 0 }} years</div>
              <div><strong>Rate:</strong> {{ selectedDetails.profile.hourly_rate ? 'R' + selectedDetails.profile.hourly_rate : 'Not set' }}</div>
            </div>
          </div>

          <div class="verify-section">
            <h3>Documents ({{ selectedDetails.documents.length }})</h3>
            <div v-if="selectedDetails.documents.length === 0" class="empty-docs">
              No documents uploaded.
            </div>
            <ul v-else class="doc-list">
              <li v-for="doc in selectedDetails.documents" :key="doc.id">
                <button
                  class="doc-link"
                  type="button"
                  @click="openDocument(doc.id)"
                >
                  {{ formatDocumentType(doc.document_type) }} — {{ doc.file_name }}
                </button>
              </li>
            </ul>
          </div>

          <div class="verify-section">
            <h3>Experience</h3>
            <div v-if="selectedDetails.experience.length === 0" class="empty-docs">
              No experience submitted.
            </div>
            <div v-else>
              <div v-for="exp in selectedDetails.experience" :key="exp.id" class="exp-item">
                <div><strong>Service:</strong> {{ exp.service }}</div>
                <div><strong>Years:</strong> {{ exp.years_experience }}</div>
                <div v-if="exp.experience_notes"><strong>Notes:</strong> {{ exp.experience_notes }}</div>
              </div>
            </div>
          </div>

          <div class="verify-actions">
            <button class="verify-approve" @click="approveWorker(selectedWorker)">
              Approve
            </button>
            <button class="verify-reject" @click="rejectWorker(selectedWorker)">
              Reject
            </button>
          </div>

        </div>
      </div>
    </div>

  </main>
</template>

<style scoped>
/* =========================================================
   ADMIN PAGE
========================================================= */

.admin-page {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 20px 40px 35px;
  box-sizing: border-box;
  overflow-x: hidden;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #222;
  background: #f5f8f8;
}

.admin-page *,
.admin-page *::before,
.admin-page *::after {
  box-sizing: border-box;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.admin-page .back-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 12px 3px;
  padding: 0;
  border: none;
  background: transparent;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  box-shadow: none;
}

.admin-page .back-button:hover {
  color: #136163;
}

.admin-page .back-button span:first-child {
  font-size: 21px;
}

.admin-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}

.admin-eyebrow,
.section-label {
  display: block;
  color: #136163;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
}

.admin-header h1 {
  margin: 3px 0 4px;
  color: #183b56;
  font-size: 27px;
  line-height: 1.1;
  font-weight: 700;
}

.admin-header p {
  margin: 0;
  color: #7b8587;
  font-size: 12px;
}

.header-date {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.header-date span {
  color: #888;
  font-size: 10px;
}

.header-date strong {
  color: #183b56;
  font-size: 13px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;
  margin-bottom: 18px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 15px;
  border: 1px solid #e8eeee;
  border-radius: 13px;
  background: #ffffff;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.045);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 37px;
  height: 37px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
}

.teal-icon {
  background: #e8f5f5;
  color: #136163;
}

.blue-icon {
  background: #edf5f7;
  color: #4b8fa0;
}

.navy-icon {
  background: #edf1f5;
  color: #183b56;
}

.revenue-icon {
  background: #eef6f4;
  color: #136163;
}

.stat-card div:last-child {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.stat-card span {
  color: #7d8587;
  font-size: 10px;
}

.stat-card strong {
  color: #183b56;
  font-size: 17px;
  font-weight: 700;
}

.admin-layout {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 20px;
  align-items: stretch;
}

.dashboard-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.dashboard-card,
.summary,
.reports-card {
  border: 1px solid #e8eeee;
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
}

.dashboard-card {
  min-width: 0;
  padding: 18px;
}

.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 13px;
}

.section-heading h2 {
  margin: 3px 0 3px;
  color: #183b56;
  font-size: 19px;
  font-weight: 700;
}

.section-heading p {
  margin: 0;
  color: #899193;
  font-size: 11px;
}

.worker-count,
.booking-total {
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: 20px;
  background: #eef7f7;
  color: #136163;
  font-size: 10px;
  font-weight: 700;
}

.workers-section {
  min-height: 330px;
}

.worker-table {
  width: 100%;
  overflow-x: auto;
}

.worker-table table {
  width: 100%;
  min-width: 650px;
  border-collapse: collapse;
  table-layout: fixed;
}

.worker-table th {
  padding: 8px 10px;
  border-bottom: 1px solid #e8eeee;
  color: #80898b;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.worker-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #f0f3f3;
  color: #303738;
  font-size: 11px;
}

.worker-table tbody tr:last-child td {
  border-bottom: none;
}

.worker-name {
  color: #183b56;
  font-weight: 700;
}

.loading-row {
  height: 120px;
  text-align: center;
  color: #888;
  padding: 30px;
}

.error-message {
  margin: 0 0 10px;
  color: #b00020;
  font-size: 11px;
}

.role-badge {
  display: inline-block;
  max-width: 130px;
  overflow: hidden;
  padding: 4px 8px;
  border-radius: 20px;
  background: #eef7f7;
  color: #136163;
  font-size: 9px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-button,
.delete-button {
  padding: 5px 9px;
  border-radius: 6px;
  font-size: 9px;
  cursor: pointer;
}

.profile-button {
  border: 1px solid #136163;
  background: transparent;
  color: #136163;
}

.profile-button:hover {
  background: #136163;
  color: #ffffff;
}

.delete-button {
  border: 1px solid #e2e2e2;
  background: crimson;
  color: white;
}

.delete-button:hover {
  border-color: #f1b7b7;
  background: #f7c6c6;
  color: #a33;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
}

.pagination button {
  width: 27px;
  height: 27px;
  padding: 0;
  border: 1px solid #dfe5e5;
  border-radius: 6px;
  background: #ffffff;
  color: #333;
  font-size: 10px;
  cursor: pointer;
}

.pagination button.active {
  border-color: #136163;
  background: #136163;
  color: #ffffff;
}

.pagination button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.analytics-section {
  min-height: 310px;
}

.analytics-heading {
  margin-bottom: 10px;
}

.analytics {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(220px, 1fr);
  gap: 28px;
}

.chart-container,
.donut-container {
  min-width: 0;
}

.chart-container h3,
.donut-container h3 {
  margin: 0 0 2px;
  color: #183b56;
  font-size: 13px;
  font-weight: 700;
}

.chart-subtitle {
  margin-bottom: 8px;
  color: #929a9b;
  font-size: 9px;
}

.bar-chart {
  position: relative;
  height: 135px;
  border-bottom: 1px solid #dfe5e5;
  border-left: 1px solid #dfe5e5;
}

.chart-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to bottom, #edf0f0 1px, transparent 1px);
  background-size: 100% 25%;
}

.chart-bars {
  position: absolute;
  inset: 5px 25px 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 25px;
}

.bar-group {
  position: relative;
  height: 100%;
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar-group i {
  display: block;
  width: 34px;
  min-height: 3px;
  border-radius: 5px 5px 0 0;
  transition: height 0.4s ease;
}

.bar-value {
  position: absolute;
  bottom: 100%;
  margin-bottom: 4px;
  color: #183b56;
  font-size: 10px;
  font-weight: 700;
}

.teal {
  background: #136163;
}

.blue {
  background: #4b8fa0;
}

.navy {
  background: #183b56;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  gap: 25px;
  margin-top: 7px;
}

.chart-labels span {
  flex: 1;
  color: #697274;
  text-align: center;
  font-size: 9px;
}

.chart-key {
  display: flex;
  justify-content: center;
  gap: 13px;
  margin-top: 9px;
}

.chart-key span {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #7c8586;
  font-size: 8px;
}

.chart-key i {
  width: 7px;
  height: 7px;
  border-radius: 2px;
}

.donut-container {
  position: relative;
}

.donut-chart {
  position: relative;
  width: 125px;
  height: 125px;
  margin: 10px auto 8px;
  border-radius: 50%;
}

.donut-hole {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 73px;
  height: 73px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #ffffff;
}

.donut-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
}

.donut-label strong {
  color: #183b56;
  font-size: 19px;
  line-height: 1;
}

.donut-label span {
  margin-top: 3px;
  color: #888;
  font-size: 8px;
}

.service-legend {
  width: 100%;
  max-height: 85px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px 10px;
  overflow-y: auto;
  padding-right: 3px;
}

.legend-item {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 5px;
  color: #60696b;
  font-size: 8px;
}

.legend-dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.legend-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.legend-item strong {
  color: #183b56;
  font-size: 9px;
}

.no-chart-data {
  margin: 10px 0;
  color: #888;
  text-align: center;
  font-size: 9px;
}

.booking-section {
  min-height: 245px;
}

.booking-chart {
  height: 150px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 15px;
  padding: 10px 20px 0;
  border-bottom: 1px solid #dfe5e5;
}

.booking-bar-group {
  height: 100%;
  flex: 1;
  min-width: 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.booking-bar-area {
  position: relative;
  width: 100%;
  height: 115px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.booking-bar {
  width: min(48px, 65%);
  min-height: 3px;
  border-radius: 5px 5px 0 0;
  transition: height 0.4s ease;
}

.booking-value {
  position: absolute;
  bottom: 100%;
  margin-bottom: 4px;
  color: #183b56;
  font-size: 10px;
  font-weight: 700;
}

.booking-status {
  margin-top: 7px;
  color: #697274;
  font-size: 9px;
  text-transform: capitalize;
}

.no-bookings {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  color: #888;
  font-size: 10px;
}

.reports-panel {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.summary {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 15px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.summary-title {
  color: #8b9495;
  font-size: 9px;
}

.summary-item strong {
  color: #183b56;
  font-size: 12px;
}

.summary-divider {
  width: 1px;
  height: 32px;
  background: #e1e7e7;
}

.reports-card {
  flex: 1;
  min-height: 400px;
  padding: 18px;
}

.reports-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.reports-header h1 {
  margin: 3px 0 3px;
  color: #183b56;
  font-size: 20px;
}

.reports-header p {
  margin: 0;
  color: #8b9495;
  font-size: 10px;
}

.reports-icon {
  color: #136163;
  font-size: 22px;
}

.reports-rule {
  width: 100%;
  height: 1px;
  margin: 15px 0;
  background: #edf0f0;
}

.overview-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.overview-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 1px solid #f0f2f2;
}

.overview-item span {
  color: #747d7f;
  font-size: 10px;
}

.overview-item strong {
  color: #183b56;
  font-size: 11px;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 18px;
  padding: 9px;
  border-radius: 8px;
  background: #f0f8f6;
  color: #136163;
  font-size: 9px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #136163;
}

/* =========================================================
   REPORTS
========================================================= */

.reports-section {
  min-height: auto;
}

.report-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.report-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid #f0f2f2;
}

.report-item:last-child {
  border-bottom: none;
}

.report-item > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.report-title {
  color: #505a5c;
  font-size: 10px;
  font-weight: 600;
}

.report-item small {
  color: #9aa2a3;
  font-size: 8px;
}

.report-item strong {
  color: #183b56;
  font-size: 13px;
  font-weight: 700;
  text-align: right;
}

.report-footer {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 15px;
  padding: 9px;
  border-radius: 8px;
  background: #f0f8f6;
  color: #136163;
  font-size: 8px;
}

.report-footer .status-dot {
  flex-shrink: 0;
}

/* =========================================================
   PENDING VERIFICATIONS
========================================================= */

.pending-section {
  min-height: 200px;
}

.pending-count {
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: 20px;
  background: #fff3e0;
  color: #b26a00;
  font-size: 10px;
  font-weight: 700;
}

.empty-pending {
  padding: 30px 20px;
  text-align: center;
  color: #888;
  font-size: 12px;
}

.pending-table {
  width: 100%;
  overflow-x: auto;
}

.pending-table table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.pending-table th {
  padding: 8px 10px;
  border-bottom: 1px solid #e8eeee;
  color: #80898b;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.pending-table td {
  padding: 10px;
  border-bottom: 1px solid #f0f3f3;
  color: #303738;
  font-size: 11px;
}

.review-button {
  padding: 5px 12px;
  border: 1px solid #136163;
  border-radius: 6px;
  background: #136163;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.review-button:hover {
  background: transparent;
  color: #136163;
}

.verify-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.55);
}

.verify-modal {
  position: relative;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px;
  border-radius: 14px;
  background: #ffffff;
}

.verify-close {
  position: absolute;
  top: 14px;
  right: 14px;
  border: none;
  background: transparent;
  color: #999;
  font-size: 24px;
  cursor: pointer;
}

.verify-modal h2 {
  margin: 0 0 4px;
  color: #183b56;
  font-size: 22px;
}

.verify-subtitle {
  margin: 0 0 20px;
  color: #80898b;
  font-size: 12px;
}

.verify-section {
  margin-bottom: 22px;
}

.verify-section h3 {
  margin: 0 0 10px;
  color: #136163;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.verify-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
  font-size: 12px;
  color: #303738;
}

.empty-docs {
  padding: 12px;
  border-radius: 8px;
  background: #f5f8f8;
  color: #888;
  font-size: 11px;
  text-align: center;
}

.doc-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.doc-list li {
  margin-bottom: 6px;
}

.doc-link {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #dfe5e5;
  border-radius: 8px;
  background: #f9fbfb;
  color: #136163;
  font-size: 11px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.doc-link:hover {
  background: #eef7f7;
  border-color: #136163;
}

.exp-item {
  padding: 10px 14px;
  border-radius: 8px;
  background: #f9fbfb;
  font-size: 11px;
  color: #303738;
  line-height: 1.6;
}

.verify-actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.verify-approve,
.verify-reject {
  flex: 1;
  padding: 13px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.verify-approve {
  background: #136163;
  color: #ffffff;
}

.verify-approve:hover {
  background: #0d4f51;
}

.verify-reject {
  background: #f5e5e5;
  color: #b00020;
}

.verify-reject:hover {
  background: #ebd0d0;
}

@media (min-width: 1400px) {

  .admin-page {
    padding-left: 55px;
    padding-right: 55px;
  }

  .admin-layout {
    grid-template-columns: minmax(0, 1fr) 330px;
  }

  .stat-card {
    padding: 17px;
  }

  .donut-chart {
    width: 135px;
    height: 135px;
  }

  .donut-hole {
    width: 79px;
    height: 79px;
  }
}

@media (max-width: 1200px) {

  .admin-page {
    padding-left: 25px;
    padding-right: 25px;
  }

  .admin-layout {
    grid-template-columns: minmax(0, 1fr) 270px;
  }

  .stat-grid {
    gap: 10px;
  }

  .analytics {
    gap: 18px;
  }

  .donut-chart {
    width: 105px;
    height: 105px;
  }

  .donut-hole {
    width: 62px;
    height: 62px;
  }

  .service-legend {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {

  .admin-page {
    min-height: 100vh;
    padding: 18px;
  }

  .admin-header {
    align-items: flex-start;
  }

  .admin-layout {
    grid-template-columns: 1fr;
  }

  .reports-panel {
    min-height: auto;
  }

  .reports-card {
    min-height: 350px;
  }

  .analytics {
    grid-template-columns: 1fr;
  }

  .donut-container {
    padding-top: 10px;
  }

  .service-legend {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {

  .admin-page {
    padding: 15px;
  }

  .admin-header {
    flex-direction: column;
    gap: 10px;
  }

  .header-date {
    align-items: flex-start;
  }

  .admin-header h1 {
    font-size: 23px;
  }

  .stat-grid {
    grid-template-columns: 1fr 1fr;
  }

  .stat-card {
    padding: 11px;
  }

  .stat-icon {
    width: 31px;
    height: 31px;
  }

  .stat-card strong {
    font-size: 14px;
  }

  .dashboard-card {
    padding: 13px;
  }

  .section-heading h2 {
    font-size: 17px;
  }

  .worker-table table {
    min-width: 620px;
  }

  .booking-chart {
    padding-left: 5px;
    padding-right: 5px;
  }

  .booking-bar {
    width: 35px;
  }

  .service-legend {
    grid-template-columns: 1fr 1fr;
  }

  .verify-info {
    grid-template-columns: 1fr;
  }

  .verify-actions {
    flex-direction: column;
  }
}
</style>