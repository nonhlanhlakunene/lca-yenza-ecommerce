<script setup>
import { onMounted, ref, watch } from 'vue'
import api from '../api/api.js'

const categories = ref([])
const professionals = ref([])
const activeCategory = ref('')
const activeFilter = ref('All')
const search = ref('')
const currentPage = ref(1)
const priceFilter = ref('All prices')
const priceMenuOpen = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const pagination = ref({ page: 1, limit: 3, total: 0, totalPages: 0 })

const filters = ['Reviews', 'Rating']
const priceOptions = ['All prices', 'Best prices (under R75/hr)', 'R76 – R90/hr', 'R91+/hr']

function addPriceParams(params) {
  if (priceFilter.value === 'Best prices (under R75/hr)') params.maxPrice = 75
  if (priceFilter.value === 'R76 – R90/hr') Object.assign(params, { minPrice: 76, maxPrice: 90 })
  if (priceFilter.value === 'R91+/hr') params.minPrice = 91
}

async function loadProfessionals() {
  loading.value = true
  errorMessage.value = ''
  try {
    const params = { page: currentPage.value, limit: 3 }
    if (activeCategory.value) params.category = activeCategory.value
    if (search.value.trim()) params.search = search.value.trim()
    if (priceFilter.value !== 'All prices') params.sort = 'price-asc'
    if (activeFilter.value === 'Reviews') params.sort = 'reviews'
    if (activeFilter.value === 'Rating') params.sort = 'rating'
    addPriceParams(params)

    const { data } = await api.get('/professionals', { params })
    professionals.value = data.professionals
    pagination.value = data.pagination
  } catch (error) {
    professionals.value = []
    pagination.value = { page: 1, limit: 3, total: 0, totalPages: 0 }
    errorMessage.value = error.response?.data?.message || 'Unable to load professionals. Please try again.'
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  try {
    const { data } = await api.get('/categories')
    categories.value = data.categories.map((category) => category.name)
    activeCategory.value = categories.value[0] || ''
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to load categories. Please try again.'
  }
}

function changePage(page) {
  if (page >= 1 && page <= pagination.value.totalPages && page !== currentPage.value) currentPage.value = page
}

function initials(name) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('')
}

watch([activeCategory, search, priceFilter, activeFilter], () => {
  currentPage.value = 1
  loadProfessionals()
})
watch(currentPage, loadProfessionals)

onMounted(async () => {
  await loadCategories()
  await loadProfessionals()
})
</script>

<template>
  <main class="directory-shell">
    <aside class="sidebar">
      <div class="brand">YENZA!</div>
      <p class="section-label">CATEGORY</p>
      <nav aria-label="Trade categories">
        <button v-for="category in categories" :key="category" class="category" :class="{ active: activeCategory === category }" @click="activeCategory = category">
          {{ category }} <span>›</span>
        </button>
      </nav>
    </aside>

    <section class="content">
      <form class="search-bar" @submit.prevent="loadProfessionals">
        <input v-model="search" type="search" placeholder="Search services..." aria-label="Search services" />
        <button type="submit">Search</button>
      </form>

      <p class="filter-label">QUICK FILTERS</p>
      <div class="filters">
        <button :class="{ selected: activeFilter === 'All' }" @click="activeFilter = 'All'">All</button>
        <div class="price-filter">
          <button class="prices-button" :class="{ selected: priceFilter !== 'All prices' }" @click="priceMenuOpen = !priceMenuOpen">Prices ▼</button>
          <div v-if="priceMenuOpen" class="price-menu">
            <button v-for="option in priceOptions" :key="option" :class="{ active: priceFilter === option }" @click="priceFilter = option; priceMenuOpen = false">{{ option }}</button>
          </div>
        </div>
        <button v-for="filter in filters" :key="filter" :class="{ selected: activeFilter === filter }" @click="activeFilter = filter">{{ filter }}</button>
      </div>

      <div class="results-heading">
        <h1>Available Handymen ({{ pagination.total }} results)</h1>
        <span>Sorted by: <strong>{{ activeFilter === 'All' && priceFilter === 'All prices' ? 'Best Match' : activeFilter === 'All' ? 'Lowest Price' : activeFilter }}</strong></span>
      </div>

      <p v-if="loading" class="state-message">Loading professionals…</p>
      <p v-else-if="errorMessage" class="state-message error">{{ errorMessage }}</p>
      <div v-else class="cards">
        <article v-for="pro in professionals" :key="pro.id" class="professional-card">
          <div class="pro-top">
            <img v-if="pro.photo" :src="pro.photo" :alt="pro.name" />
            <div v-else class="avatar" aria-hidden="true">{{ initials(pro.name) }}</div>
            <div class="pro-info"><h2>{{ pro.name }}</h2><p>{{ pro.job }}</p><small><b>★</b> {{ pro.rating }} <span>({{ pro.reviews }} reviews)</span></small></div>
            <strong class="price">R{{ pro.price }}/hr</strong>
          </div>
          <div class="card-footer"><div class="tags"><span v-for="tag in pro.tags" :key="tag">{{ tag }}</span></div><RouterLink class="profile-button" :to="{ name: 'profile', params: { slug: pro.slug } }">View Profile →</RouterLink></div>
        </article>
        <p v-if="!professionals.length" class="state-message">No handymen match your search.</p>
      </div>

      <nav v-if="pagination.totalPages > 1" class="pagination" aria-label="Results pages">
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">← Previous</button>
        <span>Page {{ currentPage }} of {{ pagination.totalPages }}</span>
        <button :disabled="currentPage === pagination.totalPages" @click="changePage(currentPage + 1)">Next →</button>
      </nav>
    </section>
  </main>
