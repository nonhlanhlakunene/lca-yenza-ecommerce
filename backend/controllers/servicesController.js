import {
    findAllCategories,
    findProfessionalBySlug,
    findProfessionals
} from '../models/servicesModels.js'

function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

function formatProfessional(row) {
    return {
        id: row.id,
        user_id: row.user_id,
        name: row.full_name,
        job: row.service_name || 'Professional',
        service: row.service_name || '',
        bio: row.bio || '',
        experience: Number(row.experience_years || 0),
        price: Number(row.hourly_rate || 0),
        city: row.city || '',
        province: row.province || '',
        photo: row.profile_image || null,
        profile_image: row.profile_image || null,
        rating: Number(row.rating || 0),
        reviews: Number(row.review_count || 0),
        tags: row.service_name
            ? [row.service_name]
            : [],
        verification_status: row.verification_status,
        availability_status: row.availability_status,
        slug: slugify(row.full_name)
    }
}

function parseOptionalPrice(value, name) {
    if (value === undefined || value === '') {
        return undefined
    }

    const price = Number(value)

    if (!Number.isFinite(price) || price < 0) {
        const error = new Error(
            `${name} must be a non-negative number`
        )

        error.statusCode = 400

        throw error
    }

    return price
}

export async function getCategories(req, res) {
    try {
        const categories = await findAllCategories()

        res.json({
            success: true,
            categories
        })
    } catch (error) {
        console.error('Get categories error:', error)

        res.status(500).json({
            success: false,
            message: 'Failed to retrieve categories'
        })
    }
}

export async function getProfessionals(req, res) {
    try {
        const rows = await findProfessionals({
            category: req.query.category?.trim() || undefined,
            search: req.query.search?.trim() || undefined,
            minPrice: parseOptionalPrice(
                req.query.minPrice,
                'minPrice'
            ),
            maxPrice: parseOptionalPrice(
                req.query.maxPrice,
                'maxPrice'
            ),
            sort: req.query.sort
        })

        const professionals = rows.map(formatProfessional)

        res.json({
            success: true,
            professionals,
            total: professionals.length
        })
    } catch (error) {
        console.error('Get professionals error:', error)

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode
                ? error.message
                : 'Failed to retrieve professionals'
        })
    }
}

export async function getProfessionalBySlug(req, res) {
    try {
        const professional = await findProfessionalBySlug(
            req.params.slug
        )

        if (!professional) {
            return res.status(404).json({
                success: false,
                message: 'Professional not found'
            })
        }

        res.json({
            success: true,
            professional: formatProfessional(professional)
        })
    } catch (error) {
        console.error('Get professional error:', error)

        res.status(500).json({
            success: false,
            message: 'Failed to retrieve professional'
        })
    }
}
