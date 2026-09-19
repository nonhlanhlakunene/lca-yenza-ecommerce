import db from "../config/db.js";

// function for the skills and experience section
export const saveWorkerExperience = async ({
  professionalId,
  service,
  yearsExperience,
  experienceNotes,
}) => {
  const [result] = await db.query(
    `INSERT INTO worker_experience (professional_id, service, years_experience, experience_notes)
         VALUES (?, ?, ?, ?)`,
    [
      professionalId,
      service || null,
      yearsExperience || null,
      experienceNotes || null,
    ],
  );
  return result.insertId;
};

// function for the email verification --> saveOTP insert a new Otp row
export const saveOtp = async ({ userId, email, otpCode, expiresAt }) => {
  const [result] = await db.query(
    `INSERT INTO phone_verifications (user_id, email, otp_code, expires_at)
        VALUES (?, ?, ?, ?)`,
    [userId, email, otpCode, expiresAt],
  );

  return result.insertId;
};

// Gets the most recent unverified OTP for a user
export const findLatestOtp = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM phone_verifications
         WHERE user_id = ? AND is_verified = FALSE
         ORDER BY id DESC LIMIT 1`,
    [userId],
  );
  return rows[0];
};

// Changes is veried to true after the user enters the right code
export const markOtpVerified = async (id) => {
  await db.query(
    `UPDATE phone_verifications SET is_verified = TRUE WHERE id = ?`,
    [id],
  );
};

export const saveDocument = async ({
  userId,
  documentType,
  fileName,
  filePath,
  fileSize,
  mimeType,
}) => {
  const [result] = await db.query(
    `INSERT INTO verification_documents
         (user_id, document_type, file_name, file_path, file_size, mime_type)
         VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, documentType, fileName, filePath, fileSize, mimeType],
  );
  return result.insertId;
};