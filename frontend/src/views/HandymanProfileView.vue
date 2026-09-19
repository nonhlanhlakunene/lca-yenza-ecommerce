<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ReportPopup from '../components/ReportPopup.vue'
import api from '../api/api.js'

const route = useRoute()
const router = useRouter()

const pro = ref(null)
const loading = ref(true)
const errorMessage = ref('')
const showReport = ref(false)

const fromAdmin = computed(() => route.query.fromAdmin === 'true')

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}

async function loadProfessional() {
  loading.value = true
  errorMessage.value = ''
  pro.value = null

  try {
    const { data } = await api.get(
      `/professionals/${encodeURIComponent(route.params.slug)}`
    )

    pro.value = data.professional
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      'Unable to load this profile. Please try again.'
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.slug,
  loadProfessional,
  { immediate: true }
)
</script>

<template>
  <main v-if="loading" class="profile-state">
    Loading profile…
  </main>

  <main v-else-if="!pro" class="profile-state">
    <h1>{{ errorMessage || 'Profile not found' }}</h1>
    <button @click="router.push('/services')">
      Return to handymen
    </button>
  </main>

  <main v-else class="profile-page">
    <aside class="profile-sidebar">
      <button
        class="profile-brand"
        @click="router.push('/')"
      >
        YENZA!
      </button>

      <p>CATEGORIES</p>

      <button
        class="side-link"
        @click="router.push('/services')"
      >
        ▦ All Craftsmen
      </button>

      <button class="side-link active">
        ⌂ {{ pro.job }}
      </button>

      <button
        class="side-link"
        @click="router.push('/bookings')"
      >
        ▣ My Bookings
      </button>
    </aside>

    <section class="profile-content">
      <button
        class="back-link"
        @click="fromAdmin ? router.push('/admin') : router.push('/services')">
        ← {{ fromAdmin ? 'Back' : 'Back to handymen' }}
      </button>



      <header class="profile-hero">
        <img
          v-if="pro.photo"
          :src="pro.photo"
          :alt="pro.name"
        />

        <div
          v-else
          class="avatar"
          aria-hidden="true"
        >
          {{ initials(pro.name) }}
        </div>

        <div>
          <h1>{{ pro.name }}</h1>

          <h2>{{ pro.job }}</h2>

          <p>
            <b>★</b>
            {{ pro.rating }}
            ({{ pro.reviews }} reviews)
          </p>
        </div>

        <div class="hourly">
          <small>HOURLY RATE</small>
          <strong>R{{ pro.price }}</strong>/hr
        </div>
      </header>

      <div class="profile-grid">
        <article class="profile-card">
          <h3>Services & Specialties</h3>

          <div class="profile-tags">
            <span
              v-for="tag in pro.tags"
              :key="tag"
            >
              {{ tag }}
            </span>
          </div>

          <div class="description-section">
            <h4>Description</h4>

            <p v-if="pro.bio">
              {{ pro.bio }}
            </p>

            <p
              v-else
              class="no-description"
            >
              No description has been provided by this professional.
            </p>
          </div>
        </article>

        <aside class="booking-panel">
          <article class="profile-card">
            <h3>Book this professional</h3>

            <RouterLink
              class="request-button"
              :to="{
                name: 'book',
                params: { slug: pro.slug }
              }"
            >
              Request Booking
            </RouterLink>

            <button
              class="report-button"
              @click="showReport = true"
            >
              Report
            </button>
          </article>
        </aside>
      </div>
    </section>

    <ReportPopup
      v-if="showReport"
      :personName="pro.name"
      personType="Worker"
      bookingId="—"
      date="—"
      @close="showReport = false"
    />
  </main>
</template>

<style scoped>
.profile-page {
  display: flex;
  min-height: 100vh;
  background: #edf3f8;
  color: #172033;
}

.profile-sidebar {
  width: 276px;
  flex: 0 0 205px;
  padding: 20px 16px;
  background: #136163;
  color: #fff;
}

.profile-brand {
  margin-bottom: 32px;
  border: 0;
  background: transparent;
  color: #fff;
  font-family: 'JejuHallasan', sans-serif;
  font-size: 50px;
  cursor: pointer;
}

.profile-sidebar p {
  margin: 0 0 8px;
  color: #cfe9e9;
  font-size: 10px;
  font-weight: 700;
}

.side-link {
  display: block;
  width: 100%;
  margin: 3px 0;
  padding: 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #eefafa;
  text-align: left;
  cursor: pointer;
}

.side-link.active,
.side-link:hover {
  background: #0c5052;
  color: #fff;
}

.profile-content {
  width: min(1020px, 100%);
  padding: 30px 32px;
}

.back-link {
  margin-bottom: 12px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #136163;
  font-weight: 700;
  cursor: pointer;
}

.profile-hero {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px 25px;
  border: 1px solid #dfe7ed;
  border-radius: 11px;
  background: #fff;
}

.profile-hero img,
.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar {
  display: grid;
  place-items: center;
  background: #dff2f1;
  color: #136163;
  font-weight: 700;
}

.profile-hero h1 {
  margin: 0;
  font-size: 24px;
}

.profile-hero h2 {
  margin: 5px 0;
  color: #136163;
  font-size: 14px;
}

.profile-hero p {
  margin: 0;
  color: #536276;
  font-size: 12px;
}

.profile-hero b {
  color: #ef9800;
}

.hourly {
  margin-left: auto;
  text-align: right;
  color: #536276;
}

.hourly small {
  display: block;
  font-size: 10px;
}

.hourly strong {
  color: #136163;
  font-size: 26px;
}

.profile-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(235px, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.profile-card {
  padding: 20px;
  border: 1px solid #dfe7ed;
  border-radius: 11px;
  background: #fff;
}

.profile-card h3 {
  margin: 0 0 14px;
  font-size: 16px;
}

.profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.profile-tags span {
  padding: 6px 10px;
  border-radius: 13px;
  background: #dff2f1;
  color: #136163;
  font-size: 11px;
  font-weight: 700;
}

.description-section {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #e5ebef;
}

.description-section h4 {
  margin: 0 0 8px;
  color: #172033;
  font-size: 14px;
}

.description-section p {
  margin: 0;
  color: #536276;
  font-size: 13px;
  line-height: 1.7;
}

.description-section .no-description {
  color: #8a96a5;
  font-style: italic;
}

.request-button,
.report-button {
  display: flex;
  width: 100%;
  height: 34px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 6px;
  background: #136163;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}

.request-button:hover,
.report-button:hover {
  background: #0c5052;
}

.report-button {
  margin-top: 9px;
  cursor: pointer;
}

.profile-state {
  display: grid;
  min-height: 100vh;
  place-content: center;
  gap: 15px;
  text-align: center;
}

.profile-state button {
  padding: 10px 15px;
  border: 0;
  border-radius: 6px;
  background: #136163;
  color: #fff;
  cursor: pointer;
}

@media (max-width: 760px) {
  .profile-page {
    display: block;
  }

  .profile-sidebar {
    width: 100%;
  }

  .profile-content {
    padding: 20px 16px;
  }

  .profile-hero {
    align-items: flex-start;
  }

  .hourly {
    margin-left: auto;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
