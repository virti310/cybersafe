const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all notifications (most recent first)
// Get all notifications (most recent first)
// Get all notifications (grouped by broadcast)
router.get('/', async (req, res) => {
    try {
        const { user_id } = req.query;

        // If filtering by specific user, show all their notifications
        if (user_id) {
            const query = `
                SELECT n.*, u.username 
                FROM notifications n
                LEFT JOIN users u ON n.user_id = u.id
                WHERE n.user_id = $1
                ORDER BY n.created_at DESC
            `;
            const result = await pool.query(query, [user_id]);
            return res.json(result.rows);
        }

        // Admin view: Group broadcasts, show singles individually
        // We use DISTINCT ON title/body for broadcasts created around the same time
        const query = `
            SELECT DISTINCT ON (title, body, type) 
                n.id, n.title, n.body, n.type, n.created_at,
                CASE WHEN n.type = 'BROADCAST' THEN 'All Users' ELSE u.username END as username
            FROM notifications n
            LEFT JOIN users u ON n.user_id = u.id
            ORDER BY title, body, type, created_at DESC
        `;

        // Note: The ORDER BY must start with the DISTINCT ON columns. 
        // Then we sort by created_at DESC to get the latest one as the representative.
        // Finally, in the app, we might want to sort the final list by created_at again.

        const result = await pool.query(query);

        // Re-sort by date descending for the UI
        const sortedRows = result.rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.json(sortedRows);
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

// Update a notification
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, body } = req.body;

        const result = await pool.query(
            'UPDATE notifications SET title = $1, body = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
            [title, body, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a notification
// Delete a notification (or broadcast group)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Get the notification to check its type
        const check = await pool.query('SELECT title, body, type FROM notifications WHERE id = $1', [id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        const { title, body, type } = check.rows[0];

        if (type === 'BROADCAST') {
            // Delete ALL with same title/body/type
            await pool.query(
                'DELETE FROM notifications WHERE title = $1 AND body = $2 AND type = $3',
                [title, body, type]
            );
            res.json({ msg: 'Broadcast group deleted' });
        } else {
            // Delete just this one
            await pool.query('DELETE FROM notifications WHERE id = $1', [id]);
            res.json({ msg: 'Notification deleted' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
