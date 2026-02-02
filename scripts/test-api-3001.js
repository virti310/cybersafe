const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001/api';

async function fetchJson(url, options) {
    const res = await fetch(url, options);
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch (e) {
        throw new Error(`Invalid JSON from ${url}: ${text.substring(0, 200)}...`);
    }
}

async function testCRUD() {
    console.log('--- Testing Awareness CRUD ---');
    try {
        const awareness = await fetchJson(`${BASE_URL}/awareness`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Test Article', content: 'Content', image: '' })
        });
        console.log('Created Awareness:', awareness.title === 'Test Article' ? 'PASS' : 'FAIL');

        if (awareness.id) {
            await fetchJson(`${BASE_URL}/awareness/${awareness.id}`, { method: 'DELETE' });
            console.log('Deleted Awareness: PASS');
        }
    } catch (e) {
        console.log('Awareness Test Failed:', e.message);
    }

    console.log('--- Testing Policies CRUD ---');
    try {
        const policy = await fetchJson(`${BASE_URL}/policies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Privacy Policy', content: 'This is a test privacy policy.' })
        });
        console.log('Upsert Policy:', policy.content === 'This is a test privacy policy.' ? 'PASS' : 'FAIL');

        const fetchedPolicy = await fetchJson(`${BASE_URL}/policies/Privacy Policy`);
        console.log('Get Policy:', fetchedPolicy.title === 'Privacy Policy' ? 'PASS' : 'FAIL');
    } catch (e) {
        console.log('Policies Test Failed:', e.message);
    }

    console.log('--- Testing Notifications CRUD ---');
    try {
        // Create single notification (user_id=1, might fail if constraint)
        const notif = await fetchJson(`${BASE_URL}/notifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Test Alert', body: 'Test Message', type: 'SINGLE', user_id: 1 })
        });

        if (notif && notif.id) {
            console.log('Create Notification (Single): PASS');
        } else {
            console.log('Create Notification (Single): FAIL', notif);
        }

        const list = await fetchJson(`${BASE_URL}/notifications`);
        console.log('List Notifications:', Array.isArray(list) ? 'PASS' : 'FAIL');
    } catch (e) {
        console.log('Notifications Test Failed:', e.message);
    }

    console.log('DONE');
}

testCRUD().catch(console.error);
