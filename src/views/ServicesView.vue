<script setup>
import { RouterLink } from 'vue-router'
import { computed, ref, watch } from 'vue'

const categories = [
  'Plumber',
  'Carpenter',
  'Electrician',
  'Painter',
  'Locksmith',
  'HVAC Technician',
  'Roofer',
  'General Handyman'
]

const filters = ['Reviews', 'Availability', 'Location', 'Rating']

const priceOptions = [
  'All prices',
  'Best prices (under R75/hr)',
  'R76 – R90/hr',
  'R91+/hr'
]

const activeCategory = ref('Plumber')
const activeFilter = ref('All')
const search = ref('')
const selectedPro = ref(null)
const currentPage = ref(0)
const priceFilter = ref('All prices')
const priceMenuOpen = ref(false)

const profileSlug = (pro) =>
  pro.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const professionals = [
  {
    name: 'Arthur Pendleton',
    job: 'Master Plumber & Pipe Specialist',
    category: 'Plumber',
    rating: '4.9',
    reviews: 124,
    price: 85,
    tags: ['Emergency Repair', 'Leaky Pipes', 'Commercial'],
    photo: 'https://i.pravatar.cc/100?img=12'
  },
  {
    name: 'Marcus Vance',
    job: 'Expert Cabinetry & Framing Carpenter',
    category: 'Carpenter',
    rating: '4.8',
    reviews: 96,
    price: 75,
    tags: ['Furniture Assembly', 'Custom Decks', 'Drywall'],
    photo: 'https://i.pravatar.cc/100?img=53'
  },
  {
    name: 'Sarah Jenkins',
    job: 'Licensed Residential Electrician',
    category: 'Electrician',
    rating: '5.0',
    reviews: 83,
    price: 90,
    tags: ['Wiring', 'Smart Home', 'Lighting Installation'],
    photo: 'https://i.pravatar.cc/100?img=47'
  },
  {
    name: 'Elena Rodriguez',
    job: 'Interior & Exterior Painting Specialist',
    category: 'Painter',
    rating: '4.9',
    reviews: 108,
    price: 72,
    tags: ['Interior Painting', 'Feature Walls', 'Exterior Finishes'],
    photo: 'https://i.pravatar.cc/100?img=36'
  },
  {
    name: 'Daniel Okafor',
    job: '24/7 Residential & Auto Locksmith',
    category: 'Locksmith',
    rating: '4.9',
    reviews: 147,
    price: 70,
    tags: ['Lockout Service', 'Key Cutting', 'Rekeying'],
    photo: 'https://i.pravatar.cc/100?img=11'
  },
  {
    name: 'Maya Collins',
    job: 'Certified Security Lock Specialist',
    category: 'Locksmith',
    rating: '4.8',
    reviews: 78,
    price: 82,
    tags: ['Smart Locks', 'Security Upgrades', 'Safe Opening'],
    photo: 'https://i.pravatar.cc/100?img=32'
  },
  {
    name: 'Owen Hart',
    job: 'Emergency Locksmith & Key Expert',
    category: 'Locksmith',
    rating: '4.7',
    reviews: 112,
    price: 65,
    tags: ['Emergency Callout', 'Car Keys', 'Lock Repair'],
    photo: 'https://i.pravatar.cc/100?img=68'
  },
  {
    name: 'Priya Naidoo',
    job: 'Licensed HVAC Installation Technician',
    category: 'HVAC Technician',
    rating: '5.0',
    reviews: 91,
    price: 95,
    tags: ['AC Installation', 'Heat Pumps', 'Ventilation'],
    photo: 'https://i.pravatar.cc/100?img=49'
  },
  {
    name: 'Ethan Brooks',
    job: 'Heating & Cooling Service Expert',
    category: 'HVAC Technician',
    rating: '4.8',
    reviews: 134,
    price: 88,
    tags: ['AC Repair', 'Furnace Service', 'Maintenance'],
    photo: 'https://i.pravatar.cc/100?img=14'
  },
  {
    name: 'Lerato Mokoena',
    job: 'Commercial HVAC Systems Technician',
    category: 'HVAC Technician',
    rating: '4.9',
    reviews: 66,
    price: 110,
    tags: ['Ductwork', 'Diagnostics', 'Commercial'],
    photo: 'https://i.pravatar.cc/100?img=45'
  },
  {
    name: 'Jacob Miles',
    job: 'Roof Repair & Waterproofing Pro',
    category: 'Roofer',
    rating: '4.9',
    reviews: 156,
    price: 86,
    tags: ['Leak Repair', 'Waterproofing', 'Tile Roofing'],
    photo: 'https://i.pravatar.cc/100?img=60'
  },
  {
    name: 'Thabo Dlamini',
    job: 'Residential Roofing Contractor',
    category: 'Roofer',
    rating: '4.8',
    reviews: 103,
    price: 92,
    tags: ['Roof Replacement', 'Gutters', 'Inspections'],
    photo: 'https://i.pravatar.cc/100?img=52'
  },
  {
    name: 'Nina Patel',
    job: 'Metal & Flat Roof Specialist',
    category: 'Roofer',
    rating: '4.7',
    reviews: 74,
    price: 89,
    tags: ['Flat Roofs', 'Metal Roofing', 'Storm Damage'],
    photo: 'https://i.pravatar.cc/100?img=44'
  },
  {
    name: 'Carlos Mendes',
    job: 'Reliable Home Repair Handyman',
    category: 'General Handyman',
    rating: '4.9',
    reviews: 119,
    price: 60,
    tags: ['Minor Repairs', 'Mounting', 'Home Maintenance'],
    photo: 'https://i.pravatar.cc/100?img=59'
  },
  {
    name: 'Aisha Williams',
    job: 'Multi-Skilled Home Services Pro',
    category: 'General Handyman',
    rating: '4.8',
    reviews: 87,
    price: 68,
    tags: ['Painting', 'Fixtures', 'Furniture Repair'],
    photo: 'https://i.pravatar.cc/100?img=37'
  },
  {
    name: 'Ben Carter',
    job: 'General Repairs & Installation',
    category: 'General Handyman',
    rating: '4.7',
    reviews: 98,
    price: 58,
    tags: ['Shelving', 'Door Repair', 'Caulking'],
    photo: 'https://i.pravatar.cc/100?img=8'
  }
]

