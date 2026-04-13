const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function verify() {
    try {
        console.log('Verifying FAQs API...');
        // 1. Create a dummy FAQ
        const faqRes = await axios.post(`${API_URL}/faqs`, {
            question: 'Test Question?',
            answer: 'Test Answer'
        });
        console.log('Create FAQ Status:', faqRes.status);
        const faqId = faqRes.data.id;

        // 2. Get all FAQs
        const faqsRes = await axios.get(`${API_URL}/faqs`);
        console.log('Get FAQs Count:', faqsRes.data.length);

        // 3. Delete dummy FAQ
        await axios.delete(`${API_URL}/faqs/${faqId}`);
        console.log('Delete FAQ: Success');


        console.log('\nVerifying Policies API...');
        // 4. Get Policies
        const policiesRes = await axios.get(`${API_URL}/policies`);
        console.log('Get Policies Count:', policiesRes.data.length);

        console.log('\nVerification Complete!');

    } catch (error) {
        console.error('Verification Failed:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

verify();
