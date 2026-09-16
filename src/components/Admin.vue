<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentPage = ref(1)

const workersPerPage = 5

const workers = ref([
  {
    name: 'Arthur Pendleton',
    role: 'Plumber',
    city: 'Cape Town',
    slug: 'arthur-pendleton'
  },
  {
    name: 'Marcus Vance',
    role: 'Carpenter',
    city: 'Cape Town',
    slug: 'marcus-vance'
  },
  {
    name: 'Sarah Jenkins',
    role: 'Electrician',
    city: 'Cape Town',
    slug: 'sarah-jenkins'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Painter',
    city: 'Cape Town',
    slug: 'elena-rodriguez'
  },
  {
    name: 'Daniel Okafor',
    role: 'Locksmith',
    city: 'Cape Town',
    slug: 'daniel-okafor'
  },
  {
    name: 'James Anderson',
    role: 'Gardener',
    city: 'Cape Town',
    slug: 'james-anderson'
  },
  {
    name: 'Michael Brown',
    role: 'Plumber',
    city: 'Durban',
    slug: 'michael-brown'
  },
  {
    name: 'Olivia Smith',
    role: 'Painter',
    city: 'Johannesburg',
    slug: 'olivia-smith'
  },
  {
    name: 'Thomas Williams',
    role: 'Carpenter',
    city: 'Durban',
    slug: 'thomas-williams'
  },
  {
    name: 'Jessica Taylor',
    role: 'Electrician',
    city: 'Pretoria',
    slug: 'jessica-taylor'
  },
  {
    name: 'William Davis',
    role: 'Gardener',
    city: 'Cape Town',
    slug: 'william-davis'
  },
  {
    name: 'Sophia Wilson',
    role: 'Plumber',
    city: 'Durban',
    slug: 'sophia-wilson'
  },
  {
    name: 'Robert Moore',
    role: 'Locksmith',
    city: 'Johannesburg',
    slug: 'robert-moore'
  },
  {
    name: 'Emily Martin',
    role: 'Painter',
    city: 'Pretoria',
    slug: 'emily-martin'
  },
  {
    name: 'Daniel Thompson',
    role: 'Carpenter',
    city: 'Cape Town',
    slug: 'daniel-thompson'
  }
])

/* Workers displayed on the current page */
const paginatedWorkers = computed(() => {
  const start = (currentPage.value - 1) * workersPerPage
  const end = start + workersPerPage

  return workers.value.slice(start, end)
})

/* Number of pages */
const pages = computed(() => {
  return Math.ceil(workers.value.length / workersPerPage)
})

/* Delete worker */
function removeWorker(name) {
  workers.value = workers.value.filter(
    (worker) => worker.name !== name
  )

  if (
    currentPage.value > 1 &&
    paginatedWorkers.value.length === 0
  ) {
    currentPage.value--
  }
}

/* View worker profile */
function viewProfile(slug) {
  router.push({
    name: 'profile',
    params: { slug }
  })
}
</script>

