import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { initDB, seedStaff } from "./db/initDB.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // 1️⃣ Initialize database tables
    await initDB();

    // 2️⃣ Seed default staff if not exists
    await seedStaff();

    // 3️⃣ Start Express server
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
})();
