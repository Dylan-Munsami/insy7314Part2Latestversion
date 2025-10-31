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

// Seed customers (no registration)
export async function seedCustomers() {
  const customers = [
    { full_name: "Alice Johnson", id_number: "100001", account_number: "200001", password: "CustPass1!" },
    { full_name: "Bob Smith", id_number: "100002", account_number: "200002", password: "CustPass2!" },
    { full_name: "Charlie Brown", id_number: "100003", account_number: "200003", password: "CustPass3!" },
    { full_name: "Diana Prince", id_number: "100004", account_number: "200004", password: "CustPass4!" },
    { full_name: "Ethan Hunt", id_number: "100005", account_number: "200005", password: "CustPass5!" },
  ];

  for (let cust of customers) {
    const existing = await pool.query("SELECT * FROM customers WHERE account_number=$1", [cust.account_number]);
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash(cust.password, parseInt(process.env.SALT_ROUNDS || "12"));
      await pool.query(
        "INSERT INTO customers (full_name, id_number, account_number, password_hash) VALUES ($1,$2,$3,$4)",
        [cust.full_name, cust.id_number, cust.account_number, hash]
      );
      console.log(`✅ Seeded customer: ${cust.full_name}`);
    }
  }
}
