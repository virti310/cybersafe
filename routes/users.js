const express = require('express');
const router = express.Router();
const dbPool = require('../db');
const sendEmail = require('../utils/emailService');

// GET all users
router.get('/', async (req, res) => {
    try {
        console.log('[API] Fetching all users...');
        console.log('[API] Fetching all users...');
        const result = await dbPool.query('SELECT id, username, email, phone, gender, birthdate, is_active, created_at FROM users ORDER BY created_at DESC');
        console.log(`[API] Found ${result.rows.length} users.`);
        console.log(`[API] Found ${result.rows.length} users.`);
        res.json(result.rows);
    } catch (err) {
        console.error('[API] Error fetching users:', err.message);
        res.status(500).json({ error: 'Server error fetching users' });
    }
});

// GET single user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await dbPool.query('SELECT id, username, email, phone, gender, birthdate, created_at FROM users WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('[API] Error fetching user:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// UPDATE user details
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, phone, gender } = req.body;

        // Build dynamic query based on provided fields
        // Simple version: Update all allowed fields (users usually send full object in edit form)
        const result = await dbPool.query(
            'UPDATE users SET username = $1, phone = $2, gender = $3 WHERE id = $4 RETURNING id, username, email, phone, gender',
            [username, phone, gender, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user: result.rows[0] });
    } catch (err) {
        console.error('[API] Error updating user:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});
// UPDATE user status
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const result = await dbPool.query(
            'UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, is_active',
            [is_active, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        // Handle suspension logic
        if (Number(is_active) === 0) {
            // DEACTIVATE -> Suspend for 30 mins
            const suspensionTime = new Date(Date.now() + 30 * 60000); // 30 minutes from now
            await dbPool.query('UPDATE users SET suspension_end_time = $1 WHERE id = $2', [suspensionTime, id]);

            // Send Email
            const emailSubject = "Account Suspended";
            const emailBody = `Your account has been deactivated by the admin. You are suspended for 30 minutes until ${suspensionTime.toLocaleString()}. Access will be restricted during this time.`;
            // Retrieve email for notification (updated query below)
            const userEmailRes = await dbPool.query('SELECT email FROM users WHERE id = $1', [id]);
            if (userEmailRes.rows.length > 0) {
                await sendEmail(userEmailRes.rows[0].email, emailSubject, emailBody);
            }

        } else {
            // ACTIVATE -> Clear suspension
            await dbPool.query('UPDATE users SET suspension_end_time = NULL WHERE id = $1', [id]);

            // Send Email
            const emailSubject = "Account Reactivated";
            const emailBody = "Your account has been reactivated by the admin. You can now login.";
            const userEmailRes = await dbPool.query('SELECT email FROM users WHERE id = $1', [id]);
            if (userEmailRes.rows.length > 0) {
                await sendEmail(userEmailRes.rows[0].email, emailSubject, emailBody);
            }
        }

        res.json({ message: 'User status updated', user: result.rows[0] });
    } catch (err) {
        console.error('[API] Error updating user status:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
