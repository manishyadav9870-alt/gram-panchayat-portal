# Database Setup Script for Gram Panchayat Portal
# Run this script in PowerShell

Write-Host "=== Gram Panchayat Portal - Database Setup ===" -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "✓ .env file found" -ForegroundColor Green
} else {
    Write-Host "✗ .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file with your DATABASE_URL" -ForegroundColor Yellow
    exit 1
}

# Check if PostgreSQL is accessible
Write-Host ""
Write-Host "Checking PostgreSQL connection..." -ForegroundColor Cyan

# Load environment variables
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $name = $matches[1]
        $value = $matches[2]
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

# Run database migration
Write-Host ""
Write-Host "Running database migration..." -ForegroundColor Cyan
npm run db:push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Database setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Run 'npm run dev' to start the development server" -ForegroundColor White
    Write-Host "2. Open http://localhost:5000 in your browser" -ForegroundColor White
    Write-Host "3. Login with username: admin, password: admin123" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Database setup failed!" -ForegroundColor Red
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "1. PostgreSQL is running" -ForegroundColor White
    Write-Host "2. DATABASE_URL in .env is correct" -ForegroundColor White
    Write-Host "3. Database 'gram_panchayat' exists" -ForegroundColor White
    Write-Host ""
    Write-Host "See DATABASE_SETUP.md for detailed instructions" -ForegroundColor Cyan
}
