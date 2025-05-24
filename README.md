# HRMS Backend Server

A scalable, secure, and production-ready backend for a Human Resource Management System (HRMS). Built with **Node.js**, **Express.js**, and **MongoDB**, this backend handles core HR functionalities such as employee management, attendance tracking, payroll processing, leave management, file uploads, and authentication using JWT.

---

## 🏗️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **File Uploads:** Multer
- **Environment Configuration:** dotenv

---

## 📁 Project Structure

 ```bash 📦 hrms-backend ├── 📁 config # App configuration (e.g., DB, JWT) ├── 📁 controllers # Route logic and business operations ├── 📁 middleware # Express middleware (auth, error handler) ├── 📁 models # Mongoose schema definitions ├── 📁 routes # API route definitions ├── 📁 uploads # Uploaded files (user documents, resumes) ├── 📁 utils # Helper functions/utilities ├── 📄 app.js # Express app setup ├── 📄 server.js # Entry point to start the server ├── 📄 .env # Environment variables ├── 📄 .gitignore # Files to ignore in Git ├── 📄 package.json # Project metadata and scripts └── 📄 README.md # Project documentation ``` 


---

## 🔐 Features

- **User Authentication & Authorization**
  - Secure login using JWT
  - Role-based access (Admin, HR, Employee)

- **Employee Management**
  - CRUD operations for employee profiles
  - Resume and document uploads using Multer

- **Leave & Attendance**
  - Leave request, approval, and tracking
  - Clock-in/clock-out attendance logging

- **Payroll**
  - Salary generation & tax deductions
  - Payslip generation

- **Notifications**
  - Email or push notifications (Pluggable)


- **🧑‍💼 Roles & Permissions**

| Role     | Permissions                         |
| -------- | ----------------------------------- |
| Admin    | Full access to all resources        |
| HR       | Manage employees, leave, payroll    |
| Employee | View personal data, apply for leave |

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.x
- MongoDB (local or cloud-based)
- npm or yarn

### Installation

```bash
git clone https://github.com/Teamgrid-Solutions-Private-Limited/hrms
cd hrms
npm install
npm start


