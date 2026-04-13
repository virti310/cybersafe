const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api';

async function req(method, endpoint, body = null) {
    try {
        const opts = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (body) opts.body = JSON.stringify(body);

        const res = await fetch(`${BASE_URL}${endpoint}`, opts);
        const text = await res.text();

        if (!res.ok) {
            return { success: false, status: res.status, error: text };
        }

        try {
            return { success: true, data: JSON.parse(text) };
        } catch (e) {
            return { success: true, data: text }; // Text response like "Deleted successfully"
        }
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function verifyDelete(name, createEndpoint, createBody) {
    console.log(`\n--- Testing ${name} DELETE ---`);

    // 1. Create
    const create = await req('POST', createEndpoint, createBody);
    if (!create.success) {
        console.log(`[${name}] Create Failed: ${create.status} ${create.error}`);
        return;
    }
    const id = create.data.id;
    console.log(`[${name}] Created ID: ${id}`);

    // 2. Delete
    const del = await req('DELETE', `${createEndpoint}/${id}`);
    if (del.success) {
        console.log(`[${name}] Delete PASS`);
    } else {
        console.log(`[${name}] Delete FAIL: ${del.status} ${del.error}`);
    }
}

async function run() {
    console.log('Starting Verification...');

    await verifyDelete('Awareness', '/awareness', { title: 'DelTest', content: 'C', image: '' });

    await verifyDelete('Recovery', '/recovery-guides', { guide: 'DelTest Guide Content', category_id: 1 });
    await verifyDelete('Emergency', '/emergency-contacts', {
        team: 'DelTest Team', priority: 'High', description: 'Desc',
        availability: '24/7', phone: '123', email: 'test@test.com', location: 'Loc'
    });

    await verifyDelete('Categories', '/categories', { name: 'DelCat' });
    await verifyDelete('Policies', '/policies', { title: 'DelPol', content: 'C' });

    console.log('\nDONE');
}

run();
