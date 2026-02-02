
const API_URL = 'http://localhost:3000/api/auth';

async function testAuth() {
    console.log('--- Starting Auth Flow Verification (Port 3001) ---');

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
            console.error('❌ Registration Failed:', JSON.stringify(regData, null, 2));
            return;
        }
    } catch (e) {
        console.error('❌ Registration Error:', e.message);
        return;
    }
}

testAuth();
