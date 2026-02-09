const dbPool = require('../db');

async function verifyLatestReport() {
    try {
        const res = await dbPool.query(`
            SELECT id, incident_type, evidence_path, suspect_photo_path, created_at 
            FROM reports 
            ORDER BY created_at DESC 
            LIMIT 1
        `);

        if (res.rows.length === 0) {
            console.log('No reports found.');
        } else {
            console.log('Latest Report:');
            console.table(res.rows[0]);
        }
    } catch (err) {
        console.error('Error fetching report:', err);
    } finally {
        await dbPool.end();
    }
}

verifyLatestReport();
