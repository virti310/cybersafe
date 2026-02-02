const express = require('express');
const router = express.Router();
const dbPool = require('../db');

// GET all users
router.get('/', async (req, res) => {
    try {
        console.log('[API] Fetching all users...');
        console.log('[API] Fetching all users...');
        const result = await dbPool.query('SELECT id, username, email, phone, gender, is_active, created_at FROM users ORDER BY created_at DESC');
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
        const result = await dbPool.query('SELECT id, username, email, phone, gender, created_at FROM users WHERE id = $1', [id]);

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

        res.json({ message: 'User status updated', user: result.rows[0] });
    } catch (err) {
        console.error('[API] Error updating user status:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
