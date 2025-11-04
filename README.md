# insy7314Part2Latestversion


INSY7314 - International Payments Platform (Part 2)






🌍 Overview

This section of the POE demonstrates Part 2 of INSY7314 – the development of a secure International Payments Platform which enables authenticated users to perform safe cross-border money transfers. This solution applies DevSecOps, secure full-stack development, cloud hosted database storage, automated pipelines, and static code analysis to ensure stability, security and production reliability.

This README covers:

Platform purpose & functional features

Tech stack layers

Security controls implemented

DevSecOps pipeline verification

Remediation improvements based on feedback

Evidence screenshots

🧾 System Summary

The International Payments Platform is a responsive web application built to allow verified users to process international transfers securely. The system includes both user functionality and seeded staff accounts for controlled administration.

Core User Functions

Secure login using JWT authentication

View transaction history

Make international transfer payments

Server-side encrypted HTTPS communication

Core Staff Functions

Seeded privileged admin accounts

View / monitor all platform transactions

Verify and audit financial activity

🧰 Technology Stack Used
Layer	Technology
Frontend	React.js
Backend	Node.js + Express
Database	PostgreSQL (Render Cloud)
Security	JWT, bcrypt, HTTPS, helmet, express-rate-limit
DevOps	GitHub Actions, npm audit, CircleCI
Version Control	GitHub Repo
🧑‍💻 Developer Start / Run Instructions
Backend
cd international-payments/backend
npm install
npm start

Frontend
cd international-payments/frontend
npm install
npm start

App Access
Component	URL
Frontend UI	http://localhost:3000

Backend API	https://localhost:5443
🔌 API Core Endpoints
Action	Method	Endpoint	Description
Register	POST	/auth/register	Create new user account
Login	POST	/auth/login	Authenticate user & return JWT
Create Payment	POST	/payments	Perform international transfer
View Payments	GET	/payments	Retrieve transaction history
🛡️ Security Summary

HTTPS enforced end-to-end

JWT sessions include expiration

bcrypt hashing with salted rounds from .env

Input validation prevents SQLi / XSS

Helmet + express-rate-limit protects against brute force

GitHub + npm audit ensures dependency security

🔐 DevSecOps Pipeline Summary

All code merged into repo undergoes mandatory validation

CircleCI runs full automated build + scan pipeline

SonarCloud performs static code analysis & vulnerability scanning

Green CI runs verify code integrity & no regression before deployment

🧾 Security Enhancements & Remediation Based on Feedback

CORS moved from permissive * → restricted domains

CSRF & XSS protection added via additional middleware

Centralized validation module created with strict REGEX validation

Structured JSON validation errors implemented

bcrypt salt rounds moved to .env variable for flexibility

Strength-based password rules implemented

Public registration page removed → only staff/admin provision users now

Reduced attack surface & ensured tightly controlled authentication model

These improvements directly address the feedback received and elevate the platform above minimum POE security baseline.
















**POE Evidence Screenshot**


#### CircleCI Main Pipeline Success
![image alt](https://github.com/IdrisK825/insy7314Part2Latestversion/blob/00d67b156d08adaa3f0c7391b552dfc2b8b4d51e/circleci_main_pipeline_success.png.jpg)
This screenshot proves that the CI/CD pipeline executes on the main branch successfully. It confirms that every commit pushed to the repository is automatically validated, built and tested before it can be considered stable. This ensures continuous integration compliance and enforces secure code delivery.







#### Pipeline History / Multiple Runs Successful

![image alt](https://github.com/IdrisK825/insy7314Part2Latestversion/blob/00d67b156d08adaa3f0c7391b552dfc2b8b4d51e/circleci_pipeline_runs_list.jpg)
This screenshot shows historical pipeline execution history with multiple green builds. This demonstrates pipeline stability and consistency over time. The app is not only secure once off, but proves repeatable integrity and reliability through continuous runs.



#### Latest Pipeline Success (Re-run Verification)

![image alt](https://github.com/IdrisK825/insy7314Part2Latestversion/blob/00d67b156d08adaa3f0c7391b552dfc2b8b4d51e/circleci_pipeline_success_last_run.jpg)
This screenshot shows that even when the pipeline is re-triggered manually, it continues to pass successfully. This verifies that the pipeline is deterministic and not dependent on local machines or temporary runtime states.

#### CircleCI Build Steps
![image alt](https://github.com/IdrisK825/insy7314Part2Latestversion/blob/a65b6be2656be4b45892843413b4b92af7c49c1d/circleci_build_steps.jpg)
This screenshot provides evidence of each build stage such as environment setup, dependency installation, test execution, and artifact generation. Each stage is executed inside a controlled isolated CI environment which ensures repeatable, secure and clean builds.

#### Deep Step Detail
![image alt](https://github.com/IdrisK825/insy7314Part2Latestversion/blob/00d67b156d08adaa3f0c7391b552dfc2b8b4d51e/circleci_step_expanded_1.jpg)
This screenshot shows deeper inspection of a pipeline process step. Reviewing internal pipeline steps ensures visibility into environment variables usage, dependency injection and build transparency – a requirement for DevSecOps traceability.

#### GitHub Checks Passed
![image alt](https://github.com/IdrisK825/insy7314Part2Latestversion/blob/00d67b156d08adaa3f0c7391b552dfc2b8b4d51e/github_checks_passed.jpg)
This screenshot shows that GitHub enforces CI checks before allowing code acceptance on the repo. Code cannot be merged unless all pipeline + security checks succeed. This protects against insecure or broken code being deployed to production.


#### SonarCloud Main Branch Passed
![image alt](https://github.com/IdrisK825/insy7314Part2Latestversion/blob/00d67b156d08adaa3f0c7391b552dfc2b8b4d51e/sonarcloud_main_branch_passed.jpg)
This screenshot shows that static code analysis results for the main branch passed with no security critical issues. SonarCloud validates code quality, security vulnerabilities and code smells, ensuring the backend source code adheres to safe development standards.