const filteredProfessionals = computed(() => {
  const term = search.value.trim().toLowerCase()

  return professionals.filter((pro) =>
    (activeCategory.value === 'Plumber' ||
      pro.category === activeCategory.value) &&
    (!term ||
      `${pro.name} ${pro.job} ${pro.tags.join(' ')}`
        .toLowerCase()
        .includes(term))
  )
})

const priceFilteredProfessionals = computed(() => {
  const matchesPrice = filteredProfessionals.value.filter((pro) => {
    if (priceFilter.value === 'Best prices (under R75/hr)') {
      return pro.price <= 75
    }

    if (priceFilter.value === 'R76 – R90/hr') {
      return pro.price >= 76 && pro.price <= 90
    }

    if (priceFilter.value === 'R91+/hr') {
      return pro.price >= 91
    }

    return true
  })

  return priceFilter.value === 'All prices'
    ? matchesPrice
    : [...matchesPrice].sort((a, b) => a.price - b.price)
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
  <main id="home" class="directory-shell">
    <aside class="sidebar">
      <div class="brand">
        <span>YENZA!</span>
      </div>

      <p class="section-label">CATEGORY</p>

      <nav aria-label="Trade categories">
        <button
          v-for="category in categories"
          :key="category"
          class="category"
          :class="{ active: activeCategory === category }"
          @click="activeCategory = category"
        >
          {{ category }}
          <span>›</span>
        </button>
      </nav>
    </aside>

    <section id="services" class="content">
      <form class="search-bar" @submit.prevent>
        <span class="search-icon">⌕</span>

        <input
          v-model="search"
          type="search"
          placeholder="Search services..."
          aria-label="Search services"
        />

        <button>Search</button>
      </form>

      <p class="filter-label">QUICK FILTERS</p>

      <div class="filters">
        <button
          :class="{ selected: activeFilter === 'All' }"
          @click="activeFilter = 'All'"
        >
          All
        </button>

        <div class="price-filter">
          <button
            class="prices-button"
            :class="{ selected: priceFilter !== 'All prices' }"
            @click="priceMenuOpen = !priceMenuOpen"
          >
            Prices
            <span>▼</span>
          </button>

          <div v-if="priceMenuOpen" class="price-menu">
            <button
              v-for="option in priceOptions"
              :key="option"
              :class="{ active: priceFilter === option }"
              @click="priceFilter = option; priceMenuOpen = false"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <button
          v-for="filter in filters"
          :key="filter"
          :class="{ selected: activeFilter === filter }"
          @click="activeFilter = filter"
        >
          {{ filter }}
          <span v-if="filter !== 'All'">▼</span>
        </button>
      </div>

      <div class="results-heading">
        <h1>
          Available Handymen
          ({{ priceFilteredProfessionals.length }} results)
        </h1>

        <span>
          Sorted by:
          <strong>
            {{ priceFilter === 'All prices' ? 'Best Match' : 'Lowest Price' }}
          </strong>
        </span>
      </div>

      <div id="results" class="cards">
        <article
          v-for="pro in visibleProfessionals"
          :key="pro.name"
          class="professional-card"
        >
          <div class="pro-top">
            <img :src="pro.photo" :alt="pro.name" />

            <div class="pro-info">
              <h2>{{ pro.name }}</h2>

              <p>{{ pro.job }}</p>

              <small>
                <b>★</b>
                {{ pro.rating }}
                <span>({{ pro.reviews }} reviews)</span>
              </small>
            </div>

            <strong class="price">
              R{{ pro.price }}/hr
            </strong>
          </div>

          <div class="card-footer">
            <div class="tags">
              <span
                v-for="tag in pro.tags"
                :key="tag"
              >
                {{ tag }}
              </span>
            </div>

            <RouterLink
              class="profile-button"
              :to="{
                name: 'profile',
                params: {
                  slug: profileSlug(pro)
                }
              }"
            >
              View Profile&nbsp; →
            </RouterLink>
          </div>
        </article>

        <p
          v-if="!priceFilteredProfessionals.length"
          class="empty"
        >
          No handymen match your search.
        </p>
      </div>

      <div
        v-if="priceFilteredProfessionals.length > 3"
        id="bookings"
        class="view-more-wrap"
      >
        <button
          v-if="currentPage > 0"
          class="view-more"
          @click="currentPage -= 1"
        >
          ← Previous
        </button>

        <button
          v-if="(currentPage + 1) * 3 < priceFilteredProfessionals.length"
          class="view-more"
          @click="currentPage += 1"
        >
          View More →
        </button>
      </div>
    </section>

    <div
      v-if="selectedPro"
      class="toast"
      role="status"
    >
      Opening {{ selectedPro }}'s profile
    </div>
  </main>
</template>

<style scoped>
.directory-shell {
  display: flex;
  width: 100%;
  background: #f7f7f7;
}

.sidebar {
  width: 276px;
  flex: 0 0 276px;
  min-height: 100vh;
  background: #136e70;
  color: #dceeee;
  padding: 34px 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  color: white;
  font-weight: 700;
  font-size: 30px;
  margin-bottom: 24px;
}

.brand-icon {
  display: grid;
  place-items: center;
  width: 27px;
  height: 27px;
  border-radius: 5px;
  background: white;
  color: var(--teal);
  font-size: 19px;
  line-height: 1;
  transform: rotate(-38deg);
}

.section-label,
.filter-label {
  color: #66808b;
  font-size: 9px;
  font-weight: 700;
  margin: 0 0 7px;
}

.sidebar .section-label {
  color: #d1e8e8;
}

.category {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 14px;
  color: #d1e7e7;
  border: 0;
  border-radius: 5px;
  background: transparent;
  text-align: left;
  font-size: 15px;
}

.category span {
  font-size: 25px;
  color: #9dc8c8;
  line-height: 10px;
}

.category.active,
.category:hover {
  background: #075c5e;
  color: #fff;
}

.content {
  flex: 1;
  min-width: 0;
  padding: 31px 36px;
}

.search-bar {
  display: flex;
  align-items: center;
  height: 49px;
  gap: 11px;
  background: white;
  padding: 0 14px 0 18px;
  border: 1px solid #dce3e7;
  box-shadow: 0 2px 8px #122d3b14;
  border-radius: 7px;
}

.search-icon {
  color: var(--teal);
  font-size: 20px;
  transform: rotate(-35deg);
}

.search-bar input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  color: var(--ink);
  font-size: 15px;
}

