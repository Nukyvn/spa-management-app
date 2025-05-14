import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'gapxpqcv_spa_management',
  password: process.env.DB_PASSWORD || 'panda.store',
  database: process.env.DB_NAME || 'gapxpqcv_spa_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;