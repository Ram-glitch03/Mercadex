import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

// We map this from what the user dropped in the chat
const CONNECTION_STRING = 'postgres://postgres.easgnumdjyehpdcikqrn:zaAYCVgcJO3KOZeJ@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true';

const sqlFile = 'C:\\Users\\ramon\\.gemini\\antigravity\\brain\\3a712faa-1919-4c85-ac4c-e81dad208b1e\\supabase_schema.sql';

async function main() {
    console.log('Connecting to Supabase PostgreSQL database...');
    const sql = postgres(CONNECTION_STRING);

    try {
        const query = fs.readFileSync(sqlFile, 'utf8');
        const statements = query.split(';').map(s => s.trim()).filter(s => s.length > 0);

        console.log(`Executing ${statements.length} statements from ${sqlFile}...`);

        for (const stmt of statements) {
            try {
                await sql.unsafe(stmt + ';');
            } catch (err) {
                if (stmt.toUpperCase().includes('DROP')) {
                    console.log(`Ignoring DROP error: ${err.message}`);
                } else {
                    throw err;
                }
            }
        }

        console.log('✅ Base de datos migrada correctamente.');
    } catch (error) {
        console.error('❌ Error migrando base de datos:', error);
    } finally {
        await sql.end();
    }
}

main().catch(console.error);
