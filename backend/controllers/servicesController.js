import {
    findAllCategories,
    findProfessionalBySlug,
    findProfessionals
} from '../models/servicesModels.js'

function slugify(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function formatProfessional(row) {
    return {
        id: row.id,
        name: row.full_name,
        job: row.job_title,
        category: row.category,
        rating: Number(row.rating),
        reviews: row.review_count,
        price: Number(row.hourly_rate_zar),
        tags: row.services ? row.services.split(', ') : [],
        slug: slugify(row.full_name)
    }
}

function parsePagination(query) {
    const page = Math.max(Number.parseInt(query.page, 10) || 1, 1)
    const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 3, 1), 50)
    return { page, limit }
}

function parseOptionalPrice(value, name) {
    if (value === undefined || value === '') return undefined
    const price = Number(value)
    if (!Number.isFinite(price) || price < 0) {
        const error = new Error(`${name} must be a non-negative number`)
        error.statusCode = 400
        throw error
    }
    return price
}

export async function getCategories(_req, res) {
    try {
        const categories = await findAllCategories()
        res.json({ success: true, categories })
    } catch (error) {
        console.error('Get categories error:', error)
        res.status(500).json({ success: false, message: 'Failed to retrieve categories' })
    }
}

export async function getProfessionals(req, res) {
    try {
        const { page, limit } = parsePagination(req.query)
        const { rows, total } = await findProfessionals({
            category: req.query.category?.trim() || undefined,
            search: req.query.search?.trim() || undefined,
            minPrice: parseOptionalPrice(req.query.minPrice, 'minPrice'),
            maxPrice: parseOptionalPrice(req.query.maxPrice, 'maxPrice'),
            sort: req.query.sort,
            page,
            limit
        })

        res.json({
            success: true,
            professionals: rows.map(formatProfessional),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        })
    } catch (error) {
        console.error('Get professionals error:', error)
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : 'Failed to retrieve professionals'
        })
    }
}

export async function getProfessionalBySlug(req, res) {
    try {
        const professional = await findProfessionalBySlug(req.params.slug)
        if (!professional) {
            return res.status(404).json({ success: false, message: 'Professional not found' })
        }
        res.json({ success: true, professional: formatProfessional(professional) })
    } catch (error) {
        console.error('Get professional error:', error)
        res.status(500).json({ success: false, message: 'Failed to retrieve professional' })
    }
}
