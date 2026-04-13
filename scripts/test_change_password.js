
const API_URL = 'http://localhost:3000/api/auth';
const db = require('../db');

async function testChangePassword() {
    console.log('--- Starting Change Password Verification ---');

    const testUser = {
        name: 'Change Pass User',
        email: `changepass_${Date.now()}@example.com`,
        phone: '1234567890',
        gender: 'Male',
        password: 'initialPassword123'
    };

    try {
        // 1. Register
        console.log(`\n1. Registering ${testUser.email}...`);
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        if (!regRes.ok) throw new Error('Registration failed');
        console.log('✅ Registration Successful');

        // 2. Change Password
        console.log('\n2. Changing Password...');
        const newPassword = 'changedPassword789';
        const changeRes = await fetch(`${API_URL}/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                currentPassword: testUser.password,
                newPassword: newPassword
            })
        });

        const changeData = await changeRes.json();
        if (!changeRes.ok) throw new Error(`Change Password failed: ${changeData.error}`);
        console.log('✅ Password Changed Successfully');

        // 3. Login with OLD Password (should fail)
        console.log('\n3. Testing Login with OLD password (expect failure)...');
        const loginOldRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, password: testUser.password })
        });
        if (loginOldRes.ok) throw new Error('Login with OLD password should have failed');
        console.log('✅ Login with OLD password failed as expected');

        // 4. Login with NEW Password
        console.log('\n4. Testing Login with NEW password...');
        const loginNewRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, password: newPassword })
        });
        if (!loginNewRes.ok) throw new Error('Login with NEW password failed');
        console.log('✅ Login with NEW password Successful');

        console.log('\n--- Verification Complete: SUCCESS ---');

    } catch (err) {
        console.error('\n❌ Verification Failed:', err.message);
    } finally {
        process.exit();
    }
}

testChangePassword();
