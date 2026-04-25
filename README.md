# 🚀 KIIT Events Management System

<p align="center">
  A full-stack event management platform for students, societies, and admins.
</p>

---

## 🔗 Live Demo

* 🌐 Frontend: https://kiit-events.vercel.app
* ⚙️ Backend API: https://backend-ol2w.onrender.com

---

## 📌 Overview

KIIT Events is a full-stack web application that allows:

* Students to explore and register for events
* Societies to create and manage events
* Admins to approve or reject event submissions

Built with modern technologies and deployed on cloud platforms.

---

## 🛠️ Tech Stack

| Layer      | Technology        |
| ---------- | ----------------- |
| Frontend   | React + Vite      |
| Backend    | Node.js + Express |
| Database   | SQLite            |
| Deployment | Vercel + Render   |

---

## ✨ Features

### 👨‍🎓 Student

* Browse all events
* Search & filter events
* Register for events

### 🏛️ Society

* Create events
* Edit / delete events
* Add event images via URL

### 🛡️ Admin

* View all events
* Approve / reject events
* Filter events by status

---

## 🔐 Authentication

* Login & Registration system
* Role-based access control

  * Student
  * Society
  * Admin

---

## 🎨 UI/UX

* Responsive design
* Dark / Light mode
* Clean dashboard layout
* Category-based color coding

---

## 🗄️ Database Schema

* **Users** → Stores user details & roles
* **Events** → Stores event data
* **Registrations** → Maps users to events

---

## 📁 Project Structure

```bash
KIIT_EVENTS/
│
├── frontend/        # React + Vite app
├── backend/         # Node + Express API
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

### Frontend (.env)

```
VITE_API_URL=https://backend-ol2w.onrender.com
```

### Backend (.env)

```
PORT=5000
```

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```
git clone https://github.com/mahi-ps/kiit-events.git
cd kiit-events
```

### 2️⃣ Setup Frontend

```
cd frontend
npm install
npm run dev
```

### 3️⃣ Setup Backend

```
cd backend
npm install
node app.js
```

---

## 🌐 Deployment

* Frontend deployed on Vercel
* Backend deployed on Render

---

## 🚧 Future Improvements

### 🔴 High Priority

* Password hashing using bcrypt
* JWT authentication
* API documentation

### 🟡 Nice to Have

* PostgreSQL integration
* CORS restriction
* Loading spinners
* Toast notifications

### 🟢 Bonus Features

* Image upload (file handling)
* Email notifications
* Analytics dashboard
* Mobile UI polish

---

## 💼 Resume Value

This project demonstrates:

* Full-stack development
* REST API design
* Role-based authentication
* CRUD operations
* Deployment on cloud platforms

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Mahi Prasad**

---
