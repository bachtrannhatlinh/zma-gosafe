#!/usr/bin/env pwsh

Write-Host "🚀 Starting GoSafe Client..." -ForegroundColor Green

# Navigate to client directory
Set-Location "client"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the client
Write-Host "🌐 Starting Zalo Mini App..." -ForegroundColor Cyan
npm start
