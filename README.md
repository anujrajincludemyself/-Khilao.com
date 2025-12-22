🍽️ Khilao.com (खाओ ⇒ Khilao)


## Hosting & Infrastructure

- Backend server is hosted on Render    👉 https://khilao-com.onrender.com
- MongoDB Atlas is used for cloud database management
- Frontend is built using React (Vite) and deployment is in progress on Netlify
  


Khilao.com is a full-stack food recipe sharing platform where users can discover, create, and manage recipes.
The platform allows users to register, log in, upload recipes with images, and explore dishes shared by others.

🛠️ Status: Backend is successfully deployed. Frontend deployment is in progress.

🚀 Features

🔐 User Authentication (Sign Up / Login using JWT)

🍲 Add new food recipes with image upload

📝 Edit and delete your own recipes

❤️ Mark recipes as favourites

👀 View recipe details with ingredients and instructions

🗂️ Separate views for:

All recipes

My recipes

Favourite recipes

🧑‍💻 Tech Stack
Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

JWT Authentication

Multer (for image uploads)

bcrypt (password hashing)

Frontend

React (Vite)

React Router

Axios

CSS (custom styling)

🌐 Deployment Status
✅ Backend

Deployed on Render

Live API URL:
👉 https://khilao-com.onrender.com

⏳ Frontend

Built using React + Vite

Deployment on Netlify is currently in progress

Environment variables are configured for production API usage

📁 Project Structure
-Khilao.com
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

⚙️ Environment Variables
Backend (.env)
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key

Frontend (Netlify)
VITE_API_URL=https://khilao-com.onrender.com

🧪 Local Development
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend/food-blog-app
npm install
npm run dev
