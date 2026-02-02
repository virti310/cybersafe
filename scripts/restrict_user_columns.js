const pool = require('../db');

async function restrictUserColumns() {
    try {
        console.log('🔌 Connecting to database...');

        // 1. Check data lengths first
        console.log('🔍 Checking existing data constraints...');

        // Check max length of current passwords
        const passRes = await pool.query('SELECT max(length(password)) as len FROM users');
        const maxPassLen = passRes.rows[0].len;
        console.log(`   - Max existing password length: ${maxPassLen}`);

        // Check max length of current phones
        const phoneRes = await pool.query('SELECT max(length(phone)) as len FROM users');
        const maxPhoneLen = phoneRes.rows[0].len;
        console.log(`   - Max existing phone length: ${maxPhoneLen}`);

        // 2. Define Limits
        const PASS_LIMIT = 60; // Bcrypt hash needs 60 chars
        const PHONE_LIMIT = 10; // User requested 10.

        if (maxPassLen > PASS_LIMIT) {
            console.error(`❌ Cannot set Password limit to ${PASS_LIMIT}, data has length ${maxPassLen}. Aborting.`);
            process.exit(1);
        }
        if (maxPhoneLen > PHONE_LIMIT) {
            console.error(`❌ Cannot set Phone limit to ${PHONE_LIMIT}, data has length ${maxPhoneLen}. Aborting.`);
            process.exit(1);
        }

        // 3. Alter Columns
        console.log('🔄 Applying constraints...');

        // Using CHAR(60) for password as hashes are fixed length
        // Using VARCHAR(10) for phone
        await pool.query(`ALTER TABLE users ALTER COLUMN password TYPE CHAR(${PASS_LIMIT})`);
        console.log(`   ✅ Password column set to CHAR(${PASS_LIMIT})`);

        await pool.query(`ALTER TABLE users ALTER COLUMN phone TYPE VARCHAR(${PHONE_LIMIT})`);
        console.log(`   ✅ Phone column set to VARCHAR(${PHONE_LIMIT})`);

        console.log('🎉 User table constraints updated successfully!');

    } catch (err) {
        console.error('Script Error:', err.message);
    }

    setTimeout(() => process.exit(0), 1000);
}

restrictUserColumns();
