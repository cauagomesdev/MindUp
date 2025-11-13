# Iniciar Frontend do MindUp

Write-Host "🎨 Iniciando Frontend MindUp..." -ForegroundColor Cyan

$SCRIPT_DIR = $PSScriptRoot
Set-Location "$SCRIPT_DIR\Frontend"

Write-Host "🌐 Servidor frontend rodando em http://localhost:5173" -ForegroundColor Green
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

npm run dev
