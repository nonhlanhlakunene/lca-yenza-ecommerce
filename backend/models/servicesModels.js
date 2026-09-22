import db from '../config/db.js'

function buildFilters({ category, search, minPrice, maxPrice }) {
    const conditions = []
    const values = []

    if (category) {
        conditions.push(`
            (
                s.name LIKE ?
                OR p.bio LIKE ?
            )
        `)

        const term = `%${category}%`
        values.push(term, term)
    }

    if (search) {
        const term = `%${search}%`

        conditions.push(`
            (
                u.first_name LIKE ?
                OR u.last_name LIKE ?
                OR CONCAT(u.first_name, ' ', u.last_name) LIKE ?
                OR s.name LIKE ?
                OR p.bio LIKE ?
            )
        `)

        values.push(
            term,
            term,
            term,
            term,
            term
        )
    }

    if (minPrice !== undefined) {
        conditions.push('p.hourly_rate >= ?')
        values.push(minPrice)
    }

    if (maxPrice !== undefined) {
        conditions.push('p.hourly_rate <= ?')
        values.push(maxPrice)
    }

    return {
        where: conditions.length
            ? `WHERE ${conditions.join(' AND ')}`
            : '',
        values
    }
}

function orderBy(sort) {
    const options = {
        'best-match': 'p.professional_id ASC',
        'price-asc': 'p.hourly_rate ASC',
        'price-desc': 'p.hourly_rate DESC',
        rating: 'rating DESC',
        reviews: 'review_count DESC'
    }

    return options[sort] || options['best-match']
}

export async function findAllCategories() {
    const [rows] = await db.execute(`
        SELECT
            id,
            name
        FROM categories
        ORDER BY name ASC
    `)

    return rows
}

export async function findProfessionals({
    category,
    search,
    minPrice,
    maxPrice,
    sort
}) {
    const { where, values } = buildFilters({
        category,
        search,
        minPrice,
        maxPrice
    })

    const [rows] = await db.execute(
        `
        SELECT
            p.professional_id AS id,
            p.user_id,
            p.service_id,
            CONCAT(
                u.first_name,
                ' ',
                u.last_name
            ) AS full_name,
            s.name AS service_name,
            p.bio,
            p.experience_years,
            p.hourly_rate,
            p.address,
            p.city,
            p.province,
            p.postal_code,
            p.profile_image,
            p.verification_status,
            p.availability_status,

            COALESCE(
                (
                    SELECT AVG(r.rating)
                    FROM reviews r
                    WHERE r.reviewed_user_id = p.user_id
                    AND r.status = 'published'
                ),
                0
            ) AS rating,

            (
                SELECT COUNT(*)
                FROM reviews r
                WHERE r.reviewed_user_id = p.user_id
                AND r.status = 'published'
            ) AS review_count

        FROM professionals p

        LEFT JOIN users u
            ON u.user_id = p.user_id

        LEFT JOIN services s
            ON s.id = p.service_id

        ${where}

        ORDER BY ${orderBy(sort)}
        `,
        values
    )

    return rows
}

export async function findProfessionalBySlug(slug) {
    const [rows] = await db.execute(
        `
        SELECT
            p.professional_id AS id,
            p.user_id,
            p.service_id,

            CONCAT(
                u.first_name,
                ' ',
                u.last_name
            ) AS full_name,

            s.name AS service_name,
            p.bio,
            p.experience_years,
            p.hourly_rate,
            p.address,
            p.city,
            p.province,
            p.postal_code,
            p.profile_image,
            p.verification_status,
            p.availability_status,

            COALESCE(
                (
                    SELECT AVG(r.rating)
                    FROM reviews r
                    WHERE r.reviewed_user_id = p.user_id
                    AND r.status = 'published'
                ),
                0
            ) AS rating,

            (
                SELECT COUNT(*)
                FROM reviews r
                WHERE r.reviewed_user_id = p.user_id
                AND r.status = 'published'
            ) AS review_count

        FROM professionals p

        LEFT JOIN users u
            ON u.user_id = p.user_id

        LEFT JOIN services s
            ON s.id = p.service_id

        WHERE LOWER(
            REPLACE(
                CONCAT(
                    u.first_name,
                    ' ',
                    u.last_name
                ),
                ' ',
                '-'
            )
        ) = ?

        LIMIT 1
        `,
        [slug.toLowerCase()]
    )

    return rows[0] || null
}