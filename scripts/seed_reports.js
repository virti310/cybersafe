const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3000/api';

const reports = [
    {
        user_id: 1,
        incident_date: '2025-10-15',
        incident_details: 'Received a suspicious email claiming to be from my bank asking for login details.',
        incident_type: 'Phishing',
        is_financial_fraud: false,
        suspect_email: 'support@secure-bank-login.com'
    },
    {
        user_id: 2,
        incident_date: '2025-10-20',
        incident_details: 'Noticed unauthorized transaction on my credit card statement.',
        incident_type: 'Financial Fraud',
        is_financial_fraud: true,
        bank_name: 'Chase Bank',
        transaction_id: 'TXN123456789',
        transaction_date: '2025-10-19',
        fraud_amount: '500.00',
        suspect_mobile: 'N/A'
    },
    {
        user_id: 3,
        incident_date: '2025-11-01',
        incident_details: 'My Instagram account was hacked and the hacker is asking for ransom.',
        incident_type: 'Social Media Hacking',
        is_financial_fraud: false,
        suspect_url: 'instagram.com/hacker_profile'
    },
    {
        user_id: 4,
        incident_date: '2025-11-05',
        incident_details: 'Clicked on a link in an SMS and now my phone is acting weird.',
        incident_type: 'Malware',
        is_financial_fraud: false,
        suspect_mobile: '+1-555-010-9999'
    },
    {
        user_id: 5,
        incident_date: '2025-11-10',
        incident_details: 'Fake job offer requiring initial payment for "training materials".',
        incident_type: 'Job Scam',
        is_financial_fraud: true,
        bank_name: 'PayPal',
        transaction_id: 'REF987654321',
        transaction_date: '2025-11-09',
        fraud_amount: '250.00',
        suspect_email: 'recruiter@fake-jobs-corp.net'
    }
];

// Helper to delete all reports (assuming we can just empty the table via a direct query helper or fetching all and deleting one by one via API if generic delete all endpoint doesn't exist.
// Since we don't have a "delete all" generic endpoint exposed, we'll try to use a direct DB connection here or just loop through existing IDs if we could fetch them.
// Actually, for simplicity and speed, let's use the DB pool directly if possible, same as server. 
// But scripts generally run standalone. Let's try to allow the server to do it.
// The user asked to "remove current record".
// I will check if I can just use pg directly here.

// Use shared DB module
const pool = require('../db');

async function seedReports() {
    try {
        console.log('Connecting to database...');
        // Delete all existing reports
        console.log('Deleting existing reports...');
        await pool.query('DELETE FROM reports');
        console.log('All existing reports deleted.');

        // Insert new reports via API to ensure triggers/logic run? Or just DB?
        // Let's use API to be safe with any side effects, although DB direct is faster.
        // Actually, the previous seed script used axios. Let's stick to API for insertion to mimic real app behavior.

        console.log('Seeding new reports...');
        for (const report of reports) {
            try {
                // Ensure user exists? We assume 1-5 exist.
                await axios.post(`${API_URL}/reports`, report);
                console.log(`+ Added report for User ${report.user_id}: ${report.incident_type}`);
            } catch (error) {
                console.error(`- Failed to add report for User ${report.user_id}:`, error.response?.data || error.message);
            }
        }

        console.log('Seeding complete!');
    } catch (err) {
        console.error('Script error:', err);
    }
    // Shared pool might not end cleanly if it's singleton used by app, but for script it's fine. 
    // Usually db.js exports a pool directly.
    // If we call pool.end() it might kill it for others if we were sharing (but we are script).
    // Let's try to exit process after done.
    setTimeout(() => process.exit(0), 1000);
}

seedReports();
