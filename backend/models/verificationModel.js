import db from '../config/db.js'

export const saveWorkerExperience = async ({ professionalId, experienceNotes }) => {
    const [result] = await db.query(
        `INSERT INTO worker_experience (professional_id, experience_notes)
         VALUES (?, ?)`,
        [professionalId, experienceNotes || null]
    );
    return result.insertId;
};