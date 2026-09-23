import db from "../config/db.js";

const getUserByEmail = async (email) => {
  const [rows] = await db.query(
    `
        SELECT
            u.user_id,
            u.first_name,
            u.last_name,
            u.email,
            u.password_hash,
            u.role,
            u.phone,
            p.professional_id,
            p.verification_status
        FROM users u
        LEFT JOIN professionals p
            ON p.user_id = u.user_id
        WHERE u.email = ?
        `,
    [email],
  );

  return rows[0];
};

const createUser = async (
  first_name,
  last_name,
  email,
  password_hash,
  role = "customer",
) => {
  const [result] = await db.query(
    `
        INSERT INTO users
        (first_name, last_name, email, password_hash, role)
        VALUES (?, ?, ?, ?, ?)
        `,
    [first_name, last_name, email, password_hash, role],
  );

  return result.insertId;
};

const createProfessional = async (userId, serviceId = 2) => {
  const [result] = await db.query(
    `
        INSERT INTO professionals
        (
            user_id,
            service_id,
            verification_status,
            availability_status
        )
        VALUES (?, ?, 'pending', 'available')
        `,
    [userId, serviceId],
  );

  return result.insertId;
};

export default {
  getUserByEmail,
  createUser,
  createProfessional,
};
