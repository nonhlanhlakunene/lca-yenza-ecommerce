import db from '../config/db.js'

const professionalFields = `
    h.id,
    h.full_name,
    h.job_title,
    c.name AS category,
    h.rating,
    h.review_count,
    h.hourly_rate_zar,
    GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR ', ') AS services
`

const professionalJoins = `
    FROM handymen h
    INNER JOIN categories c ON c.id = h.category_id
    LEFT JOIN handyman_services hs ON hs.handyman_id = h.id
    LEFT JOIN services s ON s.id = hs.service_id
`

const professionalGroupBy = `
    GROUP BY h.id, h.full_name, h.job_title, c.name,
             h.rating, h.review_count, h.hourly_rate_zar
`

function buildFilters({ category, search, minPrice, maxPrice }) {
    const conditions = []
    const values = []

    if (category) {
        conditions.push('c.name = ?')
        values.push(category)
    }

    if (search) {
        const term = `%${search}%`
        conditions.push(`(
            h.full_name LIKE ?
            OR h.job_title LIKE ?
            OR EXISTS (
                SELECT 1
                FROM handyman_services search_hs
                INNER JOIN services search_s ON search_s.id = search_hs.service_id
                WHERE search_hs.handyman_id = h.id AND search_s.name LIKE ?
            )
        )`)
        values.push(term, term, term)
    }

    if (minPrice !== undefined) {
        conditions.push('h.hourly_rate_zar >= ?')
        values.push(minPrice)
    }
    if (maxPrice !== undefined) {
        conditions.push('h.hourly_rate_zar <= ?')
        values.push(maxPrice)
    }

    return { where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', values }
}

function orderBy(sort) {
    const options = {
        'best-match': 'h.rating DESC, h.review_count DESC',
        'price-asc': 'h.hourly_rate_zar ASC, h.rating DESC',
        'price-desc': 'h.hourly_rate_zar DESC, h.rating DESC',
        rating: 'h.rating DESC, h.review_count DESC',
        reviews: 'h.review_count DESC, h.rating DESC'
    }

    return options[sort] || options['best-match']
}

export async function findAllCategories() {
    const [rows] = await db.execute('SELECT id, name FROM categories ORDER BY name ASC')
    return rows
}

export async function findProfessionals({ category, search, minPrice, maxPrice, sort, page, limit }) {
    const { where, values } = buildFilters({ category, search, minPrice, maxPrice })

    const [countRows] = await db.execute(
        `SELECT COUNT(DISTINCT h.id) AS total
         FROM handymen h
         INNER JOIN categories c ON c.id = h.category_id
         ${where}`,
        values
    )

    const [rows] = await db.execute(
        `SELECT ${professionalFields}
         ${professionalJoins}
         ${where}
         ${professionalGroupBy}
         ORDER BY ${orderBy(sort)}
         LIMIT ? OFFSET ?`,
        [...values, limit, (page - 1) * limit]
    )

    return { rows, total: countRows[0].total }
}

export async function findProfessionalBySlug(slug) {
    const [rows] = await db.execute(
        `SELECT ${professionalFields}
         ${professionalJoins}
         WHERE LOWER(REPLACE(h.full_name, ' ', '-')) = ?
         ${professionalGroupBy}`,
        [slug.toLowerCase()]
    )

    return rows[0] || null
}
