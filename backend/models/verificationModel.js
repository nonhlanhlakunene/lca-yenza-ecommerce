import db from '../config/db.js'

export const saveWorkerExperience = async ({ professionalId, service, yearsExperience,  experienceNotes }) => {
    const [result] = await db.query(
        `INSERT INTO worker_experience (professional_id, service, years_experience, experience_notes)
         VALUES (?, ?, ?, ?)`,
        [professionalId, service || null, yearsExperience || null, experienceNotes || null]
    );
    return result.insertId;
};