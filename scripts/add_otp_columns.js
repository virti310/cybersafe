
const db = require('../db');

async function migrate() {
    try {
        console.log('Migrating users table for OTP...');

        await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_otp VARCHAR(10)');
        console.log('Added reset_otp column.');

        await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expiry TIMESTAMP');
        console.log('Added otp_expiry column.');

        console.log('Migration successful.');
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        process.exit();
    }
}

migrate();
