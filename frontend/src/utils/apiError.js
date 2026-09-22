import Swal from 'sweetalert2'

export function showApiError(err) {
    let title = 'Something went wrong'
    let text = 'Please try again.'

    if (!err.response) {
        if (!navigator.onLine) {
            title = 'No Internet Connection'
            text = 'You appear to be offline. Please check your network and try again.'
        } else {
            title = 'Cannot Reach Server'
            text = 'The server is not responding. Please try again in a moment.'
        }
    } else {
        const status = err.response.status
        const serverMessage = err.response.data?.message

        if (status === 400 || status === 409) {
            title = 'Invalid Input'
            text = serverMessage || 'Please check your input and try again.'
        } else if (status === 401) {
            title = 'Login Failed'
            text = serverMessage || 'Wrong email or password.'
        } else if (status === 403) {
            title = 'Not Allowed'
            text = serverMessage || 'You do not have permission for this action.'
        } else if (status === 404) {
            title = 'Not Found'
            text = serverMessage || 'The requested item no longer exists.'
        } else if (status >= 500) {
            title = 'Server Error'
            text = 'Something went wrong on our side. Please try again later.'
        } else {
            text = serverMessage || 'An unexpected error occurred.'
        }
    }

    Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonColor: '#136163'
    })
}