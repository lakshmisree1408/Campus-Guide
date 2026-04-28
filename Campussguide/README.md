# Campus Guide – Local Spot Reviews

A premium, full-stack MERN application explicitly built to help university students map out, rate, and review the best locations near their campus. From finding the perfect espresso at a local cafe, to exploring famous nearby parks, theatres, and museums, this platform bridges the gap between local vendors and the student community through a highly interactive UI.

![Project Status](https://img.shields.io/badge/Status-Complete-success)

---

## 🚀 Tech Stack

### Frontend Architecture
- **React.js**: Component-driven UI library.
- **Vite**: Next-generation, blazing fast development environment and bundler.
- **Tailwind CSS v3**: Utility-first styling framework driving the vibrant, glassmorphism design system.
- **React Router v6**: Client-side dynamic routing mechanism.
- **Axios**: Promised-based HTTP client handling the API communication.
- **Lucide React**: Beautiful, consistent SVG icon library.

### Backend Architecture
- **Node.js + Express.js**: RESTful API and core server-side logic.
- **MongoDB + Mongoose**: Local NoSQL document-based database and Object Data Modeling (ODM).
- **Multer**: Native middleware for handling `multipart/form-data`, enabling secure local image uploads.
- **JSON Web Tokens (JWT)**: Secure, stateless authorization tokens ensuring users can safely interact with their data.
- **bcryptjs**: Core cryptography library deployed to heavily hash user passwords.

---

## 🔥 Features Built

- **Robust Authentication**: Secure registration and login workflows segregated into distinct roles (`student` vs `owner`).
- **Owner Portals**: Business owners have specific access rights, allowing them to open the "Add Spot" portal and publish their venues (Cafes, Restaurants, Theatres, Parks, Museums).
- **Local Image Uploads**: Owners can safely attach visual, high-quality images to their listings directly from their devices via secure Multipart form routes. 
- **Interactive Directory**: Discover campus gems dynamically rendered inside heavily styled Glass-cards. Displays responsive data, including live fallback gradients for images that haven't been provided yet.
- **Community Reviews Platform**: Live 5-star rating mechanisms and textual reviews mapped to specifically linked businesses.
- **Top Rate Leaderboard**: A sleek, algorithmic landing page that strictly identifies the most popular locales on your campus.
- **Data Protection**: Complete session sanitization ensures that backend databases don't throw critical server crashes if user data deletes or resets asynchronously.

---

## 🛠️ Installation & Setup Guide

If you are setting this project up on a completely new terminal or device, follow these exact steps:

### Prerequisites:
1. **Node.js (LTS)** (Required) — [Download Here](https://nodejs.org/)
2. **MongoDB Community Server** (Required for storing data locally) — [Download Here](https://www.mongodb.com/try/download/community)

### Step 1: Run the Backend Server
Open your command prompt or terminal, navigate to the main project folder, then into `backend`:

```bash
cd backend

# 1. Install all backend dependencies
npm install

# 2. Start the Express server
npm start
```
*(You should see `Server running on port 5000` and `MongoDB Connected` output to your terminal indicating a successful database link.)*

### Step 2: Run the Frontend App
Open a **new, separate** command prompt or terminal window, navigate into the `frontend` folder:

```bash
cd frontend

# 1. Install all frontend dependencies
npm install

# 2. Start the Vite React server
npm run dev
```

### Step 3: Jump In!
Observe what port your Vite frontend bound itself to (usually `http://localhost:5173` or `http://localhost:5174`). Open that local URL in any modern browser, register an account, and experience the Campus Guide locally!
