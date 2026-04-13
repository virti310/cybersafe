const { Pool } = require('pg');   // Capital P

const dbPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cybersafeapp',
  password: 'postgre4904',
  port: 5432,
});

module.exports = dbPool;