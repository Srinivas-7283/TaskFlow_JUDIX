# TaskFlow - Full Stack Task Management System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A modern, scalable full-stack web application featuring authentication, real-time task management, and a premium UI. Built for the **Judix Full-Stack Developer Internship**.

---

## 🚀 Key Features

| Category | Features |
|----------|----------|
| **Authentication** | - JWT Secure Login/Register<br>- Password Hashing (Bcrypt)<br>- Protected Routes |
| **Task Management** | - CRUD Operations<br>- **Kanban Board** (Drag & Drop)<br>- Advanced Search & Filtering<br>- File Attachments (Base64) |
| **Advanced UI** | - **Dark/Light Mode** Toggle<br>- Responsive Dashboard<br>- Glassmorphism Design<br>- Loading Skeletons |
| **Extras** | - **Email Notifications** (Welcome/Updates)<br>- **Data Export** (PDF/CSV/JSON)<br>- Analytics Reports |

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React.js (Vite)
- **Styling:** TailwindCSS + PostCSS
- **State:** Context API
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Drag & Drop:** @dnd-kit/core

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT + BcryptJS
- **Email:** Nodemailer
- **Docs:** Swagger UI (OpenAPI)

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Srinivas-7283/TaskFlowManagement_JUDIX.git
cd TaskFlowManagement_JUDIX
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Start Server
npm run dev
```
> Server runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start Client
npm run dev
```
> App runs on `http://localhost:5173`

---

## 🔒 Environment Variables

Create a `.env` file in the `backend` folder:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_super_secret_key

# Email (Optional - for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_app_password
```

---

## 📚 API Documentation

Interactive API docs are available via Swagger UI.
After starting the backend, visit:
**[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

#### Core Endpoints:
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/tasks` - Get all tasks (Filter/Search supported)
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update status (Drag & Drop uses this)


---

## 🤝 Contributing

This project is part of a coding assessment.
Created by **Yamparala Srinivas**.