
const dbPool = require('./db');

async function checkIsActive() {
    try {
        const res = await dbPool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'is_active';
        `);
        if (res.rows.length > 0) {
            console.log('is_active column exists');
        } else {
            console.log('is_active column MISSING');
            // Add column if missing
            await dbPool.query(`ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1;`);
            console.log('Added is_active column');
        }
    } catch (err) {
        console.error('Error checking schema:', err);
    } finally {
        process.exit();
    }
}

checkIsActive();
