
const db = require('../db');

async function addBirthdateColumn() {
    console.log('--- Adding birthdate column to users table ---');
    try {
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS birthdate DATE;
        `);
        console.log('✅ Schema updated successfully: birthdate column added.');
    } catch (e) {
        console.error('❌ Error updating schema:', e.message);
    }
}

addBirthdateColumn();
