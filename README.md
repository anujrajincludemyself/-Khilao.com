# 🍴 खाओ<=>Khilao.com - Food Recipe Sharing Platform

A production-grade full-stack food recipe app where users can discover, share, save, and generate recipes with a polished white-and-blue responsive UI.

🔗 **Live Demo**: [https://khilao-com.vercel.app](https://khilao-com.vercel.app)  
*(Note: Initial load may take 30-60s due to free tier cold start)*

---

## ✨ Features

- **🔐 User Authentication**: Secure signup/login with JWT tokens
- **📝 Recipe Management**: Create, edit, and delete your own recipes
- **📷 Cloud Image Upload**: Image storage with Cloudinary (optimized & CDN-delivered)
- **❤️ Favorites**: Save recipes you love for quick access
- **🔍 Browse All Recipes**: Discover recipes shared by the community
- **👤 My Recipes**: View and manage only your recipes
- **🤖 AI Recipe Studio**: Generate detailed recipes using Groq API with private per-user history
- **🗂️ Private AI History**: Save, reopen, and delete your generated AI recipes from your own account
- **🍲 Detailed AI Output**: AI returns ingredients, step-by-step cooking, equipment, nutrition, storage, reheating, and variations
- **🔒 Private AI Storage**: Generated AI recipes are saved privately in MongoDB and hidden from the public feed
- **🎨 Premium UI Refresh**: White-and-blue production-grade design with responsive cards, forms, hero, and navigation
- **📱 Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **⚡ Performance Optimized**: 
  - Code splitting & lazy loading (48% smaller bundle)
  - Response compression (60-70% reduction)
  - Database indexing (30-50% faster queries)
  - Image lazy loading & optimization
  - Caching headers

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool & dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS 4** - Styling
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage & CDN
- **Multer** - File upload handling
- **Groq API** - AI recipe generation
- **Compression** - Response compression

### Hosting & Infrastructure
- **Backend:** Render (https://khilao-com-e5uj.onrender.com)
- **Frontend:** Vercel (https://khilao-com.vercel.app)
- **Database:** MongoDB Atlas (Cloud NoSQL)
- **Images:** Cloudinary CDN

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd khanabano
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend` folder:
```env
PORT=5000
CONNECTION_STRING=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Groq API (AI recipe generation)
GROQ_API_KEY=your_groq_api_key
```

Start backend server:
```bash
npm start
# Runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend/food-blog-app
npm install

# Optional: point frontend to any backend URL
# Windows (PowerShell):
# setx VITE_API_URL "https://khilao-com-e5uj.onrender.com"

npm run dev
# Runs on http://localhost:5173
```

Frontend API URL behavior:
- Uses `VITE_API_URL` when provided
- Otherwise uses local backend in development (`http://localhost:5000`)
- Uses Render backend in production by default

AI recipe behavior:
- AI generation is protected by login
- AI recipes are saved only for the signed-in user
- The AI page shows a private history list with reopen and delete actions
- If you want to change the model, you can optionally set `GROQ_MODEL` in the backend env

---

## 📦 Deployment

### Backend (Render)

1. Create account on [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
5. Add environment variables (same as `.env` above)
6. Deploy! 🚀

### Frontend (Vercel)

```bash
cd frontend/food-blog-app
npm run build
```

1. Push code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Set project root to `frontend/food-blog-app`
4. Add environment variable:
  - `VITE_API_URL=https://khilao-com-e5uj.onrender.com`
5. Deploy ✨

### ⚡ Prevent Cold Starts (Optional)
Set up [UptimeRobot](https://uptimerobot.com) (free):
- Monitor: `https://khilao-com-e5uj.onrender.com/health`
- Interval: 5 minutes
- Keeps backend warm on Render's free tier

---

## 📁 Project Structure

```
khanabano/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   └── connectionDb.js    # MongoDB connection
│   ├── controller/
│   │   ├── recipe.js          # Recipe CRUD logic
│   │   └── user.js            # User auth logic
  │   ├── aiRecipe.js        # Groq AI recipe generation and history handling
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   ├── models/
│   │   ├── recipe.js          # Recipe schema
│   │   └── user.js            # User schema
  │   ├── aiRecipeHistory.js  # Private AI recipe history collection
│   ├── routes/
│   │   ├── recipe.js          # Recipe API routes
│   │   └── user.js            # User API routes
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Entry point
│
└── frontend/food-blog-app/
    ├── src/
    │   ├── assets/            # Static images
    │   ├── components/
    │   │   ├── Footer.jsx
    │   │   ├── InputForm.jsx  # Login/Signup form
    │   │   ├── MainNavigation.jsx
    │   │   ├── Modal.jsx
    │   │   ├── Navbar.jsx
    │   │   └── RecipeItems.jsx
    │   ├── pages/
    │   │   ├── AddFoodRecipe.jsx
    │   │   ├── EditRecipe.jsx
    │   │   ├── AIRecipe.jsx
    │   │   ├── Home.jsx
    │   │   └── RecipeDetails.jsx
    │   ├── App.jsx            # Router setup
    │   ├── config.js          # API URL config
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🔑 API Endpoints

### Authentication
- `POST /signup` - Create new user
- `POST /login` - User login
- `GET /user/:id` - Get user details

### Recipes
- `GET /recipe` - Get all recipes (with pagination)
- `GET /recipe/:id` - Get single recipe (with populated user)
- `POST /recipe` - Create recipe (**auth required**)
- `PUT /recipe/:id` - Update recipe (**auth + owner required**)
- `DELETE /recipe/:id` - Delete recipe (**auth + owner required**)

### AI Recipes
- `POST /recipe/ai-generate` - Generate a detailed AI recipe (**auth required**)
- `GET /recipe/ai-history` - Get current user's saved AI recipes (**auth required**)
- `DELETE /recipe/ai-history/:id` - Delete one saved AI recipe (**auth required**)

### Health Check
- `GET /health` - Server health status (for monitoring)

---

## 🐛 Troubleshooting

### Images not uploading
- ✅ Check Cloudinary credentials in `backend/.env`
- ✅ Verify file size is under 5MB
- ✅ Check file format (jpg, png, gif, webp only)
- ✅ Confirm Cloudinary upload preset/folder access is valid

### AI recipe generation fails
- ✅ Check `GROQ_API_KEY` in `backend/.env`
- ✅ Ensure the key has active credits/licensing in Groq
- ✅ Optionally set `GROQ_MODEL` if your account uses a different model
- ✅ Make sure you are logged in before generating AI recipes

### "Failed to load dynamically imported module"
```bash
cd frontend/food-blog-app
npm run build
# Redeploy latest frontend build from Vercel
```

### Backend cold start (slow first load)
- Normal on Render's free tier (~30-60 seconds)
- Set up UptimeRobot to prevent cold starts

### CORS errors
- Verify backend URL in `frontend/src/config.js`
- Check CORS settings in `backend/server.js`
- On Vercel, ensure `VITE_API_URL` is set to your Render backend URL

---

## 🚀 Future Enhancements

- 🔍 Advanced search and filtering by ingredients
- 👥 User profile pages
- 💬 Comment and rating system
- 👨‍💼 Admin panel for moderation
- 📱 Progressive Web App (PWA)
- 🌐 Multi-language support
- 📤 Export AI recipes to PDF or shareable links
- 🔎 Recipe search and filter by cuisine or ingredients

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Anuj Raj**

- Website: [खाओ<=>Khilao.com](https://khilao-com.vercel.app)
- GitHub: [@anujrajincludemyself](https://github.com/anujrajincludemyself)

---

## 🙏 Acknowledgments

- Cloudinary for image hosting & CDN
- MongoDB Atlas for cloud database
- Render for backend hosting
- Vercel for frontend hosting

---

## ⭐ Support

If you like this project, please give it a ⭐ on GitHub!  
It helps showcase the work and supports further development.

---

Made with ❤️ by Anuj Raj
