const { Pool } = require('pg');   // Capital P

const dbPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cybersafeapp',
  password: 'Virti@3110',
  port: 5432,
});

module.exports = dbPool;