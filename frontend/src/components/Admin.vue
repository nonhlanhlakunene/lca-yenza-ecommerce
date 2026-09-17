<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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

const loadWorkers = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/admin/workers')

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
    const response = await fetch('http://localhost:3000/api/admin/stats')

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

const loadActivity = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/admin/activity')

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

const loadAdminData = async () => {
  loading.value = true
  message.value = ''

  await Promise.all([
    loadWorkers(),
    loadStats(),
    loadActivity()
  ])

  loading.value = false
}

const removeWorker = async (professionalId) => {
  const confirmed = confirm('Are you sure you want to delete this worker?')

  if (!confirmed) return

  try {
    const response = await fetch(
      `http://localhost:3000/api/admin/workers/${professionalId}`,
      {
        method: 'DELETE'
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete worker')
    }

    workers.value = workers.value.filter(
      worker => worker.professional_id !== professionalId
    )

    await loadStats()

    if (currentPage.value > 1 && paginatedWorkers.value.length === 0) {
      currentPage.value--
    }

    alert('Worker deleted successfully')
  } catch (error) {
    console.error('Delete worker error:', error)
    alert(error.message)
  }
}

const paginatedWorkers = computed(() => {
  const start = (currentPage.value - 1) * workersPerPage

  return workers.value.slice(
    start,
    start + workersPerPage
  )
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
    [
      Math.round((active / max) * 100),
      Math.round((completed / max) * 100),
      Math.round((pending / max) * 100)
    ],
    [
      Math.round((active / max) * 100),
      Math.round((completed / max) * 100),
      Math.round((pending / max) * 100)
    ],
    [
      Math.round((active / max) * 100),
      Math.round((completed / max) * 100),
      Math.round((pending / max) * 100)
    ],
    [
      Math.round((active / max) * 100),
      Math.round((completed / max) * 100),
      Math.round((pending / max) * 100)
    ],
    [
      Math.round((active / max) * 100),
      Math.round((completed / max) * 100),
      Math.round((pending / max) * 100)
    ],
    [
      Math.round((active / max) * 100),
      Math.round((completed / max) * 100),
      Math.round((pending / max) * 100)
    ]
  ]
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
    params: { slug }
  })
}

onMounted(() => {
  loadAdminData()
})
</script>

