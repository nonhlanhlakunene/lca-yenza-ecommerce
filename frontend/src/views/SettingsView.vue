<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({ first_name: '', last_name: '', email: '', phone: '', address_line1: '', address_line2: '', city: '', province: '', postal_code: '' })
const loading = ref(true)
const saving = ref(false)
const message = ref('')

function headers() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
}

async function readJson(response) {
  const body = await response.text()
  try { return body ? JSON.parse(body) : {} } catch { return { message: 'The server returned an invalid response.' } }
}

function handleUnauthorised(response) {
  if (response.status !== 401) return false
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push({ path: '/login', query: { redirect: '/settings' } })
  return true
}

function updateStoredUser(settings) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  localStorage.setItem('user', JSON.stringify({ ...user, first_name: settings.first_name, last_name: settings.last_name, email: settings.email, role: settings.role || user.role }))
}

async function loadSettings() {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Please log in to view your settings.')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/settings/me`, { headers: headers() })
    if (handleUnauthorised(response)) return
    const data = await readJson(response)
    if (!response.ok) throw new Error(data.message)
    form.value = { ...form.value, ...data.settings }
  } catch (error) {
    message.value = error.message || 'Unable to load your settings.'
  } finally {
    loading.value = false
  }
}

async function saveSettings() {
  saving.value = true
  message.value = ''
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/settings/me`, { method: 'PUT', headers: headers(), body: JSON.stringify(form.value) })
    if (handleUnauthorised(response)) return
    const data = await readJson(response)
    if (!response.ok) throw new Error(data.message)
    form.value = { ...form.value, ...data.settings }
    updateStoredUser(data.settings)
    message.value = 'Your settings have been saved.'
  } catch (error) {
    message.value = error.message || 'Unable to save your settings.'
  } finally {
    saving.value = false
  }
}

onMounted(loadSettings)
</script>

<template>
  <main class="settings-page">
    <section class="settings-card">
      <header><p>ACCOUNT</p><h1>Settings</h1><span>Keep your contact and default service address up to date.</span></header>
      <p v-if="loading" class="state">Loading your settings…</p>
      <form v-else @submit.prevent="saveSettings">
        <fieldset><legend>Personal details</legend><div class="form-grid"><label>First name<input v-model.trim="form.first_name" required /></label><label>Last name<input v-model.trim="form.last_name" required /></label><label>Email address<input v-model.trim="form.email" type="email" required /></label><label>Phone number<input v-model.trim="form.phone" type="tel" placeholder="e.g. 082 123 4567" /></label></div></fieldset>
        <fieldset><legend>Default service address</legend><p class="hint">Used to make booking faster. You can still change it for each booking.</p><div class="form-grid"><label class="full">Address line 1<input v-model.trim="form.address_line1" placeholder="Street number and name" /></label><label class="full">Address line 2 <span>(optional)</span><input v-model.trim="form.address_line2" placeholder="Apartment, suburb, or complex" /></label><label>City<input v-model.trim="form.city" placeholder="Cape Town" /></label><label>Province<input v-model.trim="form.province" placeholder="Western Cape" /></label><label>Postal code<input v-model.trim="form.postal_code" placeholder="8001" /></label></div></fieldset>
        <p v-if="message" class="message" :class="{ success: message === 'Your settings have been saved.' }">{{ message }}</p>
        <button v-if="message && message !== 'Your settings have been saved.'" class="retry-button" type="button" @click="loadSettings">Try again</button>
        <button class="save-button" type="submit" :disabled="saving">{{ saving ? 'Saving…' : 'Save changes' }}</button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.settings-page { min-height:calc(100vh - 130px); padding:48px 24px; background:#f4f7f7; }.settings-card { width:min(780px,100%); margin:auto; padding:34px; border:1px solid #dce6e6; border-radius:15px; background:#fff; box-shadow:0 4px 18px #14383c10; } header { margin-bottom:28px; } header p { margin:0 0 4px; color:#136163; font-size:12px; font-weight:800; letter-spacing:.08em; } h1 { margin:0; color:#143842; font-size:30px; } header span,.hint { color:#667b84; font-size:14px; } fieldset { margin:0 0 25px; padding:0; border:0; } legend { margin-bottom:14px; color:#143842; font-size:17px; font-weight:800; }.hint { margin:-5px 0 15px; }.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; } label { display:grid; gap:6px; color:#344e58; font-size:13px; font-weight:700; } label span { color:#84959b; font-weight:400; } input { width:100%; padding:11px 12px; border:1px solid #ccd9dc; border-radius:7px; color:#16343c; font:inherit; font-weight:400; outline:none; } input:focus { border-color:#136163; box-shadow:0 0 0 3px #1361631f; }.full { grid-column:1 / -1; }.message { margin:0 0 12px; color:#ad342c; font-size:14px; }.message.success { color:#167144; }.retry-button { margin:0 10px 15px 0; padding:8px 12px; border:1px solid #136163; border-radius:6px; background:#fff; color:#136163; font-weight:700; cursor:pointer; }.save-button { min-width:145px; padding:12px 18px; border:0; border-radius:7px; background:#136163; color:#fff; font-weight:800; cursor:pointer; }.save-button:disabled { opacity:.65; cursor:wait; }.state { color:#667b84; text-align:center; } @media (max-width:600px) { .settings-page { padding:24px 15px; }.settings-card { padding:24px 18px; }.form-grid { grid-template-columns:1fr; }.full { grid-column:auto; } }
</style>
