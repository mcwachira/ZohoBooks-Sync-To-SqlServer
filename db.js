import { Connection, Request } from "tedious";
import dotenv from "dotenv";

dotenv.config();

console.log("SQL Server:", process.env.SQLSERVER_SERVER);
console.log("Database:", process.env.SQLSERVER_DATABASE);
console.log("User:", process.env.SQLSERVER_USER);
console.log("Password:", process.env.SQLSERVER_PASSWORD);

// Explicitly define type to ensure compatibility
const sqlServerConfig = {
  server: process.env.SQLSERVER_SERVER || "localhost", // ✅ Ensure it's just "localhost"
  authentication: {
    type: "default",
    options: {
      userName: process.env.SQLSERVER_USER || "sa",
      password: process.env.SQLSERVER_PASSWORD || "yourpassword",
    },
  },
  options: {
    encrypt: false, // 🔹 Set to `false` for local SQL Server
    database: process.env.SQLSERVER_DATABASE || "yourdatabase",
    port: 1433, // ✅ Define port explicitly
    trustServerCertificate: true,
  },
};

// Create the connection
export const sqlServerConnection = new Connection(sqlServerConfig);

sqlServerConnection.on("connect", (err) => {
  if (err) console.log("SQL SERVER connection failed:", err);
  else console.log("Connected to SQL Server");
});

// Ensure connection is initiated
sqlServerConnection.connect();
