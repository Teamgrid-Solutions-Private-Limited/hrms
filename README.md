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

hrms-backend/
│
├── config/ # Configuration files (e.g., DB connection)
├── controllers/ # Request handlers for routes
├── middleware/ # Custom middleware (auth, error handling)
├── models/ # Mongoose schema definitions
├── routes/ # Express route handlers
├── uploads/ # Uploaded files (e.g., resumes, documents)
├── utils/ # Utility/helper functions
├── .env # Environment variables
├── .gitignore
├── app.js # Express app setup
├── server.js # Server bootstrap
└── README.md # Project documentation


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


