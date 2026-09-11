<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import HandymanProfileView from './views/HandymanProfileView.vue'

const categories = ['Plumber', 'Carpenter', 'Electrician', 'Painter', 'Locksmith', 'HVAC Technician', 'Roofer', 'General Handyman']
const filters = ['Reviews', 'Availability', 'Location', 'Rating']
const priceOptions = ['All prices', 'Best prices (under R75/hr)', 'R76 – R90/hr', 'R91+/hr']
const activeCategory = ref('Plumber')
const activeFilter = ref('All')
const search = ref('')
const selectedPro = ref(null)
const currentPage = ref(0)
const priceFilter = ref('All prices')
const priceMenuOpen = ref(false)
const route = useRoute()
const profileSlug = (pro) => pro.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const professionals = [
  { name: 'Arthur Pendleton', job: 'Master Plumber & Pipe Specialist', category: 'Plumber', rating: '4.9', reviews: 124, price: 85, tags: ['Emergency Repair', 'Leaky Pipes', 'Commercial'], photo: 'https://i.pravatar.cc/100?img=12' },
  { name: 'Marcus Vance', job: 'Expert Cabinetry & Framing Carpenter', category: 'Carpenter', rating: '4.8', reviews: 96, price: 75, tags: ['Furniture Assembly', 'Custom Decks', 'Drywall'], photo: 'https://i.pravatar.cc/100?img=53' },
  { name: 'Sarah Jenkins', job: 'Licensed Residential Electrician', category: 'Electrician', rating: '5.0', reviews: 83, price: 90, tags: ['Wiring', 'Smart Home', 'Lighting Installation'], photo: 'https://i.pravatar.cc/100?img=47' },
  { name: 'Elena Rodriguez', job: 'Interior & Exterior Painting Specialist', category: 'Painter', rating: '4.9', reviews: 108, price: 72, tags: ['Interior Painting', 'Feature Walls', 'Exterior Finishes'], photo: 'https://i.pravatar.cc/100?img=36' },
  { name: 'Daniel Okafor', job: '24/7 Residential & Auto Locksmith', category: 'Locksmith', rating: '4.9', reviews: 147, price: 70, tags: ['Lockout Service', 'Key Cutting', 'Rekeying'], photo: 'https://i.pravatar.cc/100?img=11' },
  { name: 'Maya Collins', job: 'Certified Security Lock Specialist', category: 'Locksmith', rating: '4.8', reviews: 78, price: 82, tags: ['Smart Locks', 'Security Upgrades', 'Safe Opening'], photo: 'https://i.pravatar.cc/100?img=32' },
  { name: 'Owen Hart', job: 'Emergency Locksmith & Key Expert', category: 'Locksmith', rating: '4.7', reviews: 112, price: 65, tags: ['Emergency Callout', 'Car Keys', 'Lock Repair'], photo: 'https://i.pravatar.cc/100?img=68' },
  { name: 'Priya Naidoo', job: 'Licensed HVAC Installation Technician', category: 'HVAC Technician', rating: '5.0', reviews: 91, price: 95, tags: ['AC Installation', 'Heat Pumps', 'Ventilation'], photo: 'https://i.pravatar.cc/100?img=49' },
  { name: 'Ethan Brooks', job: 'Heating & Cooling Service Expert', category: 'HVAC Technician', rating: '4.8', reviews: 134, price: 88, tags: ['AC Repair', 'Furnace Service', 'Maintenance'], photo: 'https://i.pravatar.cc/100?img=14' },
  { name: 'Lerato Mokoena', job: 'Commercial HVAC Systems Technician', category: 'HVAC Technician', rating: '4.9', reviews: 66, price: 110, tags: ['Ductwork', 'Diagnostics', 'Commercial'], photo: 'https://i.pravatar.cc/100?img=45' },
  { name: 'Jacob Miles', job: 'Roof Repair & Waterproofing Pro', category: 'Roofer', rating: '4.9', reviews: 156, price: 86, tags: ['Leak Repair', 'Waterproofing', 'Tile Roofing'], photo: 'https://i.pravatar.cc/100?img=60' },
  { name: 'Thabo Dlamini', job: 'Residential Roofing Contractor', category: 'Roofer', rating: '4.8', reviews: 103, price: 92, tags: ['Roof Replacement', 'Gutters', 'Inspections'], photo: 'https://i.pravatar.cc/100?img=52' },
  { name: 'Nina Patel', job: 'Metal & Flat Roof Specialist', category: 'Roofer', rating: '4.7', reviews: 74, price: 89, tags: ['Flat Roofs', 'Metal Roofing', 'Storm Damage'], photo: 'https://i.pravatar.cc/100?img=44' },
  { name: 'Carlos Mendes', job: 'Reliable Home Repair Handyman', category: 'General Handyman', rating: '4.9', reviews: 119, price: 60, tags: ['Minor Repairs', 'Mounting', 'Home Maintenance'], photo: 'https://i.pravatar.cc/100?img=59' },
  { name: 'Aisha Williams', job: 'Multi-Skilled Home Services Pro', category: 'General Handyman', rating: '4.8', reviews: 87, price: 68, tags: ['Painting', 'Fixtures', 'Furniture Repair'], photo: 'https://i.pravatar.cc/100?img=37' },
  { name: 'Ben Carter', job: 'General Repairs & Installation', category: 'General Handyman', rating: '4.7', reviews: 98, price: 58, tags: ['Shelving', 'Door Repair', 'Caulking'], photo: 'https://i.pravatar.cc/100?img=8' },
]
const filteredProfessionals = computed(() => {
  const term = search.value.trim().toLowerCase()
  return professionals.filter((pro) =>
    (activeCategory.value === 'Plumber' || pro.category === activeCategory.value) &&
    (!term || `${pro.name} ${pro.job} ${pro.tags.join(' ')}`.toLowerCase().includes(term)),
  )
})
const priceFilteredProfessionals = computed(() => {
  const matchesPrice = filteredProfessionals.value.filter((pro) => {
    if (priceFilter.value === 'Best prices (under R75/hr)') return pro.price <= 75
    if (priceFilter.value === 'R76 – R90/hr') return pro.price >= 76 && pro.price <= 90
    if (priceFilter.value === 'R91+/hr') return pro.price >= 91
    return true
  })
  return priceFilter.value === 'All prices' ? matchesPrice : [...matchesPrice].sort((a, b) => a.price - b.price)
})
const visibleProfessionals = computed(() => {
  const start = currentPage.value * 3
  return priceFilteredProfessionals.value.slice(start, start + 3)
})



