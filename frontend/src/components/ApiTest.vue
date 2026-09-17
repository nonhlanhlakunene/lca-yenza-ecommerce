<template>
    <div>
        <h1>Temporary API Test File</h1>

        <p v-if="loading">
            Testing API connection...
        </p>

        <p v-else-if="error">
            {{  error  }}
        </p>

        <div v-else>
            <p>API connection successful</p>
            <pre>{{  result  }}</pre>
        </div>

    </div>
</template>


<script setup>
import { onMounted, ref } from 'vue'
import api from '@/api/api.js'

const loading = ref(true)
const error = ref('')
const result = ref(null)

async function testApi() {
    try {
        const response = await api.get('/health')

        result.value = response.data
    } catch (err) {
        console.error('API test failed:', err)

        error.value = 'Could not connect to the backend.'
    }   finally {
        loading.value = false
    }
}

onMounted(() => {
    testApi()
})
</script>
