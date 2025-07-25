# GoSafe Development Server Starter
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "🚀 GoSafe - Starting Development Environment" -ForegroundColor Cyan  
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "server")) {
    Write-Host "❌ Error: server folder not found. Please run from project root." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (!(Test-Path "client")) {
    Write-Host "❌ Error: client folder not found. Please run from project root." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow

# Check server dependencies
if (!(Test-Path "server/node_modules")) {
    Write-Host "📥 Installing server dependencies..." -ForegroundColor Yellow
    Set-Location server
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install server dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Set-Location ..
}

# Check client dependencies
if (!(Test-Path "client/node_modules")) {
    Write-Host "📥 Installing client dependencies..." -ForegroundColor Yellow
    Set-Location client
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install client dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Set-Location ..
}

Write-Host "✅ Dependencies ready!" -ForegroundColor Green
Write-Host ""

# Start server in background
Write-Host "🔧 Starting backend server..." -ForegroundColor Yellow
$serverJob = Start-Job -ScriptBlock {
    Set-Location "d:\gosafe\zma-gosafe\server"
    node server.js
}

Start-Sleep -Seconds 2

# Test server
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method Get -TimeoutSec 5
    Write-Host "✅ Backend server is running: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend server may not be ready yet. Check manually: http://localhost:3001/api/health" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Server Information:" -ForegroundColor Cyan
Write-Host "  📍 Backend: http://localhost:3001" -ForegroundColor White
Write-Host "  📍 Health Check: http://localhost:3001/api/health" -ForegroundColor White
Write-Host "  📍 Decode API: POST http://localhost:3001/api/decode-phone" -ForegroundColor White
Write-Host ""

Write-Host "📱 Starting client development server..." -ForegroundColor Yellow
Write-Host "  📍 Client will be available at: http://localhost:3000" -ForegroundColor White
Write-Host ""

# Start client
Set-Location client
try {
    Write-Host "🔄 Starting Zalo Mini App..." -ForegroundColor Green
    npm start
} catch {
    Write-Host "❌ Error starting client" -ForegroundColor Red
}

# Cleanup
Write-Host ""
Write-Host "🔄 Stopping background server..." -ForegroundColor Yellow
Stop-Job $serverJob
Remove-Job $serverJob

Write-Host "✅ Development session ended." -ForegroundColor Green
Read-Host "Press Enter to exit"
