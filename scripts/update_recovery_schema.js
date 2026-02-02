const db = require('../db');

async function migrate() {
    try {
        console.log('Adding title and content columns...');
        await db.query(`
            ALTER TABLE recovery_guides 
            ADD COLUMN IF NOT EXISTS title VARCHAR(255),
            ADD COLUMN IF NOT EXISTS content TEXT;
        `);

        console.log('Migrating existing data...');
        // If title is null, we assume it's a legacy record where 'guide' holds the content.
        // We set content = guide, and give it a default title.
        await db.query(`
            UPDATE recovery_guides 
            SET content = guide, title = 'Untitled Guide ' || id 
            WHERE title IS NULL;
        `);

        console.log('Migration complete.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await db.end();
    }
}

migrate();
