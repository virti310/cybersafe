
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testSubmit() {
    try {
        const form = new FormData();
        form.append('user_id', '1'); // Assuming ID 1 exists
        form.append('incident_date', '2023-10-27 10:00');
        form.append('incident_details', 'Test incident details which are long enough to pass the validation check of fifty characters.');
        form.append('incident_type', 'Cyberbullying');
        form.append('is_financial_fraud', 'false');

        const response = await axios.post('http://localhost:3000/api/reports', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Response:', response.status, response.data);
    } catch (error) {
        if (error.response) {
            console.log('Error Response:', error.response.status, JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
        }
    }
}

testSubmit();
