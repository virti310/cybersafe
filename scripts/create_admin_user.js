
const API_URL = 'http://localhost:3000/api/auth';

async function createAdmin() {
    console.log('--- Creating/Verifying Admin User ---');

    const adminUser = {
        name: 'System Admin',
        email: 'admin@cybersafe.com',
        phone: '0000000000',
        gender: 'Other',
        password: 'admin123'
    };

    console.log(`Attempting to register ${adminUser.email}...`);
    try {
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminUser)
        });

        const regData = await regRes.json();

        if (regRes.ok) {
            console.log('✅ Admin User Created Successfully');
            console.log('Email:', adminUser.email);
            console.log('Password:', adminUser.password);
        } else {
            if (regData.error === 'User already exists') {
                console.log('ℹ️ User already exists. Testing login...');
                const loginRes = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: adminUser.email, password: adminUser.password })
                });

                if (loginRes.ok) {
                    console.log('✅ Login Successful. Credentials are valid.');
                    console.log('Email:', adminUser.email);
                    console.log('Password:', adminUser.password);
                } else {
                    console.log('❌ Login failed. Password might be different.');
                    // In a real scenario we might reset it, but for now let's just inform.
                }
            } else {
                console.error('❌ Registration Failed:', JSON.stringify(regData, null, 2));
            }
        }
    } catch (e) {
        console.error('❌ Error:', e.message);
    }
}

createAdmin();
