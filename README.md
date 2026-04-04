# Getting start with Moving Service Scheduler System

This system is a full-stack CRUD web application developed for IFN636 Assessment 1.2. The system provide the users to book and manage moving services, while allowing admin to manage bookings, services, staff, and related operations. The project is built using React.js, Node.js, Express.js, and MongoDB, with GitHub Actions used for CI/CD and deployment support.

---

## Project Overview

The Moving Service Scheduler System is designed to simplify the process of scheduling and managing moving services. The system includes two main panels:

### User Panel
- Register and log in
- Manage personal profile
- Create bookings
- View current booking and history
- Update booking information
- Cancel bookings

### Admin Panel
- Log in as admin
- View all bookings
- Update booking status
- Assign staff to bookings
- Manage services
- Manage staff

---

## Technology Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS / CSS styling

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

### DevOps / Deployment
- GitHub
- GitHub Actions
- AWS EC2
- PM2
- Nginx

---

## Project Structure

MovingServiceScheduler/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── test/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── axiosConfig.jsx
│   ├── package.json
│   └── build/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── package.json
└── README.md

## Setup Instructions

### Clone Repository
 - git clone <https://github.com/PeiJing-16/MovingServiceScheduler.git>
 - cd MovingServiceScheduler

 ### Install Dependencies
 - npm run install all

### Backend
- cd backend
- npm install

### Frontend
- cd frontend
- npm install

### Run Backend Test
- cd backend
- npm test / npm run test

## Frontend API Configuration
- Open [frontend/src/axiosConfig.jsx](./frontend/src/axiosConfig.jsx)
- baseURL: 'http://<INSTANCE_PUBLIC_IP>'

## Test Account / Login Details

### User Account
User 1: 
- Email: peijing@test.com
- Password: peijing@123

User 2:
- Email: ben123@test.com
- Password: ben@123

### Admin Account
- Username: admin
- Password: admin@123

## CI/CD

GitHub Actions is used for CI/CD itegration. The workflow supports:
- dependency installation
- frontend build
- backend test execution
- deployment preparation
- file location: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)

---

**GitHub link of the starter project: **[https://github.com/nahaQUT/sampleapp_IFQ636.git](https://github.com/nahaQUT/sampleapp_IFQ636.git)

---