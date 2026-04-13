const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Unique filename: timestamp + original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// GET all awareness content
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM awareness ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET single awareness content by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM awareness WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST new awareness content
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        // Construct image URL if file uploaded
        let imageUrl = null;
        if (req.file) {
            // Assuming server runs on same host/port. client needs to prepend base URL or we store full URL
            // Storing relative path or full URL? Let's store full URL for simplicity if we know host, 
            // but relative is safer. Let's store relative path '/uploads/filename' and let frontend prepend server URL 
            // OR prepend it here. For now, let's just assume we return the relative path 
            // and the frontend handles the full URL (or we hardcode localhost for dev).
            // Actually, best to save the relative path: /uploads/filename.ext
            imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            // Fallback if they send a URL string (backward compatibility)
            imageUrl = req.body.image;
        }

        const result = await db.query(
            'INSERT INTO awareness (title, content, image, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
            [title, content, imageUrl]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT update awareness content
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        let imageUrl = req.body.image; // Keep existing if not changed

        if (req.file) {
            imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
        }

        const result = await db.query(
            'UPDATE awareness SET title = $1, content = $2, image = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
            [title, content, imageUrl, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE awareness content
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM awareness WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json({ message: 'Article deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