<template>
  <main class="admin-page">
    <button class="back-button" type="button" @click="router.back()" aria-label="Go back">
      <span aria-hidden="true">←</span>
      <span>Back</span>
    </button>

    <section class="admin-layout" aria-label="Admin dashboard">
      <div class="dashboard-main">

        <section class="dashboard-card workers-section">
          <div class="section-heading">
            <div>
              <h2>Workers</h2>
              <p>Manage and view your registered workers</p>
            </div>
            <span class="worker-count">{{ workers.length }} workers</span>
          </div>

          <p v-if="message" class="error-message">{{ message }}</p>

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
                  <td colspan="5" class="loading-row">Loading workers...</td>
                </tr>

                <tr v-else-if="paginatedWorkers.length === 0">
                  <td colspan="5" class="loading-row">No workers found.</td>
                </tr>

                <tr v-for="worker in paginatedWorkers" :key="worker.professional_id">
                  <td class="worker-name">{{ worker.name }}</td>

                  <td>
                    <span class="role-badge">{{ worker.role }}</span>
                  </td>

                  <td>{{ worker.city || 'Not provided' }}</td>

                  <td>
                    <button class="profile-button" type="button" @click="viewProfile(worker.slug)">
                      View Profile
                    </button>
                  </td>

                  <td>
                    <button class="delete-button" type="button" @click="removeWorker(worker.professional_id)">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <nav v-if="pages > 1" class="pagination" aria-label="Worker pages">
            <button type="button" class="page-arrow" :disabled="currentPage === 1" @click="currentPage--">←</button>

            <button v-for="page in pages" :key="page" type="button" :class="{ active: currentPage === page }" @click="currentPage = page">
              {{ page }}
            </button>

            <button type="button" class="page-arrow" :disabled="currentPage === pages" @click="currentPage++">→</button>
          </nav>
        </section>

        <section class="dashboard-card analytics-section">
          <div class="section-heading analytics-heading">
            <div>
              <h2>Statistics</h2>
              <p>Worker activity and category distribution</p>
            </div>
          </div>

          <div class="analytics">

            <div class="chart-container">
              <h3>Worker Activity</h3>

              <div class="bar-chart">
                <div class="chart-grid"></div>

                <div class="chart-bars">
                  <div v-for="(group, index) in chartGroups" :key="index" class="bar-group">
                    <i class="teal" :style="{ height: `${group[0]}%` }"></i>
                    <i class="blue" :style="{ height: `${group[1]}%` }"></i>
                    <i class="navy" :style="{ height: `${group[2]}%` }"></i>
                  </div>
                </div>
              </div>

              <div class="chart-key">
                <span><i class="teal"></i>Active</span>
                <span><i class="blue"></i>Completed</span>
                <span><i class="navy"></i>Pending</span>
              </div>
            </div>

            <div class="donut-container">
              <h3>Worker Categories</h3>

              <div class="donut-chart"></div>

              <div class="donut-label">
                <strong>{{ stats.total_workers }}</strong>
                <span>Total</span>
              </div>
            </div>

          </div>
        </section>
      </div>

      <aside class="reports-panel">

        <div class="summary">
          <div class="summary-item">
            <span class="summary-title">Today</span>
            <strong>{{ today }}</strong>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-item">
            <span class="summary-title">Total Workers</span>
            <strong>{{ stats.total_workers }}</strong>
          </div>
        </div>

        <div class="reports-card">
          <div class="reports-header">
            <div>
              <h1>Reports</h1>
              <p>Recent system reports</p>
            </div>

            <span class="reports-icon">≡</span>
          </div>

          <div class="reports-rule"></div>

          <div class="empty-reports">
            <div class="empty-icon">✓</div>
            <h3>No reports</h3>
            <p>There are currently no reports available to display.</p>
          </div>
        </div>

      </aside>
    </section>
  </main>
</template>

<style>
.admin-page {
  width: 100% !important;
  height: 100vh !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: 18px 40px !important;
  overflow: hidden !important;
  font-family: Arial, sans-serif !important;
}

.admin-page .back-button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 7px !important;
  width: auto !important;
  height: 24px !important;
  margin: 0 0 12px 3px !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  outline: none !important;
  background: transparent !important;
  color: #222 !important;
  font-family: Arial, sans-serif !important;
  font-size: 15px !important;
  font-weight: 400 !important;
  line-height: 20px !important;
  box-shadow: none !important;
  cursor: pointer !important;
}

.admin-page .back-button span:first-child {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 18px !important;
  height: 20px !important;
  font-size: 22px !important;
  line-height: 20px !important;
}

.admin-page .back-button span:last-child {
  display: inline-flex !important;
  align-items: center !important;
  width: auto !important;
  height: 20px !important;
  font-size: 15px !important;
  line-height: 20px !important;
}

.admin-page .admin-layout {
  width: 100% !important;
  max-width: 1600px !important;
  height: calc(100vh - 65px) !important;
  min-height: 0 !important;
  margin: 0 auto !important;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) 300px !important;
  gap: 25px !important;
  overflow: hidden !important;
}

.admin-page .dashboard-main {
  min-width: 0 !important;
  min-height: 0 !important;
  display: grid !important;
  grid-template-rows: minmax(0, 1.55fr) minmax(0, 1fr) !important;
  gap: 18px !important;
  overflow: hidden !important;
}

.admin-page .dashboard-card {
  min-width: 0 !important;
  min-height: 0 !important;
  padding: 18px !important;
  border-radius: 16px !important;
  border: none !important;
  background: #ffffff !important;
  overflow: hidden !important;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.07) !important;
}

.admin-page .section-heading {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 15px !important;
  margin-bottom: 12px !important;
}

