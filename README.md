# TaskFlow — Personal Task Manager SPA

A full-stack Single Page Application built with React, Node.js, Express, and MongoDB.

**Frontend → Vercel** | **Backend → Railway** | **Database → MongoDB Atlas**

---

## 🚀 Live Demo

> Add your live URLs here after deployment:
> - Frontend: `https://taskflow-xxx.vercel.app`
> - Backend:  `https://taskflow-xxx.up.railway.app`

---

## ✨ Features

- **User Authentication** — Signup, login, logout with JWT tokens + HTTP-only cookies + sessions
- **Task CRUD** — Create, read, update, delete tasks with real-time feedback
- **Smart Dashboard** — Stats overview (total, in-progress, completed, overdue) + quick add
- **Advanced Filtering** — Filter by status, priority, category; sort by date or priority
- **Search** — Live client-side search across all tasks
- **Form Validation** — Client-side and server-side validation on all forms
- **Responsive Design** — Bootstrap 5 + SASS, works on desktop, tablet, and mobile
- **Progressive Web App** — Service worker, offline support, installable on mobile
- **SSL** — Vercel and Railway both provide HTTPS automatically

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router 6, SASS, Bootstrap 5, Axios |
| Backend | Node.js, Express.js, JWT, express-session, bcryptjs |
| Database | MongoDB + Mongoose |
| Hosting | Vercel (frontend) + Railway (backend) |
| DB Hosting | MongoDB Atlas |

---

## 📁 Project Structure

```
taskflow/
├── server/                    ← Deploy to Railway
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/User.js
│   ├── models/Task.js
│   ├── routes/auth.js
│   ├── routes/tasks.js
│   └── index.js
├── client/                    ← Deploy to Vercel
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── service-worker.js
│   ├── src/
│   │   ├── components/
│   │   ├── context/AuthContext.js
│   │   ├── pages/
│   │   ├── styles/main.scss
│   │   ├── utils/api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── vercel.json
│   └── .env.production
├── railway.toml
├── .env
└── package.json
```

---

## ⚙️ Local Development Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Install all dependencies
```bash
npm run install-all
```

### 3. Set up backend env
```bash
# Edit .env in the root folder
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=any_long_random_string
SESSION_SECRET=another_long_random_string
CLIENT_URL=http://localhost:3000
```

### 4. Set up frontend env
```bash
# client/.env — leave REACT_APP_API_URL empty for local dev
REACT_APP_API_URL=
```

### 5. Run both servers
```bash
npm run dev
# Backend → http://localhost:5000
# Frontend → http://localhost:3000
```

---

## 🌐 Deployment Guide

### Step 1 — MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → create free cluster
2. Create a database user (username + password)
3. Whitelist all IPs: `0.0.0.0/0`
4. Copy your connection string:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/taskflow
   ```

---

### Step 2 — Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**
2. Select the `taskflow` repo
3. Railway auto-detects Node.js via `railway.toml`
4. Go to **Variables** tab and add:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | any long random string |
| `SESSION_SECRET` | any long random string |
| `CLIENT_URL` | your Vercel URL (add after Step 3) |
| `PORT` | leave blank — Railway sets this automatically |

5. Click **Deploy** → wait for it to go live
6. Copy your Railway URL: `https://taskflow-xxx.up.railway.app`
7. Test the health check: `https://taskflow-xxx.up.railway.app/api/health`

---

### Step 3 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project → Import Git Repository**
2. Select the `taskflow` repo
3. Set **Root Directory** to `client`
4. Framework preset: **Create React App**
5. Go to **Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `REACT_APP_API_URL` | your Railway URL (e.g. `https://taskflow-xxx.up.railway.app`) |

6. Click **Deploy** → wait for it to go live
7. Copy your Vercel URL: `https://taskflow-xxx.vercel.app`

---

### Step 4 — Connect Frontend ↔ Backend

1. Go back to **Railway** → your service → **Variables**
2. Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://taskflow-xxx.vercel.app
   ```
3. Railway will auto-redeploy with the new CORS setting ✅

---

## 📡 API Endpoints

### Auth — `/api/auth`
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/signup` | Register new user | Public |
| POST | `/login` | Login user | Public |
| POST | `/logout` | Logout user | Private |
| GET | `/me` | Get current user | Private |

### Tasks — `/api/tasks`
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/` | Get all tasks + stats | Private |
| POST | `/` | Create a task | Private |
| GET | `/:id` | Get single task | Private |
| PUT | `/:id` | Update a task | Private |
| DELETE | `/:id` | Delete a task | Private |

**Query params:** `?status=todo&priority=high&category=work&sort=dueDate`

---

## 👤 Author

**Ahmed Abouzid**  
Full-Stack Web Development — Westcliff University  
Project 3 — WEB503/803

---

## 📄 License

MIT
