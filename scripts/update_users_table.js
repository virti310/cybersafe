const pool = require('../db');

async function updateSchema() {
    try {
        console.log('Checking users table schema...');

        // Check if column exists
        const checkColumn = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='is_active';
        `);

        if (checkColumn.rows.length === 0) {
            console.log('Adding is_active column...');
            await pool.query('ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1;');
            console.log('Column is_active added successfully.');
        } else {
            console.log('Column is_active already exists.');
        }

        console.log('Schema update complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error updating schema:', err);
        process.exit(1);
    }
}

updateSchema();