</template>

<style scoped>
.directory-shell { display:flex; min-height:100vh; background:#f7f7f7; color:#123442; }
.sidebar { width:276px; flex:0 0 276px; padding:34px 20px; background:#136163; color:#dceeee; }
.brand { margin-bottom:24px; color:#fff; font-family:'Jeju Hallasan',sans-serif; font-size:30px; }.section-label,.filter-label { font-size:10px; font-weight:700; letter-spacing:.06em; }.category { display:flex; justify-content:space-between; width:100%; padding:10px 14px; border:0; border-radius:6px; background:transparent; color:#dceeee; text-align:left; font-size:14px; }.category.active,.category:hover { background:#0d5153; color:#fff; }
.content { flex:1; min-width:0; padding:31px 36px; }.search-bar { display:flex; gap:10px; padding:10px; border:1px solid #dce3e7; border-radius:8px; background:#fff; }.search-bar input { flex:1; border:0; outline:0; padding:5px; }.search-bar button,.filters button,.profile-button,.pagination button { border:0; border-radius:6px; background:#136163; color:#fff; cursor:pointer; }.search-bar button { padding:0 18px; }.filter-label { margin-top:25px; color:#66808b; }.filters { display:flex; flex-wrap:wrap; gap:8px; }.filters>button,.prices-button { padding:8px 13px; border-radius:17px; font-size:12px; }.filters .selected { box-shadow:inset 0 0 0 1px #fff; background:#0b484a; }.price-filter { position:relative; }.price-menu { position:absolute; z-index:2; top:39px; width:190px; overflow:hidden; border-radius:7px; background:#fff; box-shadow:0 5px 14px #15313722; }.price-menu button { display:block; width:100%; padding:10px; border:0; background:#fff; color:#24434c; text-align:left; }.price-menu button.active,.price-menu button:hover { background:#e7f1f1; }.results-heading { display:flex; justify-content:space-between; align-items:end; margin:22px 0 15px; }.results-heading h1 { font-size:18px; }.results-heading span { color:#71818a; font-size:12px; }.results-heading strong { color:#136163; }.cards { display:grid; gap:12px; }.professional-card { overflow:hidden; border:1px solid #e2e8ea; border-radius:12px; background:#fff; }.pro-top { position:relative; display:flex; align-items:center; gap:13px; padding:14px 17px; }.pro-top img,.avatar { width:50px; height:50px; border-radius:50%; object-fit:cover; }.avatar { display:grid; place-items:center; background:#dff2f1; color:#136163; font-weight:700; }.pro-info h2 { margin:0; font-size:15px; }.pro-info p { margin:3px 0; color:#136163; font-size:12px; }.pro-info small { font-size:11px; }.pro-info b { color:#f59d12; }.pro-info small span { color:#849399; }.price { position:absolute; right:17px; top:22px; color:#136163; }.card-footer { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:9px 17px; border-top:1px solid #edf1f2; background:#fafcfc; }.tags { display:flex; flex-wrap:wrap; gap:6px; }.tags span { padding:3px 7px; border-radius:4px; background:#e3eff0; color:#136163; font-size:10px; }.profile-button { padding:7px 10px; font-size:11px; text-decoration:none; white-space:nowrap; }.state-message { padding:25px; text-align:center; color:#71818a; }.error { color:#a93226; }.pagination { display:flex; justify-content:center; align-items:center; gap:14px; padding:18px; }.pagination button { padding:8px 12px; }.pagination button:disabled { cursor:not-allowed; opacity:.5; }
@media (max-width:700px) { .directory-shell { display:block; }.sidebar { width:100%; }.sidebar nav { display:flex; overflow:auto; }.category { width:auto; white-space:nowrap; }.content { padding:22px 18px; }.results-heading { align-items:flex-start; gap:10px; }.card-footer { align-items:flex-start; }.tags { max-width:65%; } }
</style>