<template>
  <main class="admin-page">

    <!-- =========================================
         BACK BUTTON
    ========================================== -->

    <button
      class="back-button"
      type="button"
      @click="router.back()"
      aria-label="Go back"
    >
      <span aria-hidden="true">←</span>
      <span>Back</span>
    </button>


    <!-- =========================================
         ADMIN LAYOUT
    ========================================== -->

    <section
      class="admin-layout"
      aria-label="Admin dashboard"
    >

      <!-- =========================================
           MAIN CONTENT
      ========================================== -->

      <div class="dashboard-main">

        <!-- =========================================
             WORKERS
        ========================================== -->

        <section class="dashboard-card workers-section">

          <div class="section-heading">

            <div>
              <h2>Workers</h2>

              <p>
                Manage and view your registered workers
              </p>
            </div>

            <span class="worker-count">
              {{ workers.length }} workers
            </span>

          </div>


          <!-- Workers table -->

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

                <tr
                  v-for="worker in paginatedWorkers"
                  :key="worker.name"
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
                    {{ worker.city }}
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
                      @click="removeWorker(worker.name)"
                    >
                      Delete
                    </button>
                  </td>

                </tr>

              </tbody>

            </table>

          </div>


          <!-- =========================================
               PAGINATION
          ========================================== -->

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


        <!-- =========================================
             STATISTICS
        ========================================== -->

        <section class="dashboard-card analytics-section">

          <div class="section-heading analytics-heading">

            <div>
              <h2>Statistics</h2>

              <p>
                Worker activity and category distribution
              </p>
            </div>

          </div>


          <div class="analytics">

            <!-- =========================================
                 BAR CHART
            ========================================== -->

            <div class="chart-container">

              <h3>
                Worker Activity
              </h3>

              <div class="bar-chart">

                <div class="chart-grid"></div>

                <div class="chart-bars">

                  <div
                    v-for="(group, index) in [
                      [100, 44, 39],
                      [71, 33, 45],
                      [82, 57, 47],
                      [61, 38, 8],
                      [45, 94, 37],
                      [34, 67, 45]
                    ]"
                    :key="index"
                    class="bar-group"
                  >

                    <i
                      class="teal"
                      :style="{
                        height: `${group[0]}%`
                      }"
                    ></i>

                    <i
                      class="blue"
                      :style="{
                        height: `${group[1]}%`
                      }"
                    ></i>

                    <i
                      class="navy"
                      :style="{
                        height: `${group[2]}%`
                      }"
                    ></i>

                  </div>

                </div>

              </div>


              <!-- Chart legend -->

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


            <!-- =========================================
                 DONUT CHART
            ========================================== -->

            <div class="donut-container">

              <h3>
                Worker Categories
              </h3>

              <div class="donut-chart"></div>

              <div class="donut-label">

                <strong>
                  {{ workers.length }}
                </strong>

                <span>
                  Total
                </span>

              </div>

            </div>

          </div>

        </section>

      </div>


      <!-- =========================================
           RIGHT SIDE
      ========================================== -->

      <aside class="reports-panel">

        <!-- =========================================
             SUMMARY
        ========================================== -->

        <div class="summary">

          <div class="summary-item">

            <span class="summary-title">
              Today
            </span>

            <strong>
              12 Sep 2026
            </strong>

          </div>

          <div class="summary-divider"></div>

          <div class="summary-item">

            <span class="summary-title">
              Total Workers
            </span>

            <strong>
              {{ workers.length }}
            </strong>

          </div>

        </div>


        <!-- =========================================
             REPORTS
        ========================================== -->

        <div class="reports-card">

          <div class="reports-header">

            <div>

              <h1>
                Reports
              </h1>

              <p>
                Recent system reports
              </p>

            </div>

            <span class="reports-icon">
              ≡
            </span>

          </div>


          <div class="reports-rule"></div>


          <div class="empty-reports">

            <div class="empty-icon">
              ✓
            </div>

            <h3>
              No reports
            </h3>

            <p>
              There are currently no reports
              available to display.
            </p>

          </div>

        </div>

      </aside>

    </section>

  </main>
</template>


<style>
/* =========================================
   ADMIN PAGE
========================================= */

.admin-page {
  width: 100% !important;
  height: 100vh !important;
  min-height: 0 !important;

  margin: 0 !important;
  padding: 18px 40px !important;

  overflow: hidden !important;

  font-family: Arial, sans-serif !important;
}


/* =========================================
   BACK BUTTON
========================================= */

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

  margin: 0 !important;
  padding: 0 !important;

  font-size: 22px !important;

  line-height: 20px !important;

  transform: none !important;
}

.admin-page .back-button span:last-child {
  display: inline-flex !important;

  align-items: center !important;

  width: auto !important;
  height: 20px !important;

  margin: 0 !important;
  padding: 0 !important;

  font-size: 15px !important;

  line-height: 20px !important;
}


/* =========================================
   MAIN LAYOUT
========================================= */

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


/* =========================================
   MAIN CONTENT
========================================= */

.admin-page .dashboard-main {
  min-width: 0 !important;
  min-height: 0 !important;

  display: grid !important;

  grid-template-rows:
    minmax(0, 1.55fr)
    minmax(0, 1fr) !important;

  gap: 18px !important;

  overflow: hidden !important;
}


/* =========================================
   DASHBOARD CARDS
========================================= */

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


/* =========================================
   SECTION HEADING
========================================= */

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


/* =========================================
   WORKERS
========================================= */

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


/* =========================================
   ROLE BADGE
========================================= */

.admin-page .role-badge {
  display: inline-block !important;

  padding: 4px 8px !important;

  border-radius: 12px !important;

  background: #eef7f7 !important;

  color: #136163 !important;

  font-size: 10px !important;

  font-weight: 600 !important;
}


/* =========================================
   PROFILE BUTTON
========================================= */

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


/* =========================================
   DELETE BUTTON
========================================= */

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


/* =========================================
   PAGINATION
========================================= */

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


/* =========================================
   ANALYTICS
========================================= */

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


