import app from "./app.js";
import dotenv from "dotenv";
import { initDB } from "./db/initDB.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  await initDB(); // Run schema creation on startup
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
})();
