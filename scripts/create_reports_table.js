const dbPool = require('../db');

async function createReportsTable() {
    const createTableQuery = `
        DROP TABLE IF EXISTS reports;
        CREATE TABLE IF NOT EXISTS reports (
            id SERIAL PRIMARY KEY,
            incident_date VARCHAR(50) NOT NULL,
            incident_details TEXT NOT NULL,
            incident_type VARCHAR(100),
            
            is_financial_fraud BOOLEAN DEFAULT FALSE,
            bank_name VARCHAR(100),
            transaction_id VARCHAR(100),
            transaction_date VARCHAR(50),
            fraud_amount VARCHAR(50),
            
            suspect_url TEXT,
            suspect_mobile VARCHAR(50),
            suspect_email VARCHAR(100),
            
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        console.log('Creating reports table...');
        await dbPool.query(createTableQuery);
        console.log('Reports table created successfully.');
    } catch (error) {
        console.error('Error creating reports table:', error);
    } finally {
        await dbPool.end();
    }
}

createReportsTable();