.search-bar input::placeholder {
  color: #80919a;
}

.search-bar button,
.profile-button {
  border: 0;
  border-radius: 6px;
  background: #126d6d;
  color: #fff;
  font-weight: 700;
}

.search-bar button {
  width: 59px;
  height: 26px;
  font-size: 9px;
}

.filter-label {
  margin-top: 25px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filters>button,
.prices-button {
  height: 31px;
  padding: 0 13px;
  border: 0;
  border-radius: 17px;
  color: white;
  background: #126d6d;
  font-size: 12px;
  font-weight: 600;
}

.filters button span {
  margin-left: 3px;
  font-size: 14px;
}

.filters>button.selected,
.prices-button.selected {
  background: #074d50;
  box-shadow: inset 0 0 0 1px #197d7e;
}

.price-filter {
  position: relative;
}

.price-menu {
  position: absolute;
  z-index: 5;
  top: calc(100% + 7px);
  left: 0;
  width: 175px;
  overflow: hidden;
  border: 1px solid #dce5e6;
  border-radius: 7px;
  background: #fff;
  box-shadow: 0 5px 14px #15313722;
}

.price-menu button {
  display: block;
  width: 100%;
  padding: 9px 11px;
  border: 0;
  background: #fff;
  color: #24434c;
  font-size: 10px;
  text-align: left;
}

.price-menu button:hover,
.price-menu button.active {
  background: #e7f1f1;
  color: #075c5e;
  font-weight: 700;
}

.results-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  margin: 21px 0 15px;
}

