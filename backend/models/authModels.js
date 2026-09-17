
import db from "../config/db.js";

const getUserByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
};

export default {
    getUserByEmail
};
