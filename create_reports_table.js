const dbPool = require('./db');

async function createReportsTable() {
    try {
        const query = `
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        incident_type VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
        await dbPool.query(query);
        console.log('Reports table created successfully (or already exists).');
    } catch (err) {
        console.error('Error creating reports table:', err);
    } finally {
        await dbPool.end();
    }
}

createReportsTable();
