const fetch = require('node-fetch');

// Use 3001 if verifying against temp server, or 3000 if main is running.
// If using main, ensure it is restarted. The user was asked to restart.
// We'll trust user restarted and test 3000.
const BASE_URL = 'http://localhost:3000/api';

async function fetchJson(url, options) {
    const res = await fetch(url, options);
    const text = await res.text();
    try {
        if (!res.ok) throw new Error(`${res.status}: ${text}`);
        return JSON.parse(text);
    } catch (e) {
        throw new Error(`API Error ${url}: ${e.message}`);
    }
}

async function verifyAll() {
    try {
        console.log('--- Testing Categories CRUD ---');
        // Create
        let cat = await fetchJson(`${BASE_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'TestCat' })
        });
        console.log('Create Cat:', cat.name === 'TestCat' ? 'PASS' : 'FAIL');

        // Update
        cat = await fetchJson(`${BASE_URL}/categories/${cat.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'UpdatedCat' })
        });
        console.log('Update Cat:', cat.name === 'UpdatedCat' ? 'PASS' : 'FAIL');

        // Delete
        await fetchJson(`${BASE_URL}/categories/${cat.id}`, { method: 'DELETE' });
        console.log('Delete Cat: PASS');


        console.log('--- Testing Policies CRUD ---');
        // Create
        let pol = await fetchJson(`${BASE_URL}/policies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Terms', content: 'Terms 1.0' })
        });
        console.log('Create Policy:', pol.title === 'Terms' ? 'PASS' : 'FAIL');

        // Update
        pol = await fetchJson(`${BASE_URL}/policies/${pol.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Terms V2', content: 'Terms 2.0' })
        });
        console.log('Update Policy:', pol.title === 'Terms V2' ? 'PASS' : 'FAIL');

        // Delete
        await fetchJson(`${BASE_URL}/policies/${pol.id}`, { method: 'DELETE' });
        console.log('Delete Policy: PASS');

    } catch (e) {
        console.error('FAILED:', e.message);
    }
    console.log('DONE');
}

verifyAll();
