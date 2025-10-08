// backend/src/db/db.js
import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

// Connection string for LocalDB with Windows Authentication
const connectionString = "Server=(localdb)\\MSSQLLocalDB;Database=SwiftPayDB;Trusted_Connection=True;Encrypt=false;";

export const pool = sql.connect(connectionString)
  .then(pool => {
    console.log("✅ SQL Server connected successfully");
    return pool;
  })
  .catch(err => {
    console.error("❌ SQL Server connection failed:", err.message);
    process.exit(1);
  });
