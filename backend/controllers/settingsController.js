import { findSettingsByUserId, updateSettingsByUserId } from '../models/settingsModel.js'

export async function getMySettings(req, res) {
    try {
        const settings = await findSettingsByUserId(req.user.user_id)
        if (!settings) return res.status(404).json({ message: 'User not found' })
        res.json({ settings })
    } catch (error) {
        console.error('Get settings error:', error)
        res.status(500).json({ message: 'Could not load settings' })
    }
}

export async function updateMySettings(req, res) {
    const { first_name, last_name, email, phone, address_line1, address_line2, city, province, postal_code } = req.body
    if (!first_name?.trim() || !last_name?.trim() || !email?.trim()) return res.status(400).json({ message: 'First name, last name, and email are required' })
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return res.status(400).json({ message: 'Enter a valid email address' })
    try {
        const settings = await updateSettingsByUserId(req.user.user_id, {
            first_name: first_name.trim(), last_name: last_name.trim(), email: email.trim(), phone: phone?.trim(),
            address_line1: address_line1?.trim(), address_line2: address_line2?.trim(), city: city?.trim(),
            province: province?.trim(), postal_code: postal_code?.trim()
        })
        res.json({ message: 'Settings saved successfully', settings })
    } catch (error) {
        console.error('Update settings error:', error)
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'That email address is already in use' })
        res.status(500).json({ message: 'Could not save settings' })
    }
}
