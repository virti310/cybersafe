const dbPool = require('../db');

async function addStatusColumn() {
    const query = `
        ALTER TABLE reports 
        ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending';
    `;

    try {
        console.log('Adding status column to reports table...');
        await dbPool.query(query);
        console.log('Status column added successfully.');
    } catch (error) {
        console.error('Error adding column:', error);
    } finally {
        await dbPool.end();
    }
}

addStatusColumn();
