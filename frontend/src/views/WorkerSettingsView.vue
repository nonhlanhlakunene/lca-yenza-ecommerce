<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/api.js'

const router = useRouter()
const services = ref([])
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const form = ref({ first_name: '', last_name: '', email: '', phone: '', service_id: '', bio: '', experience_years: 0, hourly_rate: 0, address: '', city: '', province: '', postal_code: '', profile_image: '', availability_status: 'available' })

function authHeaders() { return { Authorization: `Bearer ${localStorage.getItem('token')}` } }

async function loadPage() {
  try {
    const [profileResponse, servicesResponse] = await Promise.all([
      api.get('/professionals/me', { headers: authHeaders() }),
      api.get('/categories')
    ])
    form.value = { ...form.value, ...profileResponse.data }
    services.value = servicesResponse.data.categories || []
  } catch (error) { message.value = error.response?.data?.message || 'Unable to load worker settings.' }
  finally { loading.value = false }
}

async function saveProfile() {
  saving.value = true; message.value = ''
  try {
    const { data } = await api.put('/professionals/me', form.value, { headers: authHeaders() })
    form.value = { ...form.value, ...data.professional }
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    localStorage.setItem('user', JSON.stringify({ ...user, first_name: form.value.first_name, last_name: form.value.last_name, email: form.value.email }))
    message.value = 'Your worker profile has been saved.'
  } catch (error) { message.value = error.response?.data?.message || 'Unable to save worker profile.' }
  finally { saving.value = false }
}

onMounted(loadPage)
</script>

<template>
  <main class="page"><section class="card"><button class="back" @click="router.push('/worker')">← Back to dashboard</button><header><p>WORKER PROFILE</p><h1>Business settings</h1><span>Control the details customers see on your public profile.</span></header><p v-if="loading" class="state">Loading profile…</p><form v-else @submit.prevent="saveProfile">
    <fieldset><legend>Personal & business details</legend><div class="grid"><label>First name<input v-model.trim="form.first_name" required /></label><label>Last name<input v-model.trim="form.last_name" required /></label><label>Email<input v-model.trim="form.email" type="email" required /></label><label>Phone<input v-model.trim="form.phone" type="tel" /></label><label>Primary service<select v-model="form.service_id" required><option disabled value="">Select service</option><option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option></select></label><label>Availability<select v-model="form.availability_status"><option value="available">Available</option><option value="busy">Busy</option><option value="unavailable">Unavailable</option></select></label><label>Hourly rate (ZAR)<input v-model.number="form.hourly_rate" type="number" min="0" step="0.01" required /></label><label>Years of experience<input v-model.number="form.experience_years" type="number" min="0" required /></label><label class="full">About your business<textarea v-model.trim="form.bio" rows="5" placeholder="Tell customers about your experience, approach, and services."></textarea></label></div></fieldset>
    <fieldset><legend>Service area address</legend><div class="grid"><label class="full">Address<input v-model.trim="form.address" placeholder="Street address" /></label><label>City<input v-model.trim="form.city" /></label><label>Province<input v-model.trim="form.province" /></label><label>Postal code<input v-model.trim="form.postal_code" /></label></div></fieldset>
    <p v-if="message" class="message" :class="{ success: message === 'Your worker profile has been saved.' }">{{ message }}</p><button class="save" :disabled="saving">{{ saving ? 'Saving…' : 'Save worker profile' }}</button>
  </form></section></main>
</template>

<style scoped>
.page{min-height:100vh;padding:32px clamp(20px,5vw,88px);background:#f2f6f6}.card{width:100%;max-width:1320px;margin:auto;padding:clamp(32px,4vw,58px);border-radius:16px;background:#fff;box-shadow:0 5px 20px #123a3d14}.back{margin-bottom:25px;border:0;background:transparent;color:#136163;font-weight:800;cursor:pointer}header{margin-bottom:30px}header p{margin:0;color:#136163;font-size:12px;font-weight:800;letter-spacing:.08em}h1{margin:4px 0;color:#153942;font-size:30px}header span,.hint{color:#71858d;font-size:13px}fieldset{margin:0 0 27px;padding:0;border:0}legend{margin-bottom:14px;color:#153942;font-size:17px;font-weight:800}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px 24px}label{display:grid;gap:6px;color:#3d5760;font-size:13px;font-weight:700}input,select,textarea{width:100%;padding:13px;border:1px solid #cbd9db;border-radius:7px;color:#153942;font:inherit;font-weight:400;outline:0}textarea{resize:vertical}input:focus,select:focus,textarea:focus{border-color:#136163;box-shadow:0 0 0 3px #1361631c}.full{grid-column:1/-1}.image-row{display:flex;align-items:center;gap:18px}.image-row img,.placeholder{width:82px;height:82px;border-radius:50%;object-fit:cover}.placeholder{display:grid;place-items:center;background:#dff2f1;color:#136163;font-size:25px;font-weight:800}.image-row label{flex:1}.message{color:#ad342c}.message.success{color:#167144}.save{padding:12px 18px;border:0;border-radius:7px;background:#136163;color:#fff;font-weight:800;cursor:pointer}.save:disabled{opacity:.65}@media(max-width:600px){.page{padding:22px 14px}.card{padding:24px 18px}.grid{grid-template-columns:1fr}.full{grid-column:auto}.image-row{align-items:flex-start;flex-direction:column}}
</style>
