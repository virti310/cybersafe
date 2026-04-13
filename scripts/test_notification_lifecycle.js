const axios = require('axios');

const API_URL = 'http://localhost:3000/api/notifications';

async function runLifecycleTest() {
    let createdId = null;

    console.log('--- STARTING NOTIFICATION LIFECYCLE TEST ---');

    // 1. CREATE (Add)
    try {
        console.log('\n[1] Testing CREATE...');
        const createRes = await axios.post(API_URL, {
            title: 'Lifecycle Test',
            body: 'Initial content',
            type: 'ALL',
            user_id: null
        });

        if (createRes.status === 200 && createRes.data && createRes.data.msg) {
            // Broadcast doesn't return the object, so let's try a single user one to get an ID easily, 
            // or just fetch latest. Let's send a Single one to make tracking ID easier.
            const singleRes = await axios.post(API_URL, {
                title: 'Lifecycle Single',
                body: 'To be edited',
                type: 'SINGLE',
                user_id: 1 // Assuming user 1 exists, or just use a dummy ID if foreign key allows? 
                // Actually constraint might exist. Let's iterate list to find our broadcast one if needed.
                // Wait, let's look at route.js. Single returns * (inc id). Broadcast returns msg.
            });
            // Oops, foreign key might fail if user 1 doesn't exist.
            // Let's assume user ID 1 exists from previous seeding or just fetch list.
        }

    } catch (e) {
        console.log('Create failed (might be user_id constraint), trying broadcast lookup...');
    }

    // Let's rely on Broadcast and fetch list.
    await axios.post(API_URL, { title: 'Lifecycle Target', body: 'Target for edit', type: 'ALL', user_id: '' });

    // 2. READ (List)
    try {
        console.log('\n[2] Testing READ...');
        const listRes = await axios.get(API_URL);
        const list = listRes.data;
        const target = list.find(n => n.title === 'Lifecycle Target');

        if (target) {
            console.log('SUCCESS: Found target notification. ID:', target.id);
            createdId = target.id;
        } else {
            console.error('FAILURE: Could not find created notification.');
            return;
        }
    } catch (e) {
        console.error('List failed:', e.message);
        return;
    }

    // 3. UPDATE (Edit)
    try {
        console.log('\n[3] Testing UPDATE...');
        const updateRes = await axios.put(`${API_URL}/${createdId}`, {
            title: 'Lifecycle Target UPDATED',
            body: 'Content has been edited.'
        });

        if (updateRes.status === 200 && updateRes.data.title === 'Lifecycle Target UPDATED') {
            console.log('SUCCESS: Notification updated.');
        } else {
            console.error('FAILURE: Update response mismatch.', updateRes.data);
        }
    } catch (e) {
        console.error('Update failed:', e.message);
    }

    // 4. VERIFY UPDATE
    try {
        const listRes = await axios.get(API_URL);
        const target = listRes.data.find(n => n.id === createdId);
        if (target && target.title === 'Lifecycle Target UPDATED') {
            console.log('VERIFIED: List reflects updated title.');
        } else {
            console.error('FAILURE: List does NOT show update.');
        }
    } catch (e) { console.error(e.message); }

    // 5. DELETE (Remove)
    try {
        console.log('\n[5] Testing DELETE...');
        const delRes = await axios.delete(`${API_URL}/${createdId}`);
        if (delRes.status === 200) {
            console.log('SUCCESS: Notification deleted.');
        }
    } catch (e) {
        console.error('Delete failed:', e.message);
    }

    // 6. VERIFY DELETE
    try {
        const listRes = await axios.get(API_URL);
        const target = listRes.data.find(n => n.id === createdId);
        if (!target) {
            console.log('VERIFIED: Notification is gone from list.');
        } else {
            console.error('FAILURE: Notification still exists in list!');
        }
    } catch (e) { console.error(e.message); }

    console.log('\n--- TEST COMPLETE ---');
}

runLifecycleTest();
