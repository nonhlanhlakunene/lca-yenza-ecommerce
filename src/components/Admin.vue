<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentPage = ref(1)
const workers = ref([
  { name: 'Arthur Pendleton', role: 'Plumber', city: 'Cape Town', slug: 'arthur-pendleton' },
  { name: 'Marcus Vance', role: 'Carpenter', city: 'Cape Town', slug: 'marcus-vance' },
  { name: 'Sarah Jenkins', role: 'Electrician', city: 'Cape Town', slug: 'sarah-jenkins' },
  { name: 'Elena Rodriguez', role: 'Painter', city: 'Cape Town', slug: 'elena-rodriguez' },
  { name: 'Daniel Okafor', role: 'Locksmith', city: 'Cape Town', slug: 'daniel-okafor' },
])

const pages = computed(() => [1, 2, 3])

function removeWorker(name) {
  workers.value = workers.value.filter((worker) => worker.name !== name)
}

function viewProfile(slug) {
  router.push({ name: 'profile', params: { slug } })
}
</script>

<template>
  <main class="admin-page">
    <button class="back-button" type="button" @click="router.back()" aria-label="Go back">
      <span aria-hidden="true">←</span> Back
    </button>

    <section class="admin-layout" aria-label="Admin dashboard">
      <div class="dashboard-main">
        <div class="worker-table" role="region" aria-label="Workers">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>City</th>
                <th>Action</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="worker in workers" :key="worker.name">
                <td>{{ worker.name }}</td>
                <td>{{ worker.role }}</td>
                <td>{{ worker.city }}</td>
                <td><button class="profile-button" type="button" @click="viewProfile(worker.slug)">View Profile</button></td>
                <td><button class="delete-button" type="button" @click="removeWorker(worker.name)">Delete</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <nav class="pagination" aria-label="Worker pages">
          <button v-for="page in pages" :key="page" type="button" :class="{ active: currentPage === page }" @click="currentPage = page">{{ page }}</button>
        </nav>

        <section class="analytics" aria-label="Worker analytics">
          <div class="bar-chart" aria-label="Worker activity chart">
            <div class="chart-grid"></div>
            <div class="chart-bars">
              <div v-for="(group, index) in [[100,44,39], [71,33,45], [82,57,47], [61,38,8], [45,94,37], [34,67,45]]" :key="index" class="bar-group">
                <i class="teal" :style="{ height: `${group[0]}%` }"></i><i class="blue" :style="{ height: `${group[1]}%` }"></i><i class="navy" :style="{ height: `${group[2]}%` }"></i>
              </div>
            </div>
          </div>
          <div class="chart-key" aria-hidden="true"><i class="teal"></i><i class="blue"></i><i class="navy"></i></div>
          <div class="donut-chart" aria-label="Worker category distribution"></div>
        </section>
      </div>

      <aside class="reports-panel">
        <div class="summary"><p>Today<br><span>12 Sep 2026</span></p><i></i><p>Total Workers<br><span>16</span></p></div>
        <h1>Reports</h1>
        <div class="reports-rule"></div>
        <div class="empty-reports">No reports</div>
      </aside>
    </section>
  </main>
</template>

<style scoped>
.admin-page { min-height: 100vh; padding: 18px 28px 16px; background: #fff; color: #0d0d0d; font-family: Arial, sans-serif; }
.back-button { display: flex; align-items: center; gap: 11px; margin: 0 0 24px 38px; border: 0; background: transparent; color: #101010; font-size: 18px; }
.back-button span { font-size: 35px; font-weight: 300; line-height: .7; }
.admin-layout { display: grid; grid-template-columns: minmax(620px, 1fr) 287px; gap: 43px; max-width: 1068px; margin: 0 auto; }
.worker-table { overflow: hidden; border-radius: 19px; background: #f4f4f4; }
table { width: 100%; border-collapse: collapse; table-layout: fixed; }
th { height: 54px; border-bottom: 1px solid #252525; font-size: 18px; font-weight: 700; text-align: left; }
td { height: 41px; font-size: 15px; }
th:first-child, td:first-child { padding-left: 16px; width: 22%; } th:nth-child(2) { width: 19%; } th:nth-child(3) { width: 23%; } th:nth-child(4) { width: 23%; } th:last-child { width: 13%; }
.profile-button { padding: 3px 8px; border: 0; border-radius: 12px; background: #12676a; color: white; font-size: 11px; }
.delete-button { padding: 1px 7px 2px; border: 0; border-radius: 12px; background: red; color: white; font-size: 16px; line-height: 1.1; }
.pagination { display: flex; justify-content: center; gap: 18px; padding: 10px 0 47px; }
.pagination button { width: 31px; height: 26px; border: 0; background: #dedede; color: #151515; font-size: 14px; font-weight: 700; }
.pagination button.active { background: #d7d7d7; }
.analytics { position: relative; min-height: 302px; border-top: 1px solid #b5b5b5; }
.bar-chart { position: absolute; top: 71px; left: 15px; width: 407px; height: 151px; border-left: 1px solid #aebcc1; border-bottom: 1px solid #aebcc1; }
.chart-grid { position: absolute; inset: 0; background: repeating-linear-gradient(to bottom, transparent 0, transparent 29px, #e7ecee 30px, transparent 31px); }
.chart-bars { position: relative; z-index: 1; display: flex; align-items: end; justify-content: space-around; height: 100%; padding: 0 8px; }
.bar-group { display: flex; align-items: end; gap: 2px; height: 100%; } .bar-group i { display: block; width: 15px; } .teal { background: #14676a; } .blue { background: #1097e9; } .navy { background: #104c6b; }
.chart-key { position: absolute; bottom: 1px; left: 0; display: flex; gap: 55px; } .chart-key i { width: 10px; height: 8px; }
.donut-chart { position: absolute; top: 32px; right: 20px; width: 175px; height: 175px; border-radius: 50%; background: conic-gradient(#ffb34e 0 16%, #5378ed 16% 26%, #826ff0 26% 58%, #ff8983 58% 79%, #3cbad3 79% 100%); }
.donut-chart::after { content: ''; position: absolute; inset: 37px; border-radius: 50%; background: #fff; }
.reports-panel { padding-top: 69px; }.summary { display: flex; align-items: center; gap: 30px; margin: 0 10px 35px 15px; font-size: 15px; line-height: 1.05; }.summary p { margin: 0; }.summary span { font-size: 14px; }.summary i { width: 1px; height: 43px; background: #222; }.reports-panel h1 { margin: 0 0 20px 14px; color: #12676a; font-size: 44px; font-weight: 700; line-height: 1; }.reports-rule { height: 1px; background: #242424; }.empty-reports { height: 381px; margin: 20px 5px 0; border-radius: 19px; background: #efefef; padding-top: 16px; text-align: center; font-size: 18px; }
@media (max-width: 850px) { .admin-layout { grid-template-columns: 1fr; }.reports-panel { padding-top: 0; }.analytics { margin-bottom: 20px; }.reports-panel h1 { margin-left: 0; }.summary { margin-left: 0; }.empty-reports { margin: 20px 0; }.bar-chart { width: min(407px, 64vw); }.donut-chart { right: 0; } }
@media (max-width: 620px) { .admin-page { padding: 16px; }.back-button { margin-left: 0; }.admin-layout { display: block; }.worker-table { overflow-x: auto; } table { min-width: 680px; }.analytics { min-height: 470px; }.bar-chart { left: 0; top: 55px; width: 100%; }.donut-chart { top: 245px; left: calc(50% - 87px); }.chart-key { bottom: 135px; }.pagination { padding-bottom: 30px; } }
</style>
