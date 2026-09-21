# 🍲 Project ResQMeal

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

---

## 📖 Project Description

**ResQMeal** is a full-stack surplus food rescue and donation platform created to bridge the gap between food donors (such as restaurants, caterers, event organizers, and households) and recipients or NGOs in need. 

By facilitating the quick listing, discovery, and claiming of edible surplus food before it goes to waste, ResQMeal helps fight local hunger, supports sustainability, and fosters community-driven relief efforts.

---

## ✨ Features

- **🍽️ Surplus Food Listings**: Donors can list surplus meals with details such as food title, description, quantity, pickup location, and expiry time.
- **🤝 Meal Claiming System**: Registered receivers and NGOs can explore available listings and claim meals in real time.
- **📊 Unified Dashboard**: Track your active donations, past contributions, and claimed meals in an organized interface.
- **🔒 Secure Authentication**: User signup and login powered by JSON Web Tokens (JWT) and `bcryptjs` password encryption.
- **🎨 Modern & Responsive Interface**: Built with React 19, Lucide icons, and responsive layouts for a smooth experience across all screen sizes.
- **⚡ Resilient Backend**: Express 5 server with MongoDB auto-reconnect handling and API health monitoring (`/api/health`).

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: Vanilla CSS with modern design tokens

### **Backend**
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Utilities**: CORS, Dotenv, Nodemon

---

## 📁 Project Structure

```text
Project_ResQMeal/
├── backend/
│   ├── controllers/      # Request handlers (auth, user logic)
│   ├── middleware/       # JWT verification & auth middleware
│   ├── models/           # Mongoose data models (User, Meal)
│   ├── routes/           # REST API routes (authRoutes, mealRoutes)
│   ├── .env.example      # Sample environment variables
│   ├── package.json      # Backend scripts and dependencies
│   └── server.js         # Backend entry point & database connection
│
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios configuration & API helpers
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Authentication & global state contexts
│   │   ├── pages/        # Application views (Home, Dashboard, Donate, Login, Register)
│   │   ├── App.jsx       # Main application layout and routes
│   │   └── main.jsx      # React DOM entry point
│   ├── package.json      # Frontend scripts and dependencies
│   └── vite.config.js    # Vite configuration & proxy settings
│
└── README.md
```

---

## 🚀 Getting Started

Follow these steps to run ResQMeal locally on your machine:

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [MongoDB](https://www.mongodb.com/atlas) (local instance or MongoDB Atlas cluster)

### 2. Clone the Repository

```bash
git clone https://github.com/Aryans4/Project_ResQMeal.git
cd Project_ResQMeal
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

> **Important:** Never commit your `.env` file or sensitive credentials to GitHub.

### 5. Start the Backend

```bash
npm run dev
```

The backend server will start on `http://localhost:5000`.

### 6. Install Frontend Dependencies

Open a new terminal in the project directory and run:

```bash
cd frontend
npm install
```

### 7. Start the Frontend

```bash
npm run dev
```

Open the local URL shown by Vite in your browser (typically `http://localhost:5173`).

---

## 🔄 Application Flow

```text
┌────────────────┐       ┌────────────────┐       ┌────────────────┐
│  Donor Signs Up│  ───> │  Lists Surplus │  ───> │ Meal Marked as │
│   / Logs In    │       │   Food / Meal  │       │  "Available"   │
└────────────────┘       └────────────────┘       └────────────────┘
                                                           │
                                                           ▼
┌────────────────┐       ┌────────────────┐       ┌────────────────┐
│ Both Track via │  <─── │ Meal Status is │  <─── │ Receiver Views │
│ User Dashboard │       │ set to Claimed │       │  & Claims Meal │
└────────────────┘       └────────────────┘       └────────────────┘
```

1. **Authentication**: Users register and log in to receive a secure JWT token.
2. **Donation Creation**: Donors create a meal post with location, quantity, and expiry details.
3. **Meal Discovery**: Available meals appear in the public feed and dashboard for receivers and NGOs.
4. **Claiming**: A receiver claims a meal, updating its status from `available` to `claimed`.
5. **Dashboard Management**: Donors and receivers track their history and active items directly from their dashboards.

---

## 🎯 Goal & Learning

- **Social Impact**: Provide an accessible digital solution to minimize edible food waste and feed underserved communities.
- **Full-Stack Architecture**: Practice end-to-end development using the MERN stack with modern tooling (Vite, React 19, Express 5).
- **Security & State**: Implement protected API endpoints, JWT token management, and role-based frontend flows.
- **Clean Code & Design**: Build responsive UI components with reusable design patterns and organized modular code.

---

## 👤 Author

- **Aryan** — [@Aryans4](https://github.com/Aryans4)
- **Repository**: [Project_ResQMeal](https://github.com/Aryans4/Project_ResQMeal)
