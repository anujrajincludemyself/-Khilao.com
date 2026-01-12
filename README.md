🍽️ Khilao.com — Food Recipe Sharing Platform

**Khilao.com** (खाओ ⇒ Khilao) is a full-stack food recipe sharing platform where users can discover, create, and manage recipes.  
The application allows users to register, log in, upload recipes with images, and explore dishes shared by others in a modern, responsive interface.

🌐 **Live Website:**  
👉 https://khao-khilao.netlify.app  
*(Note: The site may take a few seconds to load as it uses free cloud hosting.)*

---

## 🏗️ Hosting & Infrastructure

- **Backend:** Hosted on Render  
  👉 https://khilao-com.onrender.com  
- **Database:** MongoDB Atlas (Cloud NoSQL Database)  
- **Frontend:** React (Vite) deployed on Netlify  

---

## ✨ Features

- 🔐 Secure user authentication (Sign Up & Login using JWT)
- 🍲 Add new food recipes with image upload
- 📝 Edit and delete your own recipes
- ❤️ Mark recipes as favourites
- 👀 View detailed recipes with ingredients and instructions
- 🗂️ Organized sections:
  - All Recipes  
  - My Recipes  
  - Favourite Recipes  

---

## 🧑‍💻 Tech Stack

### Backend
- Node.js  
- Express.js  
- MongoDB Atlas  
- Mongoose  
- JWT Authentication  
- Multer (Image Uploads)  
- bcrypt (Password Hashing)  

### Frontend
- React (Vite)  
- React Router  
- Axios  
- Custom CSS  

---

## 🌐 Deployment Status

### ✅ Backend  
- Deployed on Render  
- Live API URL:  
  👉 https://khilao-com.onrender.com  

### ✅ Frontend  
- Built using React + Vite  
- Deployed on Netlify  
- Connected to production backend via environment variables  

---

## 🧩 Application Architecture

```
User Browser
      ↓
Netlify (React Frontend)
      ↓
Render (Node + Express Backend)
      ↓
MongoDB Atlas (Cloud Database)
```

---

## 📁 Project Structure

```
Khilao.com
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   └── server.js
│
├── frontend
│   └── food-blog-app
│       ├── src
│       ├── public
│       ├── vite.config.js
│       └── package.json
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`.env`)
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

### Frontend (Netlify)
```
VITE_API_URL=https://khilao-com.onrender.com
```

---

## 🧪 Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend/food-blog-app
npm install
npm run dev
```

---

## 🚀 Future Enhancements

- Advanced search and filtering  
- User profile pages  
- Comment and rating system  
- Admin panel for moderation  
- Mobile app version  

---

## 👨‍💻 Author

**Anuj Raj**  
Full-Stack Developer  
GitHub: https://github.com/anujrajincludemyself  

---

## ⭐ Support

If you like this project, please give it a ⭐ on GitHub.  
It helps showcase the work and supports further development.
