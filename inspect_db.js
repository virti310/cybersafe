const dbPool = require('./db');

async function inspectDb() {
    try {
        const tableQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `;
        const res = await dbPool.query(tableQuery);
        const tables = res.rows.map(r => r.table_name);

        let output = '';
        output += `Tables found: ${tables.join(', ')}\n`;

        for (const table of tables) {
            const colQuery = `
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1;
      `;
            const colRes = await dbPool.query(colQuery, [table]);
            output += `\nSchema for ${table}:\n`;
            // Simple table formatting
            output += 'column_name | data_type | is_nullable\n';
            output += '---|---|---\n';
            colRes.rows.forEach(row => {
                output += `${row.column_name} | ${row.data_type} | ${row.is_nullable}\n`;
            });
        }
        const fs = require('fs');
        fs.writeFileSync('db_schema.txt', output);
        console.log('Schema written to db_schema.txt');
    } catch (err) {
        console.error('Error inspecting DB:', err);
    } finally {
        await dbPool.end();
    }
}

inspectDb();
