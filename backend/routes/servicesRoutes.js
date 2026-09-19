import express from 'express'

import {
    getCategories,
    getProfessionalBySlug,
    getProfessionals
} from '../controllers/servicesController.js'

const router = express.Router()

router.get(
    '/categories',
    getCategories
)

router.get(
    '/professionals',
    getProfessionals
)

router.get(
    '/professionals/:slug',
    getProfessionalBySlug
)

export default router