.results-heading h1 {
  margin: 0;
  color: #102d39;
  font-size: 14px;
  font-weight: 700;
}

.results-heading span {
  color: #71818a;
  font-size: 10px;
}

.results-heading strong {
  color: #126d6d;
}

.cards {
  display: grid;
  gap: 12px;
}

.professional-card {
  min-height: 111px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2e8ea;
  border-radius: 12px;
  box-shadow: 0 1px 2px #152e3510;
}

.pro-top {
  position: relative;
  display: flex;
  align-items: center;
  gap: 13px;
  min-height: 69px;
  padding: 12px 17px;
}

.pro-top img {
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 50%;
  background: #d3d8d7;
}

.pro-info h2 {
  margin: 0;
  color: #123442;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.1;
}

.pro-info p {
  margin: 3px 0 2px;
  color: #126d6d;
  font-size: 10px;
  font-weight: 600;
}

.pro-info small {
  display: block;
  color: #344c57;
  font-size: 9px;
}

.pro-info small b {
  color: #f59d12;
}

.pro-info small span {
  color: #849399;
}

.price {
  position: absolute;
  right: 17px;
  top: 21px;
  color: #08646a;
  font-size: 15px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 41px;
  padding: 7px 17px;
  background: #fafcfc;
  border-top: 1px solid #edf1f2;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tags span {
  padding: 3px 7px;
  background: #e3eff0;
  border-radius: 4px;
  color: #1a6267;
  font-size: 10px;
  font-weight: 700;
}

.profile-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 91px;
  height: 25px;
  font-size: 8.2px;
  line-height: 1;
  text-decoration: none;
}

.profile-button:hover,
.search-bar button:hover {
  background: #075a5c;
}

.empty {
  padding: 24px;
  text-align: center;
  color: #71818a;
}

.toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  padding: 12px 17px;
  border-radius: 7px;
  background: #123e43;
  color: white;
  box-shadow: 0 5px 20px #0003;
}

.view-more-wrap {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 8px 0 2px;
}

.view-more {
  margin-top: 50px;
  min-width: 112px;
  height: 33px;
  border: 1px solid #126d6d;
  border-radius: 6px;
  background: #fff;
  color: #126d6d;
  font-size: 15x;
  font-weight: 700;
}

