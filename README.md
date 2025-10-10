# insy7314Part2Latestversion



 🌍 International Payments Platform

Secure, modern, and intuitive web app for managing international money transfers.

---

 Overview

The International Payments Platform enables users to register, log in, and make secure cross-border transactions.
It was built as part of the INSY7314 course to demonstrate full-stack application design, database integration, and secure DevSecOps practices.

---

 Features

 User Features

* Create an account securely with password hashing
* Login with JWT authentication
* Make international payments between accounts
* View payment history and transaction status
* Secure HTTPS connections (SSL-enabled)
* Responsive design for desktop and mobile

 Staff Features

* **Seeded staff accounts** for administration
* **View and manage user transactions**
* **Monitor system security**

---

 Technology Stack

| Layer        | Technology               | Description                                        |
| ------------ | ------------------------ | -------------------------------------------------- |
| **Frontend** | React.js                 | Dynamic, responsive UI built with Create React App |
| **Backend**  | Node.js + Express        | RESTful API serving user and transaction data      |
| **Database** | PostgreSQL (Render)      | Stores user, account, and payment information      |
| **Security** | HTTPS (SSL), JWT, bcrypt | End-to-end encryption and secure authentication    |
| **DevOps**   | GitHub Actions           | Automated pipeline for security checks and builds  |
| **Hosting**  | Render / Localhost       | Cloud-based or local deployment support            |

---

 How to Use the App

 Step 1 — Registration

1. Visit the frontend page (usually: `http://localhost:3000` or your deployed URL).
2. Click **Register**.
3. Fill in your details and create a secure password.
4. Submit to create your account.

---

 Step 2 — Login

1. Go to the **Login** page.
2. Enter your account number and password.
3. On success, you’ll be redirected to your dashboard.

---

 Step 3 — Make a Payment

1. Navigate to **Payments** or **Transfer** section.
2. Enter the recipient’s account and amount.
3. Confirm to process the payment.
4. You’ll receive a confirmation message once successful.

---

 Step 4 — View Transactions

1. Go to the **History** tab.
2. See all previous transactions and their statuses (Completed, Pending, Failed).

---

 Staff Users

Staff accounts can log in using the **seeded credentials**:

```
Username: staff1
Password: StaffPass123!
```

Staff can:

* View all transactions
* Verify or update records
* Manage system data

---

 Security Highlights

 **SSL/HTTPS** — all traffic is encrypted (self-signed cert in dev)
 **JWT Authentication** — secure token-based sessions
 **Password Hashing** — bcrypt with salted hashes
 **Input Validation** — prevents SQL injection and XSS
 **Environment Variables** — sensitive data kept out of code

---

 System Architecture

```
Frontend (React)
   ↓
Backend API (Node.js + Express)
   ↓
PostgreSQL Database (Render Cloud)
```

The backend exposes secure REST endpoints for registration, authentication, and transactions, while the frontend interacts via HTTPS.

---

 Example API Flow

| Action         | Method | Endpoint         | Description                  |
| -------------- | ------ | ---------------- | ---------------------------- |
| Register       | `POST` | `/auth/register` | Create new user              |
| Login          | `POST` | `/auth/login`    | Authenticate and issue token |
| Get Payments   | `GET`  | `/payments`      | Retrieve user transactions   |
| Create Payment | `POST` | `/payments`      | Initiate new payment         |

---

 Technologies Summary

* **Frontend:** React, Axios, HTML5, CSS3
* **Backend:** Node.js, Express, JWT, bcrypt
* **Database:** PostgreSQL
* **Security:** SSL, Environment Variables
* **DevOps:** GitHub Actions (CI/CD, npm audit)
* **Version Control:** Git + GitHub



 Developer Notes

If you’re developing locally:

1. Start backend:

   ```bash
   cd international-payments/backend
   npm install
   npm start
   ```
2. Start frontend:

   ```bash
   cd international-payments/frontend
   npm install
   npm start
   ```
3. Visit:

   ```
   Frontend → http://localhost:3000
   Backend → https://localhost:5443
   ```



## 📘 License

This project was developed for educational use as part of the **INSY7314 Information Systems** coursework.

---

Would you like me to make this into a **ready-to-download `README.md` file** (formatted perfectly for GitHub, with emoji, headings, and tables intact)?
