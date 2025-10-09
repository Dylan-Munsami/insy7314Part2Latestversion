
// backend/src/index.js
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { initDB, seedStaff } from "./db/initDB.js";

const PORT = process.env.PORT || 5000;

(async () => {
  await initDB();
  await seedStaff();
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
})();
//index.js