/* =========================================
   BAR CHART
========================================= */

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

  background-image:
    linear-gradient(
      to bottom,
      #eeeeee 1px,
      transparent 1px
    ) !important;

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


/* =========================================
   CHART KEY
========================================= */

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


/* =========================================
   DONUT
========================================= */

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

  background:
    conic-gradient(
      #136163 0deg 110deg,
      #4b8fa0 110deg 220deg,
      #183b56 220deg 290deg,
      #d7e5e5 290deg 360deg
    ) !important;
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


/* =========================================
   RIGHT SIDE
========================================= */

.admin-page .reports-panel {
  min-width: 0 !important;
  min-height: 0 !important;

  display: flex !important;

  flex-direction: column !important;

  gap: 15px !important;

  overflow: hidden !important;
}


/* =========================================
   SUMMARY
========================================= */

.admin-page .summary {
  display: grid !important;

  grid-template-columns: 1fr auto 1fr !important;

  align-items: center !important;

  padding: 14px !important;

  border-radius: 14px !important;

  background: #ffffff !important;

  box-shadow:
    0 4px 18px rgba(0, 0, 0, 0.07) !important;
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


/* =========================================
   REPORTS
========================================= */

.admin-page .reports-card {
  flex: 1 !important;

  min-height: 0 !important;

  padding: 18px !important;

  border-radius: 14px !important;

  background: #ffffff !important;

  box-shadow:
    0 4px 18px rgba(0, 0, 0, 0.07) !important;

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


/* =========================================
   EMPTY REPORTS
========================================= */

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


/* =========================================
   LARGE DESKTOP
========================================= */

@media (min-width: 1400px) {

  .admin-page {
    padding: 20px 55px !important;
  }

  .admin-page .admin-layout {
    grid-template-columns:
      minmax(0, 1fr)
      330px !important;

    gap: 30px !important;
  }

  .admin-page .worker-table td {
    padding: 8px 12px !important;
  }

  .admin-page .worker-table tbody tr {
    height: 41px !important;
  }

  .admin-page .donut-chart {
    width: 115px !important;
    height: 115px !important;
  }

  .admin-page .donut-chart::after {
    width: 66px !important;
    height: 66px !important;
  }
}


/* =========================================
   LAPTOP
========================================= */

@media (max-width: 1200px) and (min-width: 901px) {

  .admin-page {
    padding: 15px 25px !important;
  }

  .admin-page .admin-layout {
    grid-template-columns:
      minmax(0, 1fr)
      270px !important;

    gap: 18px !important;

    height: calc(100vh - 55px) !important;
  }

  .admin-page .dashboard-card {
    padding: 14px !important;
  }

  .admin-page .worker-table th,
  .admin-page .worker-table td {
    padding: 6px 7px !important;
  }

  .admin-page .worker-table tbody tr {
    height: 36px !important;
  }

  .admin-page .section-heading h2 {
    font-size: 18px !important;
  }

  .admin-page .analytics {
    gap: 15px !important;
  }

  .admin-page .donut-chart {
    width: 90px !important;
    height: 90px !important;
  }

  .admin-page .donut-chart::after {
    width: 52px !important;
    height: 52px !important;
  }

  .admin-page .summary {
    padding: 11px !important;
  }

  .admin-page .reports-card {
    padding: 14px !important;
  }
}


/* =========================================
   TABLET / MOBILE
========================================= */

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
    grid-template-rows:
      auto
      auto !important;

    overflow: visible !important;
  }

  .admin-page .dashboard-card {
    min-height: 400px !important;
  }

  .admin-page .reports-panel {
    min-height: 400px !important;

    overflow: visible !important;
  }
}


/* =========================================
   SMALL MOBILE
========================================= */

@media (max-width: 600px) {

  .admin-page {
    padding: 15px !important;
  }

  .admin-page .admin-layout {
    gap: 15px !important;
  }

  .admin-page .dashboard-card {
    padding: 12px !important;
  }

  .admin-page .section-heading h2 {
    font-size: 17px !important;
  }

  .admin-page .section-heading p {
    font-size: 10px !important;
  }

  .admin-page .worker-table th,
  .admin-page .worker-table td {
    padding: 6px 4px !important;

    font-size: 10px !important;
  }

  .admin-page .worker-table tbody tr {
    height: 34px !important;
  }

  .admin-page .profile-button,
  .admin-page .delete-button {
    padding: 4px 6px !important;

    font-size: 9px !important;
  }

  .admin-page .analytics {
    grid-template-columns: 1fr !important;

    overflow: visible !important;
  }

  .admin-page .analytics-section {
    min-height: 450px !important;
  }
}
</style>