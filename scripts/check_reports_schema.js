
const db = require('../db');

async function checkReportsSchema() {
    console.log('--- Checking reports Schema ---');
    try {
        const res = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'reports';
        `);
        console.table(res.rows);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

checkReportsSchema();
