import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const sqlPath = "C:\\Users\\ramon\\.gemini\\antigravity\\brain\\3a712faa-1919-4c85-ac4c-e81dad208b1e\\supabase_schema.sql";
const connectionString = "postgres://postgres.easgnumdjyehpdcikqrn:zaAYCVgcJO3KOZeJ@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true";

async function main() {
    console.log("Connecting to Supabase...");
    const sql = postgres(connectionString, { ssl: 'require' });

    try {
        const schema = fs.readFileSync(sqlPath, 'utf8');
        console.log("Executing schema...");

        await sql.unsafe(schema);

        console.log("Schema execution successful.");
    } catch (err) {
        console.error("Error executing schema:", err);
    } finally {
        await sql.end();
    }
}

main();
