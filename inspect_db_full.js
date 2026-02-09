const dbPool = require('./db');
const fs = require('fs');

async function checkReportsSchema() {
    try {
        const res = await dbPool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'reports';
        `);
        console.log('Reports Table Columns:');
        let output = 'Reports Table Columns:\n';
        res.rows.forEach(row => {
            const line = `${row.column_name} (${row.data_type}, ${row.is_nullable})`;
            console.log(line);
            output += line + '\n';
        });
        fs.writeFileSync('db_schema_dump.txt', output);
    } catch (err) {
        console.error('Error checking schema:', err);
    } finally {
        process.exit();
    }
}

checkReportsSchema();
