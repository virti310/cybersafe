const pool = require('../db');

async function fixSchema() {
    try {
        console.log('Connecting to database...');
        console.log('Altering recovery_guides table...');

        // Change 'guide' column to TEXT to allow longer content
        await pool.query('ALTER TABLE recovery_guides ALTER COLUMN guide TYPE TEXT');

        console.log('Schema updated successfully: guide column is now TEXT.');
    } catch (err) {
        console.error('Schema Fix Error:', err);
    }

    setTimeout(() => process.exit(0), 1000);
}

fixSchema();
