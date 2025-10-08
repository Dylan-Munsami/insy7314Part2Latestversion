// backend/src/db/initDB.js
import { pool } from "./db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export async function initDB() {
  const schema = `
  -- Customers table
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='customers' AND xtype='U')
  BEGIN
    CREATE TABLE customers (
      id INT IDENTITY(1,1) PRIMARY KEY,
      full_name NVARCHAR(100) NOT NULL,
      id_number NVARCHAR(20) UNIQUE NOT NULL,
      account_number NVARCHAR(20) UNIQUE NOT NULL,
      password_hash NVARCHAR(MAX) NOT NULL
    )
  END

  -- Payments table
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='payments' AND xtype='U')
  BEGIN
    CREATE TABLE payments (
      id INT IDENTITY(1,1) PRIMARY KEY,
      customer_id INT FOREIGN KEY REFERENCES customers(id),
      amount DECIMAL(12,2) NOT NULL,
      currency NVARCHAR(10) NOT NULL,
      provider NVARCHAR(50) NOT NULL,
      payee_account NVARCHAR(30) NOT NULL,
      swift_code NVARCHAR(20) NOT NULL,
      verified BIT DEFAULT 0,
      created_at DATETIME DEFAULT GETDATE()
    )
  END

  -- Staff table
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='staff' AND xtype='U')
  BEGIN
    CREATE TABLE staff (
      id INT IDENTITY(1,1) PRIMARY KEY,
      name NVARCHAR(100),
      username NVARCHAR(50) UNIQUE NOT NULL,
      password_hash NVARCHAR(MAX) NOT NULL,
      role NVARCHAR(20) DEFAULT 'staff'
    )
  END
  `;

  try {
    const p = await pool;
    await p.request().query(schema);
    console.log("✅ Database tables created/verified successfully");
  } catch (err) {
    console.error("❌ Error initializing database:", err.message);
    throw err;
  }
}

// Seed default staff
export async function seedStaff() {
  try {
    const username = process.env.SEED_STAFF_USERNAME || "staff1";
    const password = process.env.SEED_STAFF_PASSWORD || "StaffPass123!";
    const p = await pool;

    const result = await p.request()
      .input("username", username)
      .query("SELECT * FROM staff WHERE username = @username");

    if (result.recordset.length === 0) {
      const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || "12"));
      await p.request()
        .input("name", "Default Staff")
        .input("username", username)
        .input("password_hash", hash)
        .input("role", "staff")
        .query("INSERT INTO staff (name, username, password_hash, role) VALUES (@name,@username,@password_hash,@role)");
      console.log(`✅ Seeded staff user: ${username}`);
    } else {
      console.log(`ℹ️ Staff user '${username}' already exists`);
    }
  } catch (err) {
    console.error("❌ Error seeding staff:", err.message);
  }
}
