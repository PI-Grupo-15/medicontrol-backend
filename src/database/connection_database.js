import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const connectionString = process.env.DB_PASSWORD;

export const db = new Pool({
    allowExitOnIdle: true,
    connectionString
});

try {
    await db .query('SELECT NOW()');
    console.log('DATABASE connected');
} catch (error) {
    console.log(error);
}

