
var pg = require('pg');
var pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cybersafeapp',
  password: 'Virti@3110',
  port: 5432,
});

async function checkAdmin() {
  try {
    const res = await pool.query("SELECT * FROM users WHERE role = 'admin'");
    console.log('Admin users found:', res.rows.length);
    if (res.rows.length > 0) {
        console.log('Admin credentials:', res.rows[0].email);
    } else {
        console.log('No admin user found.');
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    pool.end();
  }
}

checkAdmin();
