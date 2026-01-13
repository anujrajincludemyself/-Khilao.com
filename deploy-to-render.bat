@echo off
echo ========================================
echo DEPLOYMENT GUIDE - Fix Recipe Upload
echo ========================================
echo.
echo Step 1: Go to Render Dashboard
echo --------------------------------
echo 1. Open: https://dashboard.render.com
echo 2. Login to your account
echo.
echo Step 2: Find Your Backend Service
echo ----------------------------------
echo 1. Look for service named "khilao-com" or similar
echo 2. Click on it to open service details
echo.
echo Step 3: Trigger Manual Deploy
echo ------------------------------
echo 1. Click "Manual Deploy" button (top right)
echo 2. Select "Deploy latest commit"
echo 3. OR click "Clear build cache & deploy"
echo.
echo Step 4: Wait for Deployment
echo ---------------------------
echo 1. Watch the deployment logs
echo 2. Wait until you see "Build successful" 
echo 3. Then wait for "Deploy successful"
echo 4. This usually takes 2-5 minutes
echo.
echo Step 5: Test the Fix
echo --------------------
echo 1. Go back to your food blog app
echo 2. Try adding a recipe again
echo 3. It should work now!
echo.
echo ========================================
echo TROUBLESHOOTING
echo ========================================
echo.
echo If deployment fails:
echo - Check the logs for errors
echo - Make sure environment variables are set (SECRET_KEY, etc.)
echo - Ensure MongoDB connection string is correct
echo.
echo If still not working:
echo - Try "Clear build cache & deploy"
echo - Check if the correct branch is selected (main)
echo.
pause
