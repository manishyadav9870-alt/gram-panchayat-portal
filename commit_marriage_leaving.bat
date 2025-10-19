@echo off
echo Adding all files to git...
git add .

echo Committing changes...
git commit -m "Add Marriage and Leaving Certificate features - Complete implementation with forms, print templates, list pages, dashboard integration, and Coming Soon service styling"

echo Pushing to GitHub...
git push origin main

echo Done! Code pushed to GitHub successfully.
pause
