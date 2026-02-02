
const API_URL = 'http://localhost:3000/api/auth';
const db = require('../db');

async function testOTPFlow() {
    console.log('--- Starting OTP Flow Verification ---');

    const testUser = {
        name: 'OTP Test User',
        email: `otp_test_${Date.now()}@example.com`,
        phone: '1234567890',
        gender: 'Female',
        password: 'oldPassword123'
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

        // 2. Forgot Password
        console.log('\n2. Requesting Password Reset...');
        const forgotRes = await fetch(`${API_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email })
        });
        if (!forgotRes.ok) throw new Error('Forgot Password request failed');
        console.log('✅ OTP Sent');

        // 3. Get OTP from DB (Simulating checking email)
        const userRes = await db.query('SELECT reset_otp FROM users WHERE email = $1', [testUser.email]);
        const otp = userRes.rows[0].reset_otp;
        console.log(`ℹ️  OTP Fetched from DB: ${otp}`);

        // 4. Verify OTP
        console.log('\n3. Verifying OTP...');
        const verifyRes = await fetch(`${API_URL}/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, otp })
        });
        if (!verifyRes.ok) throw new Error('OTP Verification failed');
        console.log('✅ OTP Verified');

        // 5. Reset Password
        console.log('\n4. Resetting Password...');
        const newPassword = 'newPassword456';
        const resetRes = await fetch(`${API_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, otp, newPassword })
        });
        if (!resetRes.ok) throw new Error('Password Reset failed');
        console.log('✅ Password Reset Successful');

        // 6. Login with NEW Password
        console.log('\n5. Logging in with NEW password...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, password: newPassword })
        });
        if (!loginRes.ok) throw new Error('Login with new password failed');
        console.log('✅ Login Successful');

        console.log('\n--- Verification Complete: SUCCESS ---');

    } catch (err) {
        console.error('\n❌ Verification Failed:', err.message);
    } finally {
        process.exit();
    }
}

testOTPFlow();
