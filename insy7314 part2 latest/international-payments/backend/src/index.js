// backend/src/index.js
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { initDB, seedStaff } from "./db/initDB.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    console.log("🚀 Starting backend initialization...");
    await initDB();
    await seedStaff();

    app.listen(PORT, () => {
      console.log(`✅ Server running and listening on port ${PORT}`);
      if (process.env.NODE_ENV !== "production") {
        console.log(`🌐 Access API at: http://localhost:${PORT}`);
      }
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
})();
