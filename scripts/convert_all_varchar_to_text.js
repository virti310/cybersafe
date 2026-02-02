const pool = require('../db');

async function convertAllVarcharToText() {
    try {
        console.log('🔌 Connecting to database...');

        // 1. Find all VARCHAR columns in the public schema
        const query = `
            SELECT table_name, column_name, character_maximum_length 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND data_type = 'character varying';
        `;

        const result = await pool.query(query);
        const columns = result.rows;

        if (columns.length === 0) {
            console.log('No VARCHAR columns found to convert.');
            return;
        }

        console.log(`🔍 Found ${columns.length} VARCHAR columns. Converting to TEXT...`);

        // 2. Iterate and alter each column
        for (const col of columns) {
            const table = col.table_name;
            const column = col.column_name;
            const len = col.character_maximum_length;

            console.log(`Processing ${table}.${column} (Current: VARCHAR(${len}))...`);

            try {
                await pool.query(`ALTER TABLE "${table}" ALTER COLUMN "${column}" TYPE TEXT`);
                console.log(`  ✅ Converted ${table}.${column} to TEXT`);
            } catch (err) {
                console.error(`  ❌ Failed to convert ${table}.${column}:`, err.message);
            }
        }

        console.log('🎉 All conversions completed!');

    } catch (err) {
        console.error('Script Error:', err);
    }

    setTimeout(() => process.exit(0), 1000);
}

convertAllVarcharToText();
