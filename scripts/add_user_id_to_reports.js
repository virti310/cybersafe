const dbPool = require('../db');

async function addUserIdColumn() {
    const query = `
        ALTER TABLE reports 
        ADD COLUMN IF NOT EXISTS user_id INTEGER;
    `;

    try {
        console.log('Adding user_id column to reports table...');
        await dbPool.query(query);
        console.log('Column added successfully.');
    } catch (error) {
        console.error('Error adding column:', error);
    } finally {
        await dbPool.end();
    }
}

addUserIdColumn();
