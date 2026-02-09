const dbPool = require('./db');

async function checkActiveColumn() {
    try {
        const res = await dbPool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'is_active';
        `);
        console.log('is_active column search result:', res.rows);
    } catch (err) {
        console.error('Error checking schema:', err);
    } finally {
        process.exit();
    }
}

checkActiveColumn();
