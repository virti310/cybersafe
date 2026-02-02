const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all FAQs
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM faqs ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get FAQ by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM faqs WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'FAQ not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create new FAQ
router.post('/', async (req, res) => {
    const { question, answer } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO faqs (question, answer) VALUES ($1, $2) RETURNING *',
            [question, answer]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update FAQ
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
    try {
        const result = await pool.query(
            'UPDATE faqs SET question = $1, answer = $2 WHERE id = $3 RETURNING *',
            [question, answer, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'FAQ not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete FAQ
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM faqs WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'FAQ not found' });
        }
        res.json({ msg: 'FAQ deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
