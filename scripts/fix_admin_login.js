
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const passwordsToTry = [
    'Virti@3110',
    'postgres',
    'admin',
    'password',
    '123456',
    'root',
    'cybersafe'
];

async function testConnection(password) {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'cybersafeapp',
        password: password,
        port: 5432,
    });
    try {
        await pool.query('SELECT NOW()');
        console.log(`SUCCESS: Connected with password: '${password}'`);
        return pool;
    } catch (err) {
        // console.log(`Failed with password: '${password}' - ${err.message}`);
        return null;
    }
}

async function fixAdmin() {
    let pool = null;
    let validPassword = null;

    console.log("Testing database passwords...");
    for (const p of passwordsToTry) {
        pool = await testConnection(p);
        if (pool) {
            validPassword = p;
            break;
        }
    }

    if (!pool) {
        console.error("CRITICAL: All password attempts failed. Cannot connect to database.");
        process.exit(1);
    }

    console.log("---------------------------------------------------");
    console.log(`WORKING PASSWORD FOUND: ${validPassword}`);
    console.log("---------------------------------------------------");

    const email = 'admin@cybersafe.com';
    const plainPassword = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    try {
        // Check if user exists
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (res.rows.length > 0) {
            console.log(`User ${email} exists. Updating password and role...`);
            await pool.query(
                `UPDATE users SET password = $1, role = 'admin' WHERE email = $2`,
                [hashedPassword, email]
            );
            console.log("User updated successfully.");
        } else {
            console.log(`User ${email} does not exist. Creating...`);
            await pool.query(
                `INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, 'admin')`,
                ['Admin User', email, hashedPassword]
            );
            console.log("User created successfully.");
        }
    } catch (err) {
        console.error("Error modifying user:", err);
    } finally {
        await pool.end();
    }
}

fixAdmin();
