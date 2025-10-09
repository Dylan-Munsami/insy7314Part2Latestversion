import dotenv from "dotenv";
dotenv.config();
import express from "express";
import app from "./app.js";
import { initDB, seedStaff } from "./db/initDB.js";
import fs from "fs";
import https from "https";
import http from "http";

const PORT = process.env.PORT || 5000;
const SSL_PORT = process.env.SSL_PORT || 5443;
const SSL_ENABLED = process.env.SSL_ENABLED === "true";

(async () => {
  await initDB();
  await seedStaff();

  if (SSL_ENABLED && process.env.NODE_ENV === "development") {
    try {
      const sslOptions = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH),
      };

      https.createServer(sslOptions, app).listen(SSL_PORT, () => {
        console.log(`🔒 Secure HTTPS Server running on https://localhost:${SSL_PORT}`);
      });

      const redirectApp = express();
      redirectApp.use((req, res) => {
        res.redirect(`https://localhost:${SSL_PORT}${req.url}`);
      });
      http.createServer(redirectApp).listen(PORT, () => {
        console.log(`🔁 HTTP redirect server running on port ${PORT}`);
      });
    } catch (error) {
      console.error("❌ SSL setup failed:", error.message);
      http.createServer(app).listen(PORT, () => {
        console.log(`✅ HTTP Server running on port ${PORT}`);
      });
    }
  } else {
    // Production / Render
    http.createServer(app).listen(PORT, () => {
      console.log(`✅ HTTP Server running on port ${PORT}`);
      console.log(`🌐 Access via: https://insy7314part2latestversion.onrender.com`);
    });
  }
})();
