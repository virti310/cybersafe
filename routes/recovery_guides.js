const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all recovery guides with optional category filter
router.get('/', async (req, res) => {
    try {
        const { category_id } = req.query;
        let query = `
            SELECT rg.*, c.name as category_name 
            FROM recovery_guides rg 
            LEFT JOIN categories c ON rg.category_id = c.id
        `;
        const values = [];

        if (category_id) {
            query += ` WHERE rg.category_id = $1`;
            values.push(category_id);
        }

        query += ` ORDER BY rg.created_at DESC`;

        const result = await db.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET single recovery guide
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT rg.*, c.name as category_name 
            FROM recovery_guides rg 
            LEFT JOIN categories c ON rg.category_id = c.id 
            WHERE rg.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Guide not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST new recovery guide
router.post('/', async (req, res) => {
    try {
        const { title, content, category_id } = req.body;
        // We still save to 'guide' column for backward compatibility/safety, but use 'content' as primary
        const guide = content;
        const result = await db.query(
            'INSERT INTO recovery_guides (title, content, guide, category_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [title, content, guide, category_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT update recovery guide
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category_id } = req.body;
        const guide = content;
        const result = await db.query(
            'UPDATE recovery_guides SET title = $1, content = $2, guide = $3, category_id = $4 WHERE id = $5 RETURNING *',
            [title, content, guide, category_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Guide not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE recovery guide
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM recovery_guides WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Guide not found' });
        }
        res.json({ message: 'Guide deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
