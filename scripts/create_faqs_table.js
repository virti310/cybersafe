const pool = require('../db');

async function createFaqsTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS faqs (
                id SERIAL PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('FAQs table created successfully');
    } catch (err) {
        console.error('Error creating FAQs table:', err);
    } finally {
        await pool.end();
    }
}

createFaqsTable();
