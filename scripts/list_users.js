require('dotenv').config();
const dbPool = require('../db');

async function listUsers() {
    try {
        const res = await dbPool.query('SELECT email FROM users');
        console.log('--- EMAILS IN DB ---');
        res.rows.forEach(r => console.log(`"${r.email}"`)); // Quote to see whitespace
        console.log('--------------------');
    } catch (err) {
        console.error(err);
    } finally {
        if (dbPool.end) await dbPool.end();
    }
}

listUsers();
