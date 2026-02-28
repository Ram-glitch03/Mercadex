import postgres from 'postgres';
import fs from 'fs';

const CONNECTION_STRING = 'postgres://postgres.easgnumdjyehpdcikqrn:zaAYCVgcJO3KOZeJ@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true';
const sqlFile = 'C:\\Users\\ramon\\.gemini\\antigravity\\brain\\3a712faa-1919-4c85-ac4c-e81dad208b1e\\supabase_schema.sql';

async function main() {
    const sql = postgres(CONNECTION_STRING);
    try {
        console.log('Dropping public schema...');
        await sql.unsafe('DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;');

        console.log('Reading schema...');
        const query = fs.readFileSync(sqlFile, 'utf8');

        // Remove the explicit drops from the file since we just wiped the schema
        const statements = query
            .replace(/DROP .*? CASCADE;/g, '')
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (let stmt of statements) {
            console.log(`Executing: ${stmt.substring(0, 50)}...`);
            await sql.unsafe(stmt);
        }

        console.log('✅ Base de datos recreada desde cero.');
    } catch (error) {
        console.error('❌ Error migrando base de datos:', error);
    } finally {
        await sql.end();
    }
}

main().catch(console.error);
