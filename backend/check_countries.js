
const { Client } = require('pg');
const client = new Client({
  connectionString: "postgresql://postgres:postgres@localhost:5410/talleres_mecanicos"
});

async function main() {
  await client.connect();
  const res = await client.query("SELECT * FROM countries;");
  console.log('Countries in DB:', JSON.stringify(res.rows, null, 2));
  await client.end();
}

main().catch(err => console.error(err));
