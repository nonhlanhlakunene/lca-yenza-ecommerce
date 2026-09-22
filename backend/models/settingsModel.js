import db from '../config/db.js'

let addressTableReady

async function ensureAddressTable() {
    if (!addressTableReady) {
        addressTableReady = (async () => {
            const [phoneColumn] = await db.execute("SHOW COLUMNS FROM users LIKE 'phone'")
            if (!phoneColumn.length) await db.execute('ALTER TABLE users ADD COLUMN phone VARCHAR(30) NULL')
            await db.execute(`CREATE TABLE IF NOT EXISTS user_addresses (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL UNIQUE,
            address_line1 VARCHAR(180) NULL, address_line2 VARCHAR(180) NULL,
            city VARCHAR(100) NULL, province VARCHAR(100) NULL, postal_code VARCHAR(20) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            CONSTRAINT fk_user_addresses_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            )`)
        })()
    }
    await addressTableReady
}

export async function findSettingsByUserId(userId) {
    await ensureAddressTable()
    const [rows] = await db.execute(`SELECT u.user_id, u.first_name, u.last_name, u.email, u.role, u.phone,
        a.address_line1, a.address_line2, a.city, a.province, a.postal_code
        FROM users u LEFT JOIN user_addresses a ON a.user_id = u.user_id WHERE u.user_id = ? LIMIT 1`, [userId])
    return rows[0] || null
}

export async function updateSettingsByUserId(userId, settings) {
    await ensureAddressTable()
    await db.execute('UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE user_id = ?',
        [settings.first_name, settings.last_name, settings.email, settings.phone || null, userId])
    await db.execute(`INSERT INTO user_addresses (user_id, address_line1, address_line2, city, province, postal_code)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE address_line1 = VALUES(address_line1), address_line2 = VALUES(address_line2),
        city = VALUES(city), province = VALUES(province), postal_code = VALUES(postal_code)`,
        [userId, settings.address_line1 || null, settings.address_line2 || null, settings.city || null, settings.province || null, settings.postal_code || null])
    return findSettingsByUserId(userId)
}
