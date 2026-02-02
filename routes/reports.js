const express = require('express');
const router = express.Router();
const dbPool = require('../db');

// POST: Create a new report
router.post('/', async (req, res) => {
    try {
        const {
            user_id, // Get user_id from body
            incident_date,
            incident_details,
            incident_type,
            is_financial_fraud,
            bank_name,
            transaction_id,
            transaction_date,
            fraud_amount,
            suspect_url,
            suspect_mobile,
            suspect_email
        } = req.body;

        const query = `
            INSERT INTO reports (
                user_id, incident_date, incident_details, incident_type,
                is_financial_fraud, bank_name, transaction_id, transaction_date, fraud_amount,
                suspect_url, suspect_mobile, suspect_email
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *;
        `;

        const values = [
            user_id, incident_date, incident_details, incident_type,
            is_financial_fraud, bank_name, transaction_id, transaction_date, fraud_amount,
            suspect_url, suspect_mobile, suspect_email
        ];

        const result = await dbPool.query(query, values);
        res.status(201).json({ message: 'Report submitted successfully', report: result.rows[0] });

    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Failed to submit report' });
    }
});

// GET: Fetch all reports or filter by user_id
router.get('/', async (req, res) => {
    try {
        const { user_id } = req.query;
        let query = 'SELECT * FROM reports';
        let values = [];

        if (user_id) {
            query += ' WHERE user_id = $1';
            values.push(user_id);
        }

        query += ' ORDER BY created_at DESC';

        const result = await dbPool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// GET: Fetch report by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await dbPool.query('SELECT * FROM reports WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Failed to fetch report' });
    }
});

// PUT: Update report status
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await dbPool.query(
            'UPDATE reports SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ error: 'Failed to update report' });
    }
});

module.exports = router;
