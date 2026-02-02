const fetch = require('node-fetch'); // Needs node-fetch or native fetch in Node 18+

async function testApi() {
    const payload = {
        incident_date: "27/01/2026 12:00",
        incident_details: "This is a test incident details string that is definitely longer than 50 characters to satisfy the minimum length requirement.",
        incident_type: "General",
        is_financial_fraud: false,
        bank_name: null,
        transaction_id: null,
        transaction_date: null,
        fraud_amount: null,
        suspect_url: "",
        suspect_mobile: "",
        suspect_email: ""
    };

    try {
        const response = await fetch('http://localhost:3000/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Polyfill fetch if needed (Node < 18) or assuming native
if (!global.fetch) {
    console.log('No global fetch, using http module directly...');
    const http = require('http');
    const data = JSON.stringify(payload);
    // ... skipping complex http setup, assuming Node 18+ or recent environment
}

testApi();
