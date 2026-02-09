const dbPool = require('../db');

async function addImageColumns() {
    const client = await dbPool.connect();
    try {
        console.log('Adding image columns to reports table...');

        await client.query(`
            ALTER TABLE reports 
            ADD COLUMN IF NOT EXISTS evidence_path TEXT,
            ADD COLUMN IF NOT EXISTS suspect_photo_path TEXT;
        `);

        console.log('Successfully added image columns.');
    } catch (error) {
        console.error('Error adding columns:', error);
    } finally {
        client.release();
        // dbPool.end(); // Keep pool open if running in app context, but here we can exit
        process.exit();
    }
}

addImageColumns();
