const pool = require('../db');

// EDIT THESE VARIABLES TO CHANGE COLUMN LENGTH
const TABLE_NAME = 'reports'; // e.g. 'reports', 'users'
const COLUMN_NAME = 'incident_type'; // e.g. 'incident_type', 'bank_name'
const NEW_TYPE = 'VARCHAR(255)'; // e.g. 'VARCHAR(500)', 'TEXT'

async function alterColumn() {
    try {
        console.log(`🔌 Connecting to database...`);
        console.log(`🔄 Altering ${TABLE_NAME}.${COLUMN_NAME} to ${NEW_TYPE}...`);

        const query = `ALTER TABLE ${TABLE_NAME} ALTER COLUMN ${COLUMN_NAME} TYPE ${NEW_TYPE}`;

        await pool.query(query);

        console.log(`✅ Successfully changed ${COLUMN_NAME} to ${NEW_TYPE}`);

    } catch (err) {
        console.error('❌ Error altering column:', err.message);
    }

    // Exit script
    setTimeout(() => process.exit(0), 1000);
}

alterColumn();