watch([activeCategory, search, priceFilter], () => {
  currentPage.value = 0
})
</script>

<template>
  <HandymanProfileView v-if="route.name === 'profile'" />
  <template v-else>
  <nav class="home-navbar" aria-label="Main navigation">
    <ul class="navbar-links">
      <li><a href="#home">Home</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="/about">About Us</a></li>
      <li><a href="#results">Reviews</a></li>
      <li><a href="#bookings">Bookings</a></li>
      <li><a href="mailto:hello@yenza.co.za">Contact</a></li>
    </ul>
  </nav>
  <main id="home" class="directory-shell">
    <aside class="sidebar">
      <div class="brand"><span>YENZA!</span></div>
      <p class="section-label">CATEGORY</p>
      <nav aria-label="Trade categories">
        <button v-for="category in categories" :key="category" class="category" :class="{ active: activeCategory === category }" @click="activeCategory = category">{{ category }} <span>›</span></button>
      </nav>
    </aside>
    <section id="services" class="content">
      <form class="search-bar" @submit.prevent>
        <span class="search-icon">⌕</span><input v-model="search" type="search" placeholder="Search services..." aria-label="Search services" /><button>Search</button>
      </form>
      <p class="filter-label">QUICK FILTERS</p>
      <div class="filters">
        <button :class="{ selected: activeFilter === 'All' }" @click="activeFilter = 'All'">All</button>
        <div class="price-filter">
          <button class="prices-button" :class="{ selected: priceFilter !== 'All prices' }" @click="priceMenuOpen = !priceMenuOpen">Prices <span>▼</span></button>
          <div v-if="priceMenuOpen" class="price-menu">
            <button v-for="option in priceOptions" :key="option" :class="{ active: priceFilter === option }" @click="priceFilter = option; priceMenuOpen = false">{{ option }}</button>
          </div>
        </div>
        <button v-for="filter in filters" :key="filter" :class="{ selected: activeFilter === filter }" @click="activeFilter = filter">{{ filter }} <span v-if="filter !== 'All'">▼</span></button>
      </div>
      <div class="results-heading"><h1>Available Handymen ({{ priceFilteredProfessionals.length }} results)</h1><span>Sorted by: <strong>{{ priceFilter === 'All prices' ? 'Best Match' : 'Lowest Price' }}</strong></span></div>
      <div id="results" class="cards">
        <article v-for="pro in visibleProfessionals" :key="pro.name" class="professional-card">
          <div class="pro-top"><img :src="pro.photo" :alt="pro.name" /><div class="pro-info"><h2>{{ pro.name }}</h2><p>{{ pro.job }}</p><small><b>★</b> {{ pro.rating }} <span>({{ pro.reviews }} reviews)</span></small></div><strong class="price">R{{ pro.price }}/hr</strong></div>
          <div class="card-footer"><div class="tags"><span v-for="tag in pro.tags" :key="tag">{{ tag }}</span></div><RouterLink class="profile-button" :to="{ name: 'profile', params: { slug: profileSlug(pro) } }">View Profile&nbsp; →</RouterLink></div>
        </article>
        <p v-if="!priceFilteredProfessionals.length" class="empty">No handymen match your search.</p>
      </div>
      <div v-if="priceFilteredProfessionals.length > 3" id="bookings" class="view-more-wrap">
        <button v-if="currentPage > 0" class="view-more" @click="currentPage -= 1">← Previous</button>
        <button v-if="(currentPage + 1) * 3 < priceFilteredProfessionals.length" class="view-more" @click="currentPage += 1">View More →</button>
      </div>
    </section>
    <div v-if="selectedPro" class="toast" role="status">Opening {{ selectedPro }}'s profile</div>
  </main>
  </template>
</template>
