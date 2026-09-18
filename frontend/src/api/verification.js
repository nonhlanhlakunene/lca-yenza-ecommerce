import api from './api'

export const submitExperience= async (data) => {
    const response = await api.post('/verifications/experience', data)
    return response.data
}