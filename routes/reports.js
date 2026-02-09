console.log('Loading reports routes...');
const express = require('express');
const router = express.Router();
const dbPool = require('../db');

// GET: Fetch public reports (Anonymous, limited fields)
router.get('/feed', async (req, res) => {
    console.log('GET /feed hit');
    try {
        const query = `
            SELECT id, incident_type, incident_date, incident_details, created_at 
            FROM reports 
            ORDER BY created_at DESC
        `;
        const result = await dbPool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching public reports:', error);
        res.status(500).json({ error: 'Failed to fetch public reports' });
    }
});

// Configure Multer for file uploads
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Added for logging

const logFile = path.join(__dirname, '../server_debug.log');
const logToFile = (msg) => {
    try {
        const timestamp = new Date().toISOString();
        fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
    } catch (e) {
        console.error('Error writing to log file:', e);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

// POST: Create a new report
router.post('/', upload.fields([
    { name: 'evidence', maxCount: 1 },
    { name: 'suspect_photo', maxCount: 1 }
]), async (req, res) => {
    try {
        logToFile('POST /reports hit');
        // Avoid logging circular structures or huge buffers
        logToFile(`Body Check: ${JSON.stringify(req.body)}`);
        console.log('POST /reports body:', req.body);

        // Get data from body
        let {
            user_id,
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

        // Handle suspect_email if it's an array
        if (Array.isArray(suspect_email)) {
            suspect_email = suspect_email.join(', ');
        }

        if (!user_id) {
            logToFile('Error: User ID is required');
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Get file paths (SAFE ACCESS)
        const evidence_path = req.files && req.files['evidence'] ? req.files['evidence'][0].path : null;
        const suspect_photo_path = req.files && req.files['suspect_photo'] ? req.files['suspect_photo'][0].path : null;

        logToFile(`Files - Evidence: ${evidence_path}, Suspect Photo: ${suspect_photo_path}`);

        // Check if user is active
        try {
            const userCheck = await dbPool.query('SELECT is_active FROM users WHERE id = $1', [user_id]);
            if (userCheck.rows.length > 0) {
                const isActive = userCheck.rows[0].is_active;
                logToFile(`User ${user_id} active status: ${isActive}`);
                if (isActive !== null && Number(isActive) === 0) {
                    logToFile(`User ${user_id} is deactivated. Blocking report.`);
                    return res.status(403).json({ error: 'Your account is deactivated. You cannot submit reports. Contact support at cybersafe1900@gmail.com.' });
                }
            }
        } catch (err) {
            console.error('Error checking user status:', err);
            logToFile(`Error checking user status: ${err.message}`);
            // If DB check fails, we might want to allow it or fail. failing safely.
            throw err;
        }

        const query = `
            INSERT INTO reports (
                user_id, incident_date, incident_details, incident_type,
                is_financial_fraud, bank_name, transaction_id, transaction_date, fraud_amount,
                suspect_url, suspect_mobile, suspect_email,
                evidence_path, suspect_photo_path
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *;
        `;

        const values = [
            user_id, incident_date, incident_details, incident_type,
            is_financial_fraud, bank_name, transaction_id, transaction_date, fraud_amount,
            suspect_url, suspect_mobile, suspect_email,
            evidence_path, suspect_photo_path
        ];

        const result = await dbPool.query(query, values);
        logToFile(`Report created successfully: ID ${result.rows[0].id}`);
        res.status(201).json({ message: 'Report submitted successfully', report: result.rows[0] });

    } catch (error) {
        console.error('Error creating report:', error);
        logToFile(`CRITICAL ERROR creating report: ${error.message}`);
        // Log stack trace if possible
        if (error.stack) {
            logToFile(`Stack: ${error.stack}`);
            console.error(error.stack);
        }

        res.status(500).json({ error: 'Failed to submit report', details: error.message });
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
        console.log(`GET /:id hit with id: ${id}`);
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
