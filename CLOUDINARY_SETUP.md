# Cloudinary Setup Instructions

## ✅ What Changed
- Images now upload to **Cloudinary** (cloud storage) instead of local filesystem
- Works on Render without issues (no more ephemeral storage problem)
- Automatic image optimization (800x800 max, quality compression)
- Old images auto-deleted when updating/deleting recipes

## 🚀 Setup Steps

### 1. Create FREE Cloudinary Account
1. Go to https://cloudinary.com
2. Click "Sign Up for Free"
3. Verify your email

### 2. Get Your Credentials
1. Login to Cloudinary Dashboard
2. Click **"Programmable Media"** → **"Dashboard"**
3. Copy these 3 values:
   - **Cloud Name**
   - **API Key**  
   - **API Secret**

### 3. Update Environment Variables

#### Local Development (.env file):
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

#### Render Production:
1. Go to your Render backend service
2. Click **"Environment"** tab
3. Add these 3 variables:
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your api key
   - `CLOUDINARY_API_SECRET` = your api secret
4. Click **"Save Changes"**

### 4. Deploy

```bash
# Backend
cd backend
git add .
git commit -m "Add Cloudinary image storage"
git push

# Frontend
cd ../frontend/food-blog-app
npm run build
# Deploy dist folder to Netlify
```

## 📦 What's Included

### New Packages:
- `cloudinary` - Cloudinary SDK
- `multer-storage-cloudinary` - Multer storage engine for Cloudinary

### New Files:
- `backend/config/cloudinary.js` - Cloudinary configuration
- `backend/.env.example` - Environment variable template

### Modified Files:
- `backend/controller/recipe.js` - Uses Cloudinary URLs
- `backend/server.js` - Removed local image serving
- `frontend/src/components/RecipeItems.jsx` - Handles Cloudinary URLs
- `frontend/src/pages/RecipeDetails.jsx` - Handles Cloudinary URLs

## 🎯 Benefits

✅ **No more upload failures on Render**
✅ **Automatic image optimization** (faster loading)
✅ **Persistent storage** (images don't disappear)
✅ **CDN delivery** (faster image loading worldwide)
✅ **Free tier**: 25GB storage + 25GB bandwidth/month

## 🔧 Testing Locally

1. Add Cloudinary credentials to `.env`
2. Restart backend: `npm start`
3. Try uploading a recipe with an image
4. Check Cloudinary dashboard - image should appear in `khao-khilao-recipes` folder

## ⚠️ Important Notes

- **Free tier limits**: 25GB storage, 25GB bandwidth per month (plenty for small apps)
- Images are stored in `khao-khilao-recipes` folder on Cloudinary
- Old images are automatically deleted when recipe is updated/deleted
- Images are auto-resized to max 800x800px for optimal performance
