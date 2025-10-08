
// backend/src/index.js
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { initDB, seedStaff } from "./db/initDB.js";

const PORT = process.env.PORT || 5000;

/**
 * Initialize database, seed default staff, and start server
 */
(async () => {
  try {
    console.log("🚀 Starting backend initialization...");

    // Initialize database schema/tables
    await initDB();
    console.log("✅ Database initialized successfully");

    // Seed default staff user (if not exists)
    await seedStaff();
    console.log("✅ Staff seeding completed");

    // Start the Express app
    app.listen(PORT, () => {
      console.log(`✅ Server running and listening on port ${PORT}`);
      console.log(`🌐 Access API at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error.message);
    console.error(error.stack);
    process.exit(1); // Exit process if initialization fails
  }
})();

