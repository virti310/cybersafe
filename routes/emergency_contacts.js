const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all emergency contacts
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM emergency_contacts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET single contact
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM emergency_contacts WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST new contact
router.post('/', async (req, res) => {
    try {
        const { team, priority, description, availability, phone, email, location } = req.body;
        const result = await db.query(
            'INSERT INTO emergency_contacts (team, priority, description, availability, phone, email, location, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *',
            [team, priority, description, availability, phone, email, location]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT update contact
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { team, priority, description, availability, phone, email, location } = req.body;
        const result = await db.query(
            'UPDATE emergency_contacts SET team = $1, priority = $2, description = $3, availability = $4, phone = $5, email = $6, location = $7, updated_at = NOW() WHERE id = $8 RETURNING *',
            [team, priority, description, availability, phone, email, location, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE contact
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM emergency_contacts WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json({ message: 'Contact deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
