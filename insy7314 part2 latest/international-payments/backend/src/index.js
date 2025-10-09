// backend/src/index.js
import dotenv from "dotenv";
dotenv.config();
import express from "express"; // This import is needed for the redirect app
import app from "./app.js";
import { initDB, seedStaff } from "./db/initDB.js";
import fs from "fs";
import https from "https";
import http from "http";

const PORT = process.env.PORT || 5000;
const SSL_PORT = process.env.SSL_PORT || 5443;
const SSL_ENABLED = process.env.SSL_ENABLED === 'true';

(async () => {
  await initDB();
  await seedStaff();

  if (SSL_ENABLED) {
    try {
      const sslOptions = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH)
      };
      
      const httpsServer = https.createServer(sslOptions, app);
      httpsServer.listen(SSL_PORT, () => {
        console.log(`🔒 Secure HTTPS Server running on port ${SSL_PORT}`);
        console.log(`🌐 Access via: https://localhost:${SSL_PORT}`);
      });
      
      // Optional: HTTP redirect server
      const redirectApp = express();
      redirectApp.use((req, res) => {
        res.redirect(`https://${req.headers.host.split(':')[0]}:${SSL_PORT}${req.url}`);
      });
      http.createServer(redirectApp).listen(PORT, () => {
        console.log(`🔁 HTTP redirect server running on port ${PORT}`);
      });
      
    } catch (error) {
      console.error('❌ SSL setup failed:', error.message);
      console.log('🔄 Falling back to HTTP...');
      http.createServer(app).listen(PORT, () => {
        console.log(`✅ HTTP Server running on port ${PORT}`);
      });
    }
  } else {
    http.createServer(app).listen(PORT, () => {
      console.log(`✅ HTTP Server running on port ${PORT}`);
    });
  }
})();