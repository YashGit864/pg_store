import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const {PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT} = process.env;

const db = new pg.Client({
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    port: PGPORT,
    host: PGHOST,
});


db.connect();
export default db;