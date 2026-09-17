import api from './api'

export const createReview = async (reviewData) => {
    const response = await api.post('/reviews', reviewData)
    return response.data
}

