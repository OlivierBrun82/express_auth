
import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

export const pool = mysql.createPool({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    connectionLimit: 10, // nombre de connexions simultanées
});

export async function testConnection(){
    const [rows] = await pool.query('SELECT NOW() as now');
    console.log('co a mysql ok a, ' , rows[0].now);
};

// export async function createTable(){
//     await pool.query(`
//         CREATE TABLE IF NOT EXISTS user (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             email VARCHAR(255) NOT NULL UNIQUE,
//             password VARCHAR(255) NOT NULL,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         )
//     `);
// }