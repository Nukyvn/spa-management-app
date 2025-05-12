import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Thay bằng mật khẩu MySQL
  database: "spa_management",
});

export default pool;