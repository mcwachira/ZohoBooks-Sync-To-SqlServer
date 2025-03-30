import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

console.log("SQL Server:", process.env.SQLSERVER_HOST);
console.log("Database:", process.env.SQLSERVER_DATABASE);
console.log("User:", process.env.SQLSERVER_USER);
console.log("Password:", process.env.SQLSERVER_PASSWORD);

// SQL Server Connection Configuration
const sqlConfig = {
  user: process.env.SQLSERVER_USER,
  password: process.env.SQLSERVER_PASSWORD,
  server: process.env.SQLSERVER_HOST,
  database: process.env.SQLSERVER_DATABASE,
  port: parseInt(process.env.SQLSERVER_PORT, 10), // Ensure it's a number
  options: {
    encrypt: false, // Set to true for Azure
    trustServerCertificate: true, // Required for local development
  },
};

// Global connection pool
let poolPromise;

async function connectSqlServer() {
  try {
    if (!poolPromise) {
      poolPromise = await sql.connect(sqlConfig);
      console.log("✅ Connected to SQL Server");
    }
    return poolPromise;
  } catch (err) {
    console.error("❌ SQL Server Connection Error:", err);
    throw err;
  }
}

export default connectSqlServer;
