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




***-Security Enhancements & Remediation Based on Feedback-**

During the review phase, several security gaps were identified and remediated successfully to strengthen the overall security posture of the International Payments Platform:

Middleware & App Hardening Improvements

Implemented helmet and express-rate-limit to protect against common web vulnerabilities and brute-force frequency attacks.

Updated CORS configuration from * (overly permissive) → to restricted trusted domain access.

Implemented stricter JWT settings ensuring tokens include expiration and cannot be reused after session validity.

Added HTTPS enforcement to ensure all data in transit is encrypted end-to-end.

Added missing CSRF and XSS protection through appropriate middleware controls to sanitize incoming requests and prevent script injection.

Input Validation & Data Protection

Implemented a centralized request validator module.

Applied strict REGEX patterns to all user fields (including account numbers, amounts, SWIFT codes, etc.)

Standardized validation error responses using structured JSON output rather than generic messages.

Increased password security standards and enforced password complexity rules.

Updated bcrypt configuration to use .env controlled salt rounds for hashing instead of hardcoded values.

Authentication / Flow Adjustments

Removed the public self-registration route entirely.

Users can no longer create accounts on the platform directly — only admin/staff can provision accounts.

This prevents fraudulent sign up attempts, lowers attack surface, and aligns platform usage to the intended controlled environment model.

These changes collectively resolve all feedback previously reported and ensure the platform now exceeds the POE’s security criteria standard, demonstrating corrective improvement, DevSecOps maturity and secure coding best practices.























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






