const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbPool = require('../db');
const sendEmail = require('../utils/emailService');

const JWT_SECRET = 'your_jwt_secret_key_here'; // In production, use process.env.JWT_SECRET

// REGISTER
router.post('/register', async (req, res) => {
    const { name, email, phone, gender, birthdate, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    try {
        // Check if user exists
        const userCheck = await dbPool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user (Assuming users table structure, adapting if necessary)
        // If phone/gender columns don't exist, this might fail. 
        // Based on previous context, we inferred the schema but if it fails we might need to alter table.
        // For now, let's assume standard fields or just insert what we know works + new ones.
        // If columns missing, valid fallback is to just insert name/email/pass or try to alter.
        // Let's try inserting all. If it errors, we'll know.

        const newUser = await dbPool.query(
            'INSERT INTO users (username, email, password, phone, gender, birthdate, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, email, phone, gender, birthdate, role',
            [name, email, hashedPassword, phone, gender, birthdate, 'user']
        );

        // Generate Token
        const token = jwt.sign({ id: newUser.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: newUser.rows[0] });

    }
    catch (err) {
        console.error('Registration Error:', err.message);
        console.error(err.stack);
        res.status(500).json({ error: 'Server error during registration' });
    }
}
);

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
        const user = await dbPool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        // Check Suspension removed - Deactivated users can login but cannot report
        const userData = user.rows[0];

        const token = jwt.sign({ id: user.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username, email: user.rows[0].email, role: user.rows[0].role } });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// FORGOT PASSWORD - Generate OTP
router.post('/forgot-password', async (req, res) => {
    let { email } = req.body;
    if (email) email = email.trim();

    try {
        console.log(`[AUTH] Forgot Password request for: ${email}`);

        // Use case-insensitive lookup
        const user = await dbPool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);

        if (user.rows.length === 0) {
            console.warn(`[AUTH] User not found for email: ${email}`);
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60000); // 10 minutes from now

        await dbPool.query('UPDATE users SET reset_otp = $1, otp_expiry = $2 WHERE email = $3', [otp, expiry, email]);

        // LOG OTP (Mock Email Service) - Now handled by sendEmail
        console.log(`[OTP SERVICE] OTP for ${email}: ${otp}`);

        console.log(`[AUTH] Sending email to ${email}...`);
        await sendEmail(email, 'Password Reset OTP', `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`);
        console.log(`[AUTH] Email sent successfully to ${email}`);

        res.json({ message: 'OTP sent to your email.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// VERIFY OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await dbPool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(404).json({ error: 'User not found' });

        const { reset_otp, otp_expiry } = user.rows[0];

        if (!reset_otp || reset_otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        if (new Date() > new Date(otp_expiry)) {
            return res.status(400).json({ error: 'OTP Expired' });
        }

        res.json({ message: 'OTP Verified' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        // Double check OTP to prevent bypass
        const user = await dbPool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(404).json({ error: 'User not found' });

        const { reset_otp, otp_expiry } = user.rows[0];

        if (!reset_otp || reset_otp !== otp || new Date() > new Date(otp_expiry)) {
            return res.status(400).json({ error: 'Invalid or Expired OTP' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear OTP
        await dbPool.query('UPDATE users SET password = $1, reset_otp = NULL, otp_expiry = NULL WHERE email = $2', [hashedPassword, email]);

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// CHANGE PASSWORD (Authenticated)
router.post('/change-password', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    try {
        const user = await dbPool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(404).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(currentPassword, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await dbPool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
