const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all notifications (most recent first)
// Get all notifications (most recent first)
router.get('/', async (req, res) => {
    try {
        const { user_id } = req.query;

        let query = `
            SELECT n.*, u.username 
            FROM notifications n
            LEFT JOIN users u ON n.user_id = u.id
        `;

        const params = [];
        if (user_id) {
            query += ` WHERE n.user_id = $1`;
            params.push(user_id);
        }

        query += ` ORDER BY n.created_at DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Send Notification
router.post('/', async (req, res) => {
    const { title, body, type, user_id } = req.body;

    // Schema: id, title, body, type, user_id (NO NULL), fcm_token (NO NULL), sent_by, status, metadata, created_at, updated_at
    // We need to handle fcm_token since it is NO NULL. We'll put a placeholder if we don't have it.

    try {
        if (type === 'ALL') {
            // Fetch all users
            const users = await pool.query('SELECT id FROM users');
            const queries = users.rows.map(user => {
                return pool.query(
                    `INSERT INTO notifications (title, body, type, user_id, fcm_token, created_at, updated_at) 
                     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
                    [title, body, 'BROADCAST', user.id, 'placeholder_token']
                );
            });
            await Promise.all(queries);
            res.json({ msg: `Sent to ${users.rows.length} users` });
        } else {
            // Single User
            if (!user_id) {
                return res.status(400).json({ msg: 'User ID is required for single notification' });
            }
            const result = await pool.query(
                `INSERT INTO notifications (title, body, type, user_id, fcm_token, created_at, updated_at) 
                 VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
                [title, body, 'SINGLE', user_id, 'placeholder_token']
            );
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
