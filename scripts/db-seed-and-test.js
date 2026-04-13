const { Pool } = require('pg');
const fetch = require('node-fetch');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cybersafeapp',
    password: 'Virti@3110',
    port: 5432,
});

const BASE_URL = 'http://localhost:3001/api';

async function fetchJson(url, options) {
    const res = await fetch(url, options);
    const text = await res.text();
    try {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${text}`);
        return JSON.parse(text);
    } catch (e) {
        throw new Error(`API Error ${url}: ${e.message}`);
    }
}

async function run() {
    try {
        console.log('--- Seeding User ---');
        // Ensure at least one user exists
        let userId;
        const userCheck = await pool.query('SELECT id FROM users LIMIT 1');
        if (userCheck.rows.length > 0) {
            userId = userCheck.rows[0].id;
            console.log('Found existing user ID:', userId);
        } else {
            const insert = await pool.query(
                "INSERT INTO users (username, email, password) VALUES ('testadmin', 'test@admin.com', 'hashedpassword') RETURNING id"
            );
            userId = insert.rows[0].id;
            console.log('Created new user ID:', userId);
        }

        console.log('--- Testing Awareness API ---');
        try {
            const awareness = await fetchJson(`${BASE_URL}/awareness`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'Test Article', content: 'Content', image: 'test.jpg' })
            });
            console.log('Created Awareness:', awareness.title === 'Test Article' ? 'PASS' : 'FAIL');
        } catch (e) {
            console.error(e.message);
        }

        console.log('--- Testing Notifications API with User ID:', userId, '---');
        try {
            const notif = await fetchJson(`${BASE_URL}/notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'Test Alert', body: 'Test Message', type: 'SINGLE', user_id: userId })
            });
            console.log('Created Notification:', notif.title === 'Test Alert' ? 'PASS' : 'FAIL');
        } catch (e) {
            console.error(e.message);
        }

        console.log('DONE');
    } catch (globalErr) {
        console.error('Fatal Error:', globalErr);
    } finally {
        pool.end();
    }
}

run();
