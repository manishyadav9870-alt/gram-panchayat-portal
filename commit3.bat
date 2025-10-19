@echo off
echo Adding all changes to git...
git add -A

echo Committing changes...
git commit -m "Final cleanup and Railway deployment ready"

echo Pushing to GitHub...
git push origin main

echo Done! Code pushed successfully!
pause
