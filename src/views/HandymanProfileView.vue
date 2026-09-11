<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { professionals } from '../data/professionals'

const route = useRoute()
const router = useRouter()
const reportSent = ref(false)
const pro = computed(() => professionals.find((person) => person.slug === route.params.slug))
const reviews = computed(() => pro.value ? [
  { name: 'David G.', date: '2 days ago', text: `${pro.value.name.split(' ')[0]} was punctual, professional, and completed the work exactly as promised.` },
  { name: 'Melanie T.', date: '1 week ago', text: `Excellent service. I would happily recommend ${pro.value.name.split(' ')[0]} to friends and family.` },
  { name: 'James L.', date: '3 weeks ago', text: `Great workmanship and clear communication from start to finish.` },
] : [])
</script>

<template>
  <main v-if="pro" class="profile-page">
    <aside class="profile-sidebar">
      <button class="profile-brand" @click="router.push('/')">YENZA!</button>
      <p>CATEGORIES</p>
      <button class="side-link" @click="router.push('/')">▦ All Craftsmen</button>
      <button class="side-link active">⌂ {{ pro.category }}</button>
      <button class="side-link" @click="router.push('/')">▣ My Bookings</button>
      <div class="coverage"><strong>Need insurance cover?</strong><br />All bookings are protected by our service guarantee.</div>
    </aside>
    <section class="profile-content">
      <button class="back-link" @click="router.push('/')">← Back to handymen</button>
      <header class="profile-hero"><img :src="pro.photo" :alt="pro.name" /><div><h1>{{ pro.name }} <small>✓ VERIFIED</small></h1><h2>{{ pro.job }}</h2><p><b>★</b> {{ pro.rating }} ({{ pro.reviews }} reviews) <span>│</span> ▣ 5+ years experience</p></div><div class="hourly"><small>HOURLY RATE</small><strong>R{{ pro.price }}</strong>/hr</div></header>
      <div class="profile-grid"><div class="profile-main"><article class="profile-card"><h3>About Me</h3><p>Experienced {{ pro.category.toLowerCase() }} serving local homes and businesses. Known for reliable service, careful workmanship, and clear communication from the first call to completion.</p></article><article class="profile-card"><h3>Services & Specialties</h3><div class="profile-tags"><span v-for="tag in pro.tags" :key="tag">{{ tag }}</span></div></article><section class="reviews"><h3>Recent Reviews</h3><article v-for="review in reviews" :key="review.name" class="review-card"><div class="review-head"><span>{{ review.name.charAt(0) }}</span><div><b>{{ review.name }}</b><small>{{ review.date }}</small></div><strong>★★★★★</strong></div><p>{{ review.text }}</p></article></section></div><aside class="booking-panel"><article class="profile-card"><h3>Availability & Booking</h3><small>NEXT AVAILABLE DAYS</small><div class="days"><b>Mon<br />15</b><b>Tue<br />16</b><b>Wed<br />17</b><b>Thu<br />18</b><b>Fri<br />19</b></div><button class="request-button">Request Booking</button><button class="question-button">Inquire / Ask a Question</button><button class="report-button" @click="reportSent = true">{{ reportSent ? 'Report Submitted' : 'Report' }}</button><p class="secure">Book safely. No charges are made until job completion.</p></article><article class="profile-card"><h3>Contact & Service Area</h3><p>⌖ Tri-State Area / Metro<br />☏ (555) 382-9011<br />✉ {{ pro.name.toLowerCase().replace(' ', '.') }}@craftsmanlink.net</p></article></aside></div>
    </section>
  </main>
  <main v-else class="profile-not-found"><h1>Profile not found</h1><button @click="router.push('/')">Return to handymen</button></main>
</template>
