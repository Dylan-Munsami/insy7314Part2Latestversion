
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const seedStaff = async () => {
  try {
    const username = process.env.SEED_STAFF_USERNAME;
    const password = process.env.SEED_STAFF_PASSWORD;
    const hash = await bcrypt.hash(password, 10);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      );
    `);

    const existing = await pool.query("SELECT * FROM staff WHERE username=$1", [username]);
    if (existing.rows.length > 0) {
      console.log("✅ Staff user already exists.");
      process.exit(0);
    }

    await pool.query(
      "INSERT INTO staff (username, password_hash) VALUES ($1, $2)",
      [username, hash]
    );

    console.log(`✅ Staff user '${username}' created successfully.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding staff:", err.message);
    process.exit(1);
  }
};

seedStaff();

