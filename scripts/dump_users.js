require('dotenv').config();
const dbPool = require('../db');
const fs = require('fs');
const path = require('path');

async function dumpUsers() {
    try {
        const res = await dbPool.query('SELECT id, email, username FROM users');
        const dumpPath = path.join(__dirname, 'users_dump.txt');

        let content = '--- USER DUMP ---\n';
        res.rows.forEach(u => {
            // detailed inspection of email: show codes for non-printable chars
            const emailDebug = u.email.split('').map(c => {
                const code = c.charCodeAt(0);
                return (code < 33 || code > 126) ? `[${code}]` : c;
            }).join('');

            content += `ID: ${u.id}, Email: "${u.email}", Debug: "${emailDebug}"\n`;
        });

        fs.writeFileSync(dumpPath, content);
        console.log('Dumped users to users_dump.txt');
    } catch (err) {
        console.error(err);
    } finally {
        if (dbPool.end) await dbPool.end();
    }
}

dumpUsers();
