
const dbPool = require('./db');

async function checkReportsSchema() {
    try {
        const res = await dbPool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'reports';
        `);
        console.log('Reports Table Columns:');
        res.rows.forEach(row => {
            console.log(`${row.column_name} (${row.data_type}, ${row.is_nullable})`);
        });
    } catch (err) {
        console.error('Error checking schema:', err);
    } finally {
        process.exit();
    }
}

checkReportsSchema();
