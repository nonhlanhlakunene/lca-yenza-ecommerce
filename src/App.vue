<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
</script>

<template>
    <NavBar v-if="$route.path !== '/login' && $route.path !== '/signup'" />
  <div id="app">

    <RouterView />

    <HandymanProfileView v-if="route.name === 'profile'" />
  <template v-else>
  <!-- <nav class="home-navbar" aria-label="Main navigation">
    <ul class="navbar-links">
      <li><a href="#home">Home</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="/about">About Us</a></li>
      <li><a href="#results">Reviews</a></li>
      <li><a href="#bookings">Bookings</a></li>
      <li><a href="mailto:hello@yenza.co.za">Contact</a></li>
    </ul>
  </nav> -->
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

    <Footer />
  </div>
</template>




<style>
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
    height: auto !important;
    /* overflow-x: hidden !important;
    overflow-y: auto !important; */
}

#app {
    width: 100%;
    min-height: 100vh;
    height: auto !important;
    /* overflow: visible !important; */
}
</style>
