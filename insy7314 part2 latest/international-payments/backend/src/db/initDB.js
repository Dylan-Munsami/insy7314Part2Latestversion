
// backend/src/db/initDB.js
import { pool } from "./db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export async function initDB() {
  const schema = `
  CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    id_number VARCHAR(20) UNIQUE NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    payee_account VARCHAR(30) NOT NULL,
    swift_code VARCHAR(20) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'staff'
  );
  `;

  try {
    await pool.query(schema);
    console.log("✅ Database initialized successfully");
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

    const { rows } = await pool.query("SELECT * FROM staff WHERE username=$1", [username]);
    if (rows.length === 0) {
      const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || "12"));
      await pool.query(
        "INSERT INTO staff (name, username, password_hash, role) VALUES ($1,$2,$3,$4)",
        ["Default Staff", username, hash, "staff"]
      );
      console.log(`✅ Seeded staff user: ${username}`);
    } else {
      console.log(`ℹ️ Staff user '${username}' already exists`);
    }
  } catch (err) {
    console.error("❌ Error seeding staff:", err.message);
  }
}
//initDB.js
