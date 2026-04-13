
const db = require('../db');

async function checkConstraints() {
    console.log('--- Checking Constraints ---');
    try {
        const res = await db.query(`
            SELECT conname, pg_get_constraintdef(c.oid)
            FROM pg_constraint c
            WHERE conrelid = 'emergency_contacts'::regclass
            AND contype = 'c';
        `);

        res.rows.forEach(r => {
            console.log(`Constraint: ${r.conname}`);
            console.log(`Definition: ${r.pg_get_constraintdef}`);
        });
    } catch (e) {
        console.error('Error:', e.message);
    }
}

checkConstraints();