.view-more:hover {
  background: #e7f1f1;
}

@media (max-width: 700px) {
  .directory-shell {
    display: block;
  }

  .sidebar {
    width: 100%;
    min-height: auto;
    padding: 20px;
  }

  .sidebar nav {
    display: flex;
    overflow-x: auto;
    gap: 5px;
  }

  .category {
    width: auto;
    white-space: nowrap;
  }

  .category span {
    display: none;
  }

  .content {
    width: 100%;
    padding: 22px 18px;
  }

  .results-heading {
    align-items: flex-start;
    gap: 8px;
  }

  .results-heading span {
    text-align: right;
  }

  .price {
    right: 13px;
  }

  .card-footer {
    padding: 7px 12px;
  }

  .tags {
    max-width: 65%;
  }
}

@media (max-width: 768px) {
  .home-navbar {
    flex-direction: column;
    padding: 15px 24px;
  }

  .navbar-links {
    flex-direction: column;
    gap: 0;
    margin: 15px 0;
    text-align: center;
  }

  .navbar-links a {
    display: block;
    margin: 10px 0;
  }
}

.profile-page {
  display: flex;
  min-height: 100vh;
  background: #edf3f8;
  color: #172033;
}

.profile-sidebar {
  width: 205px;
  flex: 0 0 205px;
  min-height: 100vh;
  padding: 19px 16px;
  background: #136163;
  border-right: 1px solid #0d5557;
}

.profile-brand {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
}

.profile-brand span {
  display: grid;
  width: 23px;
  height: 23px;
  place-items: center;
  border-radius: 5px;
  background: #fff;
  color: #136163;
}

.profile-sidebar p {
  margin: 0 0 8px;
  color: #cfe9e9;
  font-size: 8px;
  font-weight: 700;
}

.side-link {
  display: block;
  width: 100%;
  margin: 2px 0;
  padding: 9px 11px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #eefafa;
  text-align: left;
  font-size: 10px;
}

.side-link.active,
.side-link:hover {
  background: #d9f1f0;
  color: #007a79;
  font-weight: 700;
}

.coverage {
  margin-top: 34px;
  padding: 15px 12px;
  border: 1px solid #dce9eb;
  background: #effafa;
  color: #536271;
  font-size: 9px;
  line-height: 1.45;
}

.coverage strong {
  color: #087e7b;
}

.profile-content {
  width: min(1020px, 100%);
  padding: 30px 32px 60px;
}

.back-link {
  margin: 0 0 12px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #087c7c;
  font-size: 11px;
  font-weight: 700;
}

.profile-hero {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 120px;
  padding: 20px 25px;
  border: 1px solid #dfe7ed;
  border-radius: 11px;
  background: #fff;
}

.profile-hero img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-hero h1 {
  margin: 0;
  font-size: 23px;
  line-height: 1.2;
}

.profile-hero h1 small {
  display: inline-block;
  padding: 2px 5px;
  border-radius: 3px;
  background: #d8f2f0;
  color: #087a79;
  font-size: 8px;
  vertical-align: middle;
}

.profile-hero h2 {
  margin: 5px 0;
  color: #007d7b;
  font-size: 12px;
}

.profile-hero p {
  margin: 0;
  color: #536276;
  font-size: 10px;
}

.profile-hero p b,
.review-head strong {
  color: #ef9800;
}

.profile-hero p span {
  margin: 0 10px;
}

.hourly {
  margin-left: auto;
  text-align: right;
  color: #536276;
  font-size: 10px;
}

.hourly small {
  display: block;
  font-size: 8px;
}

.hourly strong {
  color: #00827e;
  font-size: 24px;
}

