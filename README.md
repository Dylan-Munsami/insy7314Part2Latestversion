# insy7314Part2Latestversion


INSY7314 - International Payments Platform (Part 2)

Overview

This section of the POE demonstrates Part 2 of the INSY7314 project - focused on building a secure International Payments Platform which allows users to register, authenticate, and perform safe cross-border payment transactions. This portion highlights the implementation of secure full-stack functionality, DevSecOps practices, cloud database integration, and proof of secure continuous deployment workflows.

The objective was to design a credible, realistic solution that meets modern standards of security, availability, and ease of use while also proving CI/CD, static code analysis, automated dependency checks and pipeline integrity.
 
This README focuses on:

The system purpose

Full functional features

Technology stack used

Security practices implemented

Developer instructions & usage

Proof of DevSecOps execution (screenshots placeholders section at bottom)



System Summary

The International Payments Platform is a responsive web application designed to allow users to make international transfers securely. The platform includes both user-level features and seeded staff account functionality.

Core User Functions:

Secure registration with hashed password storage

Login with JWT token authentication

Create new international payment transactions

View transaction status and history

HTTPS encrypted traffic end-to-end

Core Staff Functions:

Seeded staff accounts with elevated privileges

View and monitor all system transactions

Audit user activity and verify data integrity

Technology Stack Used

Frontend: React.js
Backend: Node.js + Express
Database: PostgreSQL (Render Cloud)
Authentication: JWT + bcrypt password hashing
Security: SSL / HTTPS, Input Validation, Environment Variables
DevOps: GitHub Actions CI/CD + npm audit
Version Control: GitHub Repo Hosting

How To Use the Application (Developer Flow)

Start backend

cd international-payments/backend
npm install
npm start

Start frontend

cd international-payments/frontend
npm install
npm start

Access Application

Frontend: http://localhost:3000

Backend API: https://localhost:5443

| Action         | Method | Endpoint       | Description                       |
| -------------- | ------ | -------------- | --------------------------------- |
| Register       | POST   | /auth/register | Create new user account           |
| Login          | POST   | /auth/login    | Authenticate user and return JWT  |
| Create Payment | POST   | /payments      | Make an international transfer    |
| View Payments  | GET    | /payments      | Retrieve user transaction history |

--Security Summary

SSL / HTTPS protects data transmission

JWT token usage prevents session hijacking

bcrypt hashing protects passwords at rest

Input validation prevents SQL Injection + XSS

Environment variables keep sensitive information out of codebase

GitHub + npm audit ensures dependency security checks remain active



--DevSecOps Pipeline Summary

All code changes go through GitHub repo verification

CircleCI pipeline executes automated builds + scans

SonarCloud performs static code quality and vulnerability analysis

Green pipelines indicate integrity before deployment

Automated checks enforce that insecure code cannot move forward


**POE Evidence Screenshot**

![image alt](https://github.com/IdrisK825/insy7314Part2Latestversion/blob/a65b6be2656be4b45892843413b4b92af7c49c1d/circleci_build_steps.jpg)






