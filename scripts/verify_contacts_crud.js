
const API_URL = 'http://localhost:3000/api/emergency-contacts';

async function testCRUD() {
    console.log('--- Starting Emergency Contacts CRUD Verification ---');

    const newContact = {
        team: 'Test Team',
        phone: '1234567890',
        email: 'test@example.com',
        location: 'Test City',
        priority: 'High',
        description: 'Test Description',
        availability: '24/7'
    };

    let createdId = null;

    // 1. CREATE
    console.log('\n1. Testing CREATE...');
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContact)
        });
        const data = await res.json();

        if (res.ok && data.id) {
            createdId = data.id;
            console.log('✅ CREATE Successful. ID:', createdId);
        } else {
            console.error('❌ CREATE Failed:', data);
            return;
        }
    } catch (e) {
        console.error('❌ CREATE Error:', e.message);
        return;
    }

    // 2. READ (List)
    console.log('\n2. Testing READ (List)...');
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const found = data.find(c => c.id === createdId);

        if (found) {
            console.log('✅ READ List Successful. Found created contact.');
        } else {
            console.error('❌ READ List Failed. Contact not found.');
        }
    } catch (e) {
        console.error('❌ READ Error:', e.message);
    }

    // 3. UPDATE
    console.log('\n3. Testing UPDATE...');
    try {
        const updatePayload = { ...newContact, team: 'Updated Team Name' };
        const res = await fetch(`${API_URL}/${createdId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatePayload)
        });
        const data = await res.json();

        if (res.ok && data.team === 'Updated Team Name') {
            console.log('✅ UPDATE Successful.');
        } else {
            console.error('❌ UPDATE Failed:', data);
        }
    } catch (e) {
        console.error('❌ UPDATE Error:', e.message);
    }

    // 4. DELETE
    console.log('\n4. Testing DELETE...');
    try {
        const res = await fetch(`${API_URL}/${createdId}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            console.log('✅ DELETE Successful.');
        } else {
            console.error('❌ DELETE Failed:', await res.text());
        }
    } catch (e) {
        console.error('❌ DELETE Error:', e.message);
    }

    // 5. VERIFY DELETE
    console.log('\n5. Verifying Deletion...');
    try {
        const res = await fetch(`${API_URL}/${createdId}`);
        if (res.status === 404) {
            console.log('✅ Deletion Verified (404 Not Found).');
        } else {
            console.error('❌ Deletion Verification Failed. Status:', res.status);
        }
    } catch (e) {
        console.error('❌ Verify Error:', e.message);
    }
}

testCRUD();
