const axios = require('axios');

async function testAddNotification() {
    try {
        console.log('Testing Add Notification (POST)...');

        // 1. Add a broadcast notification
        const res = await axios.post('http://localhost:3000/api/notifications', {
            title: 'Test Notification from Script',
            body: 'This is a test broadcast notification to verify the Add operation.',
            type: 'ALL',
            user_id: null
        });

        console.log('Add Notification Response:', res.status, res.data);

        if (res.status === 200) {
            console.log('SUCCESS: Notification added.');
        } else {
            console.log('FAILED: Unexpected status code.');
        }

    } catch (error) {
        console.error('ERROR:', error.response ? error.response.data : error.message);
    }
}

testAddNotification();
