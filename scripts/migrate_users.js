
const db = require('../db');

async function migrate() {
    try {
        console.log('Migrating users table...');

        await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(255)');
        console.log('Added phone column.');

        await db.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(50)');
        console.log('Added gender column.');

        console.log('Migration successful.');
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        process.exit();
    }
}

migrate();
