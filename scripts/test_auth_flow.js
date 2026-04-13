// Using native fetch (Node 18+)


const API_URL = 'http://172.20.10.5:3000/api/auth';

async function testAuth() {
    console.log('--- Starting Auth Flow Verification ---');

    const testUser = {
        name: 'Test Verify User',
        email: `verify_${Date.now()}@example.com`,
        phone: '1234567890',
        gender: 'Male',
        password: 'password123'
    };

    // 1. Register
    console.log(`\n1. Testing Registration for ${testUser.email}...`);
    try {
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const regData = await regRes.json();

        if (regRes.ok) {
            console.log('✅ Registration Successful');
            console.log('Token received:', !!regData.token);
        } else {
            console.error('❌ Registration Failed:', regData);
            return;
        }
    } catch (e) {
        console.error('❌ Registration Error:', e.message);
        return;
    }

    // 2. Login
    console.log(`\n2. Testing Login for ${testUser.email}...`);
    try {
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, password: testUser.password })
        });
        const loginData = await loginRes.json();

        if (loginRes.ok) {
            console.log('✅ Login Successful');
            console.log('Token received:', !!loginData.token);
        } else {
            console.error('❌ Login Failed:', loginData);
        }
    } catch (e) {
        console.error('❌ Login Error:', e.message);
    }

    // 3. Forgot Password
    console.log(`\n3. Testing Forgot Password for ${testUser.email}...`);
    try {
        const forgotRes = await fetch(`${API_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email })
        });
        const forgotData = await forgotRes.json();

        if (forgotRes.ok) {
            console.log('✅ Forgot Password Successful');
            console.log('Message:', forgotData.message);
        } else {
            console.error('❌ Forgot Password Failed:', forgotData);
        }
    } catch (e) {
        console.error('❌ Forgot Password Error:', e.message);
    }

    console.log('\n--- Verification Complete ---');
}

testAuth();
