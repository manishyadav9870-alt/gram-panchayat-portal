# Quick Start Script for Gram Panchayat Portal
Write-Host "🚀 Starting Gram Panchayat Portal..." -ForegroundColor Green

$env:NODE_ENV = "production"
$env:PORT = "5000"
$env:DATABASE_URL = "postgresql://postgres:rLVHkXGTiolBKNHQtAmgVRApyUsusyJl@localhost:5432/postgres"
$env:SESSION_SECRET = "gram-panchayat-production-secret-key-2025"

Write-Host "🌐 Server starting at: http://localhost:5000" -ForegroundColor Cyan
node index.js