.admin-page .section-heading h2 {
  margin: 0 !important;
  color: #222 !important;
  font-size: 20px !important;
  font-weight: 700 !important;
}

.admin-page .section-heading p {
  margin: 3px 0 0 !important;
  color: #777 !important;
  font-size: 12px !important;
}

.admin-page .worker-count {
  white-space: nowrap !important;
  padding: 6px 10px !important;
  border-radius: 20px !important;
  background: #eefafa !important;
  color: #136163 !important;
  font-size: 12px !important;
  font-weight: 600 !important;
}

.admin-page .workers-section {
  display: flex !important;
  flex-direction: column !important;
  min-height: 0 !important;
}

.admin-page .worker-table {
  width: 100% !important;
  flex: 1 !important;
  min-height: 0 !important;
  overflow: hidden !important;
}

.admin-page .worker-table table {
  width: 100% !important;
  border-collapse: collapse !important;
  table-layout: fixed !important;
}

.admin-page .worker-table th {
  padding: 7px 10px !important;
  text-align: left !important;
  color: #777 !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  border-bottom: 1px solid #eeeeee !important;
}

.admin-page .worker-table td {
  padding: 7px 10px !important;
  color: #222 !important;
  font-size: 12px !important;
  border-bottom: 1px solid #f0f0f0 !important;
  white-space: nowrap !important;
}

.admin-page .worker-table tbody tr {
  height: 39px !important;
}

.admin-page .worker-table tbody tr:last-child td {
  border-bottom: none !important;
}

.admin-page .worker-name {
  color: #222 !important;
  font-weight: 600 !important;
}

.admin-page .loading-row,
.admin-page .error-message {
  text-align: center !important;
  color: #777 !important;
}

.admin-page .error-message {
  margin: 0 0 10px !important;
  color: #b00020 !important;
  font-size: 12px !important;
}

.admin-page .role-badge {
  display: inline-block !important;
  padding: 4px 8px !important;
  border-radius: 12px !important;
  background: #eef7f7 !important;
  color: #136163 !important;
  font-size: 10px !important;
  font-weight: 600 !important;
}

.admin-page .profile-button {
  padding: 5px 9px !important;
  border: 1px solid #136163 !important;
  border-radius: 6px !important;
  background: transparent !important;
  color: #136163 !important;
  font-family: Arial, sans-serif !important;
  font-size: 10px !important;
  cursor: pointer !important;
  box-shadow: none !important;
}

.admin-page .profile-button:hover {
  background: #136163 !important;
  color: #ffffff !important;
}

.admin-page .delete-button {
  padding: 5px 9px !important;
  border: none !important;
  border-radius: 6px !important;
  background: #f3f3f3 !important;
  color: #555 !important;
  font-family: Arial, sans-serif !important;
  font-size: 10px !important;
  cursor: pointer !important;
  box-shadow: none !important;
}

.admin-page .delete-button:hover {
  background: #e5e5e5 !important;
}

.admin-page .pagination {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 5px !important;
  margin-top: 8px !important;
}

.admin-page .pagination button {
  width: 26px !important;
  height: 26px !important;
  padding: 0 !important;
  border: 1px solid #dddddd !important;
  border-radius: 6px !important;
  background: #ffffff !important;
  color: #333333 !important;
  font-family: Arial, sans-serif !important;
  font-size: 11px !important;
  cursor: pointer !important;
  box-shadow: none !important;
}

.admin-page .pagination button.active {
  background: #136163 !important;
  border-color: #136163 !important;
  color: #ffffff !important;
}

.admin-page .pagination button:hover:not(.active) {
  background: #f4f4f4 !important;
}

.admin-page .pagination button:disabled {
  opacity: 0.35 !important;
  cursor: not-allowed !important;
}

.admin-page .analytics-section {
  display: flex !important;
  flex-direction: column !important;
  min-height: 0 !important;
}

.admin-page .analytics-heading {
  margin-bottom: 5px !important;
}

