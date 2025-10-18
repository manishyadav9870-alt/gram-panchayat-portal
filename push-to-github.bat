@echo off
echo Configuring Git...
git config user.name "Your Name"
git config user.email "your.email@example.com"

echo.
echo Committing changes...
git commit -m "Initial commit - Gram Panchayat Portal"

echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Create a new repository on GitHub
echo 2. Copy the repository URL
echo 3. Run these commands:
echo.
echo    git remote add origin YOUR_GITHUB_REPO_URL
echo    git branch -M main
echo    git push -u origin main
echo.
echo ========================================
pause
