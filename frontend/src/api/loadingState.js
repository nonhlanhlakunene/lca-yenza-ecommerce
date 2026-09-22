import { ref } from 'vue'

export const isLoading = ref(false)

let activeRequests = 0
let loadingTimer = null

export function startLoading() {
    activeRequests++

    // Wait 300ms before showing the spinner
    if (!loadingTimer && !isLoading.value) {
        loadingTimer = setTimeout(() => {
            if (activeRequests > 0) {
                isLoading.value = true
            }
            loadingTimer = null
        }, 300)
    }
}

export function stopLoading() {
    activeRequests--

    if (activeRequests <= 0) {
        activeRequests = 0

        if (loadingTimer) {
            clearTimeout(loadingTimer)
            loadingTimer = null
        }

        isLoading.value = false
    }
}