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
            return { success: true, data: text }; // Text response
        }
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function verifyEntity(name, createEndpoint, createBody) {
    console.log(`\n--- Testing ${name} CRUD ---`);

    // 1. Create
    const create = await req('POST', createEndpoint, createBody);
    if (!create.success) {
        console.log(`[${name}] Create Failed: ${create.status} ${create.error}`);
        return;
    }
    const id = create.data.id;
    console.log(`[${name}] Created ID: ${id}`);

    // update variable for delete url
    let deleteUrl = `${createEndpoint}/${id}`;

    // 2. Update (Try PUT if available - mostly for Cats/Policies/Awareness)
    // We try to just change one field.
    if (name === 'Categories') {
        await req('PUT', `${createEndpoint}/${id}`, { name: createBody.name + '_Updated' });
    } else if (name === 'Policies') {
        await req('PUT', `${createEndpoint}/${id}`, { title: createBody.title, content: 'Updated Content' });
    }

    // 3. Delete
    const del = await req('DELETE', deleteUrl);
    if (del.success) {
        console.log(`[${name}] Delete PASS`);
    } else {
        console.log(`[${name}] Delete FAIL: ${del.status} ${del.error}`);
    }
}

async function run() {
    await verifyEntity('Awareness', '/awareness', { title: 'TestArticle', content: 'C', image: '' });
    await verifyEntity('Recovery', '/recovery-guides', { guide: 'TestGuide', category_id: 1 });
    await verifyEntity('Emergency', '/emergency-contacts', {
        team: 'TestTeam', priority: 'High', description: 'D',
        availability: '24/7', phone: '000', email: 't@t.com', location: 'L'
    });
    await verifyEntity('Categories', '/categories', { name: 'TestCat' });
    await verifyEntity('Policies', '/policies', { title: 'TestPol', content: 'C' });

    console.log('\n--- Test Complete ---');
}

run();
