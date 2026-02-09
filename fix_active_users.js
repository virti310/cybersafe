
const dbPool = require('./db');

async function fixActiveStatus() {
    try {
        console.log('Checking for NULL is_active values...');
        const checkNulls = await dbPool.query('SELECT COUNT(*) FROM users WHERE is_active IS NULL');
        console.log(`Found ${checkNulls.rows[0].count} users with NULL is_active.`);

        if (parseInt(checkNulls.rows[0].count) > 0) {
            console.log('Updating NULL is_active to 1 (active)...');
            await dbPool.query('UPDATE users SET is_active = 1 WHERE is_active IS NULL');
            console.log('Updated users.');
        }

        console.log('Ensuring default value is 1...');
        await dbPool.query('ALTER TABLE users ALTER COLUMN is_active SET DEFAULT 1');
        console.log('Default value set.');

    } catch (err) {
        console.error('Error fixing active status:', err);
    } finally {
        process.exit();
    }
}

fixActiveStatus();
