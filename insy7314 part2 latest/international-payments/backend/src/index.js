import app from "./app.js";
import dotenv from "dotenv";
import { initDB } from "./db/initDB.js";
import { pool } from "./db/db.js";
import bcrypt from "bcrypt";

dotenv.config();

const PORT = process.env.PORT || 5000;

const seedStaff = async () => {
  const username = process.env.SEED_STAFF_USERNAME;
  const password = process.env.SEED_STAFF_PASSWORD;

  if (!username || !password) {
    console.log("❌ Missing SEED_STAFF_USERNAME or SEED_STAFF_PASSWORD");
    return;
  }

  try {
    const existing = await pool.query("SELECT * FROM staff WHERE username=$1", [username]);
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS) || 10);
      await pool.query("INSERT INTO staff (username, password_hash) VALUES ($1, $2)", [username, hash]);
      console.log("✅ Seeded staff user:", username);
    } else {
      console.log("ℹ️ Staff user already exists:", username);
    }
  } catch (err) {
    console.error("❌ Error seeding staff user:", err.message);
  }
};

(async () => {
  await initDB(); // Run schema creation on startup
  await seedStaff(); // Seed default staff user
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
})();
