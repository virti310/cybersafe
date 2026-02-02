
const db = require('../db');

async function checkSchema() {
    console.log('--- Checking emergency_contacts Schema ---');
    try {
        const res = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'emergency_contacts';
        `);
        console.table(res.rows);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

checkSchema();
