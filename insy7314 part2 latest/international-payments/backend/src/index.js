import dotenv from "dotenv";
dotenv.config();
import express from "express";
import app from "./app.js";
import { initDB, seedStaff, seedCustomers } from "./db/initDB.js";
import fs from "fs";
import https from "https";
import http from "http";

const PORT = process.env.PORT || 5000;
const SSL_PORT = process.env.SSL_PORT || 5443;
const SSL_ENABLED = process.env.SSL_ENABLED === "true";

(async () => {
  await initDB();
  await seedStaff();
  await seedCustomers();

  if (SSL_ENABLED) {
    const sslOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    };
    https.createServer(sslOptions, app).listen(SSL_PORT, () =>
      console.log(`🔒 HTTPS running on https://localhost:${SSL_PORT}`)
    );

    const redirectApp = express();
    redirectApp.use((req, res) => res.redirect(`https://localhost:${SSL_PORT}${req.url}`));
    http.createServer(redirectApp).listen(PORT, () => console.log(`🔁 HTTP redirect running on port ${PORT}`));
  } else {
    http.createServer(app).listen(PORT, () =>
      console.log(`✅ HTTP Server running on port ${PORT}`)
    );
  }
})();
