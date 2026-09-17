import db from "../config/db.js";

const getUserByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
};

const createUser = async (first_name, last_name, email, password_hash) => {
    const [result] = await db.query(
        `INSERT INTO users
        (first_name, last_name, email, password_hash, role)
        VALUES (?, ?, ?, ?, 'customer')`,
        [first_name, last_name, email, password_hash]
    );

    return result.insertId;
};

export default {
    getUserByEmail,
    createUser
};

