require('dotenv').config();
const dbPool = require('../db');

async function cleanUsers() {
    try {
        console.log('--- CLEANING USER EMAILS ---');
        // Update all users where email has whitespace
        const res = await dbPool.query(`
            UPDATE users 
            SET email = TRIM(email) 
            WHERE email != TRIM(email)
            RETURNING id, email
        `);

        if (res.rowCount === 0) {
            console.log('No users needed cleaning.');
        } else {
            console.log(`Cleaned ${res.rowCount} users:`);
            res.rows.forEach(u => console.log(`- ID ${u.id}: Now "${u.email}"`));
        }
    } catch (err) {
        console.error('Error cleaning database:', err);
    } finally {
        if (dbPool.end) await dbPool.end();
    }
}

cleanUsers();
