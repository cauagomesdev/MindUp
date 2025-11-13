# Iniciar Backend do MindUp

Write-Host "🚀 Iniciando Backend MindUp..." -ForegroundColor Cyan

$SCRIPT_DIR = $PSScriptRoot
Set-Location "$SCRIPT_DIR\Backend"

# Ativar ambiente virtual se existir
if (Test-Path "venv\Scripts\Activate.ps1") {
    & ".\venv\Scripts\Activate.ps1"
}

Write-Host "📡 Servidor backend rodando em http://localhost:8000" -ForegroundColor Green
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

python manage.py runserver
