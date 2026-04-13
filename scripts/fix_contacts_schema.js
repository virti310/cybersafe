
const db = require('../db');

async function fixSchema() {
    console.log('--- Fixing emergency_contacts Schema ---');
    try {
        await db.query(`
            ALTER TABLE emergency_contacts 
            ADD COLUMN IF NOT EXISTS team VARCHAR(255),
            ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Medium',
            ADD COLUMN IF NOT EXISTS description TEXT,
            ADD COLUMN IF NOT EXISTS availability VARCHAR(100),
            ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
            ADD COLUMN IF NOT EXISTS email VARCHAR(255),
            ADD COLUMN IF NOT EXISTS location VARCHAR(255);
        `);
        console.log('✅ Schema updated successfully.');
    } catch (e) {
        console.error('❌ Error updating schema:', e.message);
    }
}

fixSchema();
