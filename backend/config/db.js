import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const db = new pg.Client({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST
});

console.log(process.env.PGPASSWORD);

db.connect();
export default db;