.profile-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(235px, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.profile-main {
  display: grid;
  gap: 18px;
}

.profile-card,
.review-card {
  padding: 20px;
  border: 1px solid #dfe7ed;
  border-radius: 11px;
  background: #fff;
}

.profile-card h3,
.reviews h3 {
  margin: 0 0 14px;
  font-size: 15px;
}

.profile-card p {
  margin: 0;
  color: #4d5c70;
  font-size: 11px;
  line-height: 1.55;
}

.profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.profile-tags span {
  padding: 5px 9px;
  border-radius: 13px;
  background: #dff2f1;
  color: #087876;
  font-size: 9px;
  font-weight: 700;
}

.reviews h3 {
  margin-bottom: 10px;
}

.review-card {
  margin-bottom: 9px;
  padding: 13px;
}

.review-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-head>span {
  display: grid;
  width: 25px;
  height: 25px;
  place-items: center;
  border-radius: 50%;
  background: #def3f2;
  color: #087a78;
  font-size: 10px;
  font-weight: 700;
}

.review-head b,
.review-head small {
  display: block;
  font-size: 10px;
}

.review-head small {
  color: #7a8997;
  font-size: 8px;
}

.review-head strong {
  margin-left: auto;
  font-size: 11px;
}

.review-card p {
  margin: 10px 0 0;
  color: #526174;
  font-size: 10px;
  line-height: 1.45;
}

.booking-panel {
  display: grid;
  align-content: start;
  gap: 18px;
}

.booking-panel .profile-card {
  padding: 17px;
}

.booking-panel small {
  color: #657487;
  font-size: 8px;
}

.days {
  display: flex;
  justify-content: space-between;
  margin: 10px 0 14px;
}

.days b {
  min-width: 27px;
  padding: 6px 2px;
  border-radius: 5px;
  color: #4a5b70;
  font-size: 8px;
  text-align: center;
}

.days b:first-child,
.days b:last-child {
  background: #dff2f1;
  color: #087d7b;
}

.request-button,
.question-button {
  width: 100%;
  height: 32px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
}

.request-button {
  border: 0;
  background: #008581;
  color: #fff;
}

.question-button {
  margin-top: 8px;
  border: 1px solid #d9e2e8;
  background: #fff;
  color: #526174;
}

.secure {
  margin-top: 12px !important;
  color: #748294 !important;
  font-size: 8px !important;
  text-align: center;
}

.profile-not-found {
  display: grid;
  min-height: 100vh;
  place-content: center;
  gap: 15px;
  text-align: center;
}

.profile-not-found button {
  padding: 10px 15px;
  border: 0;
  border-radius: 6px;
  background: #087d7b;
  color: #fff;
}

@media (max-width: 760px) {
  .profile-page {
    display: block;
  }

  .profile-sidebar {
    width: 100%;
    min-height: auto;
  }

  .coverage {
    display: none;
  }

  .profile-content {
    padding: 20px 16px;
  }

  .profile-hero {
    align-items: flex-start;
  }

  .profile-hero h1 {
    font-size: 18px;
  }

  .hourly {
    position: absolute;
    right: 28px;
    margin-top: 66px;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }
}

.report-button {
  width: 100%;
  height: 32px;
  margin-top: 8px;
  border: 0;
  border-radius: 6px;
  background: #136163;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
}

.report-button:hover {
  background: #0d4f51;
}

.filters>button,
.prices-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.filters>button span,
.prices-button span {
  display: inline-flex;
  align-items: center;
  margin-left: 0;
  line-height: 1;
}

.brand,
.profile-brand,
.footer-brand {
  font-family: 'Jeju Hallasan', sans-serif !important;
}

.sidebar,
.home-navbar,
.filters>button,
.prices-button,
.search-bar button,
.profile-button,
.request-button,
.report-button,
.profile-not-found button {
  background: #136163;
}

.category.active,
.category:hover {
  background: #136163;
  outline: 1px solid #fff;
}

.filters>button.selected,
.prices-button.selected {
  background: #136163;
  box-shadow: inset 0 0 0 1px #fff;
}

.search-icon,
.pro-info p,
.price,
.results-heading strong,
.tags span,
.view-more,
.back-link,
.profile-hero h2,
.hourly strong,
.profile-tags span {
  color: #136163;
}

.view-more {
  border-color: #136163;
}

.profile-brand span {
  color: #136163;
}

.side-link.active,
.side-link:hover {
  background: #136163;
  color: #fff;
  outline: 1px solid #fff;
}

.profile-hero h1 small,
.profile-tags span {
  color: #136163;
}

.report-button:hover,
.request-button:hover,
.search-bar button:hover,
.profile-button:hover {
  background: #136163;
}
</style>