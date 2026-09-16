```vue
<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentPage = ref(1)

const workersPerPage = 5

const workers = ref([
  { name: 'Arthur Pendleton', role: 'Plumber', city: 'Cape Town', slug: 'arthur-pendleton' },
  { name: 'Marcus Vance', role: 'Carpenter', city: 'Cape Town', slug: 'marcus-vance' },
  { name: 'Sarah Jenkins', role: 'Electrician', city: 'Cape Town', slug: 'sarah-jenkins' },
  { name: 'Elena Rodriguez', role: 'Painter', city: 'Cape Town', slug: 'elena-rodriguez' },
  { name: 'Daniel Okafor', role: 'Locksmith', city: 'Cape Town', slug: 'daniel-okafor' },

  { name: 'James Anderson', role: 'Gardener', city: 'Cape Town', slug: 'james-anderson' },
  { name: 'Michael Brown', role: 'Plumber', city: 'Durban', slug: 'michael-brown' },
  { name: 'Olivia Smith', role: 'Painter', city: 'Johannesburg', slug: 'olivia-smith' },
  { name: 'Thomas Williams', role: 'Carpenter', city: 'Durban', slug: 'thomas-williams' },
  { name: 'Jessica Taylor', role: 'Electrician', city: 'Pretoria', slug: 'jessica-taylor' },

  { name: 'William Davis', role: 'Gardener', city: 'Cape Town', slug: 'william-davis' },
  { name: 'Sophia Wilson', role: 'Plumber', city: 'Durban', slug: 'sophia-wilson' },
  { name: 'Robert Moore', role: 'Locksmith', city: 'Johannesburg', slug: 'robert-moore' },
  { name: 'Emily Martin', role: 'Painter', city: 'Pretoria', slug: 'emily-martin' },
  { name: 'Daniel Thompson', role: 'Carpenter', city: 'Cape Town', slug: 'daniel-thompson' },
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

function removeWorker(name) {
  workers.value = workers.value.filter(
    (worker) => worker.name !== name
  )

  /* If deleting the last worker on a page,
     move back to the previous page */
  if (
    currentPage.value > 1 &&
    paginatedWorkers.value.length === 0
  ) {
    currentPage.value--
  }
}

function viewProfile(slug) {
  router.push({
    name: 'profile',
    params: { slug }
  })
}
</script>

<template>
  <main class="admin-page">

    <!-- Back button -->
    <button
      class="back-button"
      type="button"
      @click="router.back()"
      aria-label="Go back"
    >
      <span aria-hidden="true">←</span>
      <span>Back</span>
    </button>

    <section class="admin-layout" aria-label="Admin dashboard">

      <!-- ================= MAIN CONTENT ================= -->
      <div class="dashboard-main">

        <!-- Workers -->
        <section class="dashboard-card workers-section">

          <div class="section-heading">
            <div>
              <h2>Workers</h2>
              <p>Manage and view your registered workers</p>
            </div>

            <span class="worker-count">
              {{ workers.length }} workers
            </span>
          </div>

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

          <!-- Pagination -->
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


        <!-- ================= ANALYTICS ================= -->
        <section class="dashboard-card analytics-section">

          <div class="section-heading analytics-heading">
            <div>
              <h2>Statistics</h2>
              <p>Worker activity and category distribution</p>
            </div>
          </div>

          <div class="analytics">

            <!-- Bar chart -->
            <div class="chart-container">

              <h3>Worker Activity</h3>

              <div class="bar-chart">

                <div class="chart-grid"></div>

                <div class="chart-bars">

                  <div
                    v-for="(group, index) in [
                      [100,44,39],
                      [71,33,45],
                      [82,57,47],
                      [61,38,8],
                      [45,94,37],
                      [34,67,45]
                    ]"
                    :key="index"
                    class="bar-group"
                  >

                    <i
                      class="teal"
                      :style="{ height: `${group[0]}%` }"
                    ></i>

                    <i
                      class="blue"
                      :style="{ height: `${group[1]}%` }"
                    ></i>

                    <i
                      class="navy"
                      :style="{ height: `${group[2]}%` }"
                    ></i>

                  </div>

                </div>

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


            <!-- Donut chart -->
            <div class="donut-container">

              <h3>Worker Categories</h3>

              <div class="donut-chart"></div>

              <div class="donut-label">
                <strong>{{ workers.length }}</strong>
                <span>Total</span>
              </div>

            </div>

          </div>

        </section>

      </div>


      <!-- ================= RIGHT SIDE ================= -->
      <aside class="reports-panel">

        <!-- Summary -->
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


        <!-- Reports -->
        <div class="reports-card">

          <div class="reports-header">

            <div>

              <h1>Reports</h1>

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
   PAGE
========================================= */

.admin-page {
  min-height: 100vh;
  padding: 35px 60px 80px;
  background: #f7f9f9;
  color: #151515;
  font-family: Arial, sans-serif;
}


/* =========================================
   BACK BUTTON
========================================= */

.back-button {
  display: flex;
  align-items: center;

  gap: 10px;

  margin: 0 0 45px 5px;

  border: none;

  background: transparent;

  color: #222;

  font-size: 17px;

  cursor: pointer;
}

.back-button span:first-child {
  font-size: 34px;
}


/* =========================================
   MAIN LAYOUT
========================================= */

.admin-layout {
  display: grid;

  grid-template-columns:
    minmax(700px, 1fr)
    360px;

  gap: 65px;

  max-width: 1450px;

  margin: 0 auto;

  align-items: start;
}


/* =========================================
   MAIN CONTENT
========================================= */

.dashboard-main {
  display: flex;

  flex-direction: column;

  gap: 45px;
}


/* =========================================
   CARDS
========================================= */

.dashboard-card {
  background: white;

  border-radius: 24px;

  padding: 34px;

  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.06);
}


/* =========================================
   SECTION HEADER
========================================= */

.section-heading {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 30px;
}

.section-heading h2 {
  margin: 0;

  font-size: 29px;
}

.section-heading p {
  margin: 8px 0 0;

  color: #777;

  font-size: 14px;
}

.worker-count {
  padding: 9px 16px;

  border-radius: 20px;

  background: #e5f3f3;

  color: #12676a;

  font-size: 13px;

  font-weight: 700;
}


/* =========================================
   TABLE
========================================= */

.worker-table {
  overflow: hidden;

  border-radius: 17px;

  background: #f6f7f7;
}

table {
  width: 100%;

  border-collapse: collapse;

  table-layout: fixed;
}

thead {
  background: #12676a;

  color: white;
}

th {
  height: 58px;

  padding: 0 20px;

  font-size: 14px;

  text-align: left;
}

td {
  height: 72px;

  padding: 0 20px;

  border-bottom: 1px solid #e1e1e1;

  font-size: 14px;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background: #eef7f7;
}

.worker-name {
  font-weight: 700;
}


/* =========================================
   ROLE
========================================= */

.role-badge {
  display: inline-block;

  padding: 7px 13px;

  border-radius: 20px;

  background: #e7eeee;

  color: #12676a;

  font-size: 12px;

  font-weight: 600;
}


/* =========================================
   PROFILE BUTTON
========================================= */

.profile-button {
  padding: 9px 16px;

  border: none;

  border-radius: 20px;

  background: #12676a;

  color: white;

  font-size: 12px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;
}

.profile-button:hover {
  background: #0d5558;

  transform: translateY(-1px);
}


/* =========================================
   DELETE BUTTON
========================================= */

.delete-button {
  padding: 8px 15px;

  border: none;

  border-radius: 20px;

  background: #ffe5e5;

  color: #d00000;

  font-size: 12px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;
}

.delete-button:hover {
  background: #ffd0d0;
}


/* =========================================
   PAGINATION
========================================= */

.pagination {
  display: flex;

  justify-content: center;

  align-items: center;

  gap: 10px;

  margin-top: 30px;
}

.pagination button {
  width: 38px;

  height: 38px;

  border: none;

  border-radius: 10px;

  background: #e4e4e4;

  color: #222;

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.2s;
}

.pagination button:hover:not(:disabled) {
  background: #d1e8e8;
}

.pagination button.active {
  background: #12676a;

  color: white;
}

.pagination .page-arrow {
  font-size: 16px;
}

.pagination button:disabled {
  opacity: 0.35;

  cursor: not-allowed;
}


/* =========================================
   STATISTICS
========================================= */

.analytics-section {
  min-height: 430px;
}

.analytics {
  display: grid;

  grid-template-columns: minmax(400px, 1fr) 300px;

  gap: 80px;

  align-items: center;

  margin-top: 25px;
}

.chart-container h3,
.donut-container h3 {
  margin-bottom: 25px;

  font-size: 17px;
}


/* =========================================
   BAR CHART
========================================= */

.bar-chart {
  position: relative;

  width: 100%;

  height: 210px;

  border-left: 1px solid #aebcc1;

  border-bottom: 1px solid #aebcc1;
}

.chart-grid {
  position: absolute;

  inset: 0;

  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 41px,
      #e7ecee 42px,
      transparent 43px
    );
}

.chart-bars {
  position: relative;

  z-index: 1;

  display: flex;

  align-items: end;

  justify-content: space-around;

  height: 100%;

  padding: 0 20px;
}

.bar-group {
  display: flex;

  align-items: end;

  gap: 3px;

  height: 100%;
}

.bar-group i {
  width: 18px;

  display: block;

  border-radius: 4px 4px 0 0;
}

.teal {
  background: #14676a;
}

.blue {
  background: #1097e9;
}

.navy {
  background: #104c6b;
}


/* =========================================
   CHART LEGEND
========================================= */

.chart-key {
  display: flex;

  justify-content: center;

  gap: 25px;

  margin-top: 20px;
}

.chart-key span {
  display: flex;

  align-items: center;

  gap: 6px;

  color: #666;

  font-size: 11px;
}

.chart-key i {
  width: 10px;

  height: 10px;

  border-radius: 2px;
}


/* =========================================
   DONUT
========================================= */

.donut-container {
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;
}

.donut-chart {
  width: 200px;

  height: 200px;

  border-radius: 50%;

  background:
    conic-gradient(
      #ffb34e 0 16%,
      #5378ed 16% 26%,
      #826ff0 26% 58%,
      #ff8983 58% 79%,
      #3cbad3 79% 100%
    );
}

.donut-chart::after {
  content: '';

  position: absolute;

  inset: 46px;

  border-radius: 50%;

  background: white;
}

.donut-label {
  position: absolute;

  top: 110px;

  display: flex;

  flex-direction: column;

  align-items: center;

  z-index: 2;
}

.donut-label strong {
  font-size: 27px;
}

.donut-label span {
  color: #777;

  font-size: 12px;
}


/* =========================================
   REPORTS
========================================= */

.reports-panel {
  display: flex;

  flex-direction: column;

  gap: 25px;

  position: sticky;

  top: 25px;
}


/* =========================================
   SUMMARY
========================================= */

.summary {
  display: grid;

  grid-template-columns: 1fr auto 1fr;

  align-items: center;

  gap: 20px;

  padding: 23px;

  border-radius: 20px;

  background: white;

  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.05);
}

.summary-item {
  display: flex;

  flex-direction: column;

  gap: 7px;
}

.summary-title {
  color: #777;

  font-size: 12px;
}

.summary-item strong {
  font-size: 14px;
}

.summary-divider {
  width: 1px;

  height: 48px;

  background: #ddd;
}


/* =========================================
   REPORTS CARD
========================================= */

.reports-card {
  min-height: 560px;

  padding: 30px;

  border-radius: 24px;

  background: white;

  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.06);
}

.reports-header {
  display: flex;

  justify-content: space-between;

  align-items: center;
}

.reports-header h1 {
  margin: 0;

  color: #12676a;

  font-size: 38px;
}

.reports-header p {
  margin: 8px 0 0;

  color: #777;

  font-size: 13px;
}

.reports-icon {
  display: flex;

  align-items: center;

  justify-content: center;

  width: 42px;

  height: 42px;

  border-radius: 12px;

  background: #e6f2f2;

  color: #12676a;

  font-size: 22px;
}

.reports-rule {
  height: 1px;

  margin: 28px 0;

  background: #ddd;
}


/* =========================================
   EMPTY REPORTS
========================================= */

.empty-reports {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  min-height: 390px;

  text-align: center;
}

.empty-icon {
  display: flex;

  align-items: center;

  justify-content: center;

  width: 60px;

  height: 60px;

  margin-bottom: 20px;

  border-radius: 50%;

  background: #e7f3f3;

  color: #12676a;

  font-size: 25px;
}

.empty-reports h3 {
  margin: 0 0 10px;

  font-size: 18px;
}

.empty-reports p {
  max-width: 210px;

  margin: 0;

  color: #888;

  font-size: 13px;

  line-height: 1.6;
}


/* =========================================
   TABLET
========================================= */

@media (max-width: 1100px) {

  .admin-page {
    padding: 30px;
  }

  .admin-layout {
    grid-template-columns: 1fr;

    gap: 40px;
  }

  .reports-panel {
    position: static;

    display: grid;

    grid-template-columns: 300px 1fr;

    gap: 30px;
  }

}


/* =========================================
   SMALL TABLET
========================================= */

@media (max-width: 800px) {

  .analytics {
    grid-template-columns: 1fr;

    gap: 60px;
  }

  .reports-panel {
    display: flex;
  }

}


/* =========================================
   MOBILE
========================================= */

@media (max-width: 600px) {

  .admin-page {
    padding: 20px 15px 50px;
  }

  .back-button {
    margin-bottom: 30px;
  }

  .dashboard-main {
    gap: 30px;
  }

  .dashboard-card {
    padding: 22px 16px;

    border-radius: 19px;
  }

  .section-heading {
    align-items: flex-start;

    gap: 15px;
  }

  .section-heading h2 {
    font-size: 24px;
  }

  .worker-table {
    overflow-x: auto;
  }

  table {
    min-width: 700px;
  }

  .analytics {
    gap: 50px;
  }

  .bar-chart {
    height: 170px;
  }

  .reports-card {
    min-height: 450px;
  }

}
</style>