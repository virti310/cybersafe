const dbPool = require('../db');

async function checkDb() {
    try {
        console.log('Checking database tables...');
        const res = await dbPool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Tables:', res.rows.map(r => r.table_name));

        const policies = await dbPool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'policies'
        `);
        console.log('Policies Columns:', policies.rows);

        const faqs = await dbPool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'faqs'
        `);
        console.log('FAQs Columns:', faqs.rows);

    } catch (err) {
        console.error('Error checking DB:', err);
    } finally {
        await dbPool.end();
    }
}

checkDb();
