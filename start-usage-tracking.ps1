# Usage Tracking Setup Script
# This script helps you set up and start the usage tracking system

Write-Host "🚀 Buddy Desktop Usage Tracking Setup" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if MongoDB is needed
Write-Host "`n📊 Usage Tracking Configuration" -ForegroundColor Cyan
Write-Host "Do you want to use:" -ForegroundColor White
Write-Host "1. Local MongoDB (requires MongoDB installation)" -ForegroundColor Yellow
Write-Host "2. MongoDB Atlas (cloud, requires connection string)" -ForegroundColor Yellow

$choice = Read-Host "Enter your choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host "`n🔧 Local MongoDB Setup" -ForegroundColor Cyan
    
    # Check if MongoDB is running
    try {
        $mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
        if ($mongoProcess) {
            Write-Host "✅ MongoDB is already running" -ForegroundColor Green
        } else {
            Write-Host "❌ MongoDB is not running. Please start MongoDB first." -ForegroundColor Red
            Write-Host "   You can start it with: mongod" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️  Could not check MongoDB status" -ForegroundColor Yellow
    }
    
    $mongoUri = "mongodb://localhost:27017/buddy"
    
} elseif ($choice -eq "2") {
    Write-Host "`n☁️  MongoDB Atlas Setup" -ForegroundColor Cyan
    $mongoUri = Read-Host "Enter your MongoDB Atlas connection string"
    
} else {
    Write-Host "❌ Invalid choice. Exiting..." -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "`n📝 Creating .env file..." -ForegroundColor Cyan
    
    $envContent = @"
# MongoDB Configuration for Usage Tracking
MONGODB_URL=$mongoUri

# Server Configuration
PORT=3000

# Optional: Add your existing API keys here
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
if (!(Test-Path "node_modules")) {
    npm install express cors mongodb dotenv
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Start the server
Write-Host "`n🚀 Starting Usage Tracking Server..." -ForegroundColor Cyan
Write-Host "The server will start on http://localhost:3000" -ForegroundColor White
Write-Host "Usage Dashboard: http://localhost:3000/../usage-dashboard.html" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

# Start the server
try {
    if (Test-Path "server/app.js") {
        node server/app.js
    } else {
        Write-Host "❌ Server file not found at server/app.js" -ForegroundColor Red
        Write-Host "Please make sure all files are in place:" -ForegroundColor Yellow
        Write-Host "  - server/app.js" -ForegroundColor Yellow
        Write-Host "  - server/usage-tracking-api.js" -ForegroundColor Yellow
        Write-Host "  - usage-dashboard.html" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed to start server: $_" -ForegroundColor Red
    Write-Host "Make sure MongoDB is running and accessible" -ForegroundColor Yellow
}

Write-Host "`n👋 Usage tracking setup complete!" -ForegroundColor Green