.admin-page .analytics {
  flex: 1 !important;
  min-height: 0 !important;
  display: grid !important;
  grid-template-columns: 1.5fr 1fr !important;
  gap: 25px !important;
  overflow: hidden !important;
}

.admin-page .chart-container {
  position: relative !important;
  min-width: 0 !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
}

.admin-page .chart-container h3,
.admin-page .donut-container h3 {
  margin: 0 0 7px !important;
  color: #222 !important;
  font-size: 13px !important;
  font-weight: 600 !important;
}

.admin-page .bar-chart {
  position: relative !important;
  flex: 1 !important;
  min-height: 60px !important;
  border-left: 1px solid #dddddd !important;
  border-bottom: 1px solid #dddddd !important;
  overflow: hidden !important;
}

.admin-page .chart-grid {
  position: absolute !important;
  inset: 0 !important;
  background-image: linear-gradient(to bottom, #eeeeee 1px, transparent 1px) !important;
  background-size: 100% 25% !important;
}

.admin-page .chart-bars {
  position: absolute !important;
  inset: 5px 10px 0 10px !important;
  display: flex !important;
  align-items: flex-end !important;
  justify-content: space-around !important;
  gap: 10px !important;
}

.admin-page .bar-group {
  height: 100% !important;
  display: flex !important;
  align-items: flex-end !important;
  gap: 2px !important;
}

.admin-page .bar-group i {
  display: block !important;
  width: 8px !important;
  min-height: 3px !important;
  border-radius: 3px 3px 0 0 !important;
}

.admin-page .teal {
  background: #136163 !important;
}

.admin-page .blue {
  background: #4b8fa0 !important;
}

.admin-page .navy {
  background: #183b56 !important;
}

.admin-page .chart-key {
  display: flex !important;
  justify-content: center !important;
  gap: 12px !important;
  margin-top: 7px !important;
}

.admin-page .chart-key span {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  color: #666 !important;
  font-size: 9px !important;
}

.admin-page .chart-key i {
  width: 7px !important;
  height: 7px !important;
  border-radius: 2px !important;
}

.admin-page .donut-container {
  position: relative !important;
  min-width: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

.admin-page .donut-container h3 {
  align-self: flex-start !important;
}

.admin-page .donut-chart {
  position: relative !important;
  width: 105px !important;
  height: 105px !important;
  margin: auto !important;
  border-radius: 50% !important;
  background: conic-gradient(#136163 0deg 110deg, #4b8fa0 110deg 220deg, #183b56 220deg 290deg, #d7e5e5 290deg 360deg) !important;
}

.admin-page .donut-chart::after {
  content: "" !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  width: 60px !important;
  height: 60px !important;
  transform: translate(-50%, -50%) !important;
  border-radius: 50% !important;
  background: #ffffff !important;
}

.admin-page .donut-label {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -35%) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  z-index: 2 !important;
}

.admin-page .donut-label strong {
  color: #222 !important;
  font-size: 18px !important;
}

.admin-page .donut-label span {
  color: #777 !important;
  font-size: 9px !important;
}

.admin-page .reports-panel {
  min-width: 0 !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 15px !important;
  overflow: hidden !important;
}

.admin-page .summary {
  display: grid !important;
  grid-template-columns: 1fr auto 1fr !important;
  align-items: center !important;
  padding: 14px !important;
  border-radius: 14px !important;
  background: #ffffff !important;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.07) !important;
}

.admin-page .summary-item {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
  text-align: center !important;
}

.admin-page .summary-title {
  color: #888 !important;
  font-size: 10px !important;
}

.admin-page .summary-item strong {
  color: #222 !important;
  font-size: 13px !important;
}

.admin-page .summary-divider {
  width: 1px !important;
  height: 35px !important;
  background: #dddddd !important;
}

.admin-page .reports-card {
  flex: 1 !important;
  min-height: 0 !important;
  padding: 18px !important;
  border-radius: 14px !important;
  background: #ffffff !important;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.07) !important;
  overflow: hidden !important;
}

.admin-page .reports-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}

.admin-page .reports-header h1 {
  margin: 0 !important;
  color: #222 !important;
  font-size: 21px !important;
}

.admin-page .reports-header p {
  margin: 3px 0 0 !important;
  color: #888 !important;
  font-size: 11px !important;
}

.admin-page .reports-icon {
  color: #136163 !important;
  font-size: 24px !important;
}

.admin-page .reports-rule {
  width: 100% !important;
  height: 1px !important;
  margin: 14px 0 !important;
  background: #eeeeee !important;
}

.admin-page .empty-reports {
  height: calc(100% - 80px) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
}

.admin-page .empty-icon {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 42px !important;
  height: 42px !important;
  margin-bottom: 10px !important;
  border-radius: 50% !important;
  background: #eef7f7 !important;
  color: #136163 !important;
  font-size: 18px !important;
}

.admin-page .empty-reports h3 {
  margin: 0 0 5px !important;
  color: #222 !important;
  font-size: 14px !important;
}

.admin-page .empty-reports p {
  max-width: 180px !important;
  margin: 0 !important;
  color: #888 !important;
  font-size: 10px !important;
  line-height: 1.5 !important;
}

@media (min-width: 1400px) {
  .admin-page { padding: 20px 55px !important; }
  .admin-page .admin-layout { grid-template-columns: minmax(0, 1fr) 330px !important; gap: 30px !important; }
  .admin-page .worker-table td { padding: 8px 12px !important; }
  .admin-page .worker-table tbody tr { height: 41px !important; }
  .admin-page .donut-chart { width: 115px !important; height: 115px !important; }
  .admin-page .donut-chart::after { width: 66px !important; height: 66px !important; }
}

@media (max-width: 1200px) and (min-width: 901px) {
  .admin-page { padding: 15px 25px !important; }
  .admin-page .admin-layout { grid-template-columns: minmax(0, 1fr) 270px !important; gap: 18px !important; height: calc(100vh - 55px) !important; }
  .admin-page .dashboard-card { padding: 14px !important; }
  .admin-page .worker-table th,
  .admin-page .worker-table td { padding: 6px 7px !important; }
  .admin-page .worker-table tbody tr { height: 36px !important; }
  .admin-page .section-heading h2 { font-size: 18px !important; }
  .admin-page .analytics { gap: 15px !important; }
  .admin-page .donut-chart { width: 90px !important; height: 90px !important; }
  .admin-page .donut-chart::after { width: 52px !important; height: 52px !important; }
  .admin-page .summary { padding: 11px !important; }
  .admin-page .reports-card { padding: 14px !important; }
}

@media (max-width: 900px) {
  .admin-page {
    height: auto !important;
    min-height: 100vh !important;
    overflow: visible !important;
    padding: 20px !important;
  }

  .admin-page .admin-layout {
    height: auto !important;
    grid-template-columns: 1fr !important;
    gap: 20px !important;
    overflow: visible !important;
  }

  .admin-page .dashboard-main {
    grid-template-rows: auto auto !important;
    overflow: visible !important;
  }

  .admin-page .dashboard-card { min-height: 400px !important; }
  .admin-page .reports-panel { min-height: 400px !important; overflow: visible !important; }
}

@media (max-width: 600px) {
  .admin-page { padding: 15px !important; }
  .admin-page .admin-layout { gap: 15px !important; }
  .admin-page .dashboard-card { padding: 12px !important; }
  .admin-page .section-heading h2 { font-size: 17px !important; }
  .admin-page .section-heading p { font-size: 10px !important; }
  .admin-page .worker-table th,
  .admin-page .worker-table td { padding: 6px 4px !important; font-size: 10px !important; }
  .admin-page .worker-table tbody tr { height: 34px !important; }
  .admin-page .profile-button,
  .admin-page .delete-button { padding: 4px 6px !important; font-size: 9px !important; }
  .admin-page .analytics { grid-template-columns: 1fr !important; overflow: visible !important; }
  .admin-page .analytics-section { min-height: 450px !important; }
}
</style>

