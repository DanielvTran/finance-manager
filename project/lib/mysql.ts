import mysql2 from "mysql2";

// Use a connection pool for efficient handling of multiple concurrent requests
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection when the module is first loaded
pool.getConnection((error, connection) => {
  if (error) {
    console.error("Error connecting to MySQL database:", error);
  } else {
    console.log("Connected to MySQL database");
    connection.release();
  }
});

export default pool;
