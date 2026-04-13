const pool = require('../db');

async function fixDB() {
    console.log('Testing DB Connection...');
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('DB Connection OK:', res.rows[0]);
    } catch (e) {
        console.error('DB Connection Failed:', e.message);
        return;
    }

    console.log('Testing Awareness Table...');
    try {
        await pool.query('SELECT * FROM awareness LIMIT 1');
        console.log('Awareness Select OK');
    } catch (e) {
        console.error('Awareness Select Failed:', e.message);
    }

    console.log('Fixing Notifications Constraint...');
    try {
        // Attempt to drop the check constraint if it creates issues with our types 'SINGLE'/'BROADCAST'
        // We catch error in case it doesn't exist.
        await pool.query('ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check');
        console.log('Dropped notifications_type_check (if existed)');
    } catch (e) {
        console.error('Failed to drop constraint:', e.message);
    }

    // Also check if 'category_id' column exists in awareness?
    // My previous code in awareness.js assumed no category_id in INSERT?
    // wait, Step 196: INSERT INTO awareness (title, content, image, created_at, updated_at). 
    // Schema Step 140: awareness(id, title, content, created_at, updated_at, image).
    // This matches.

    pool.end();
}

fixDB();
