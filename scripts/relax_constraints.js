
const db = require('../db');

async function relaxConstraints() {
    console.log('--- Relaxing Constraints ---');
    try {
        await db.query(`
            ALTER TABLE emergency_contacts 
            DROP CONSTRAINT IF EXISTS emergency_contacts_priority_check;
        `);
        console.log('✅ Dropped priority check.');

        await db.query(`
            ALTER TABLE emergency_contacts 
            DROP CONSTRAINT IF EXISTS emergency_contacts_availability_check;
        `);
        console.log('✅ Dropped availability check (if existed).');

        // Verify by listing again (optional) or just exit
    } catch (e) {
        console.error('❌ Error dropping constraints:', e.message);
    }
}

relaxConstraints();
