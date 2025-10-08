import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { initDB, seedStaff } from "./db/initDB.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await initDB();
    await seedStaff();
    app.listen(PORT, () => console.log(`✅ Server running securely on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
})();
