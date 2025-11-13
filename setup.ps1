# Script de Inicialização do MindUp
# Execute este script para iniciar tanto o backend quanto o frontend

Write-Host "🚀 Iniciando MindUp..." -ForegroundColor Cyan
Write-Host ""

# Diretório raiz do projeto
$ROOT_DIR = $PSScriptRoot

# Verificar se o Python está instalado
Write-Host "📦 Verificando dependências..." -ForegroundColor Yellow
try {
    python --version | Out-Null
    Write-Host "✓ Python encontrado" -ForegroundColor Green
} catch {
    Write-Host "✗ Python não encontrado. Instale o Python 3.8+ primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se o Node.js está instalado
try {
    node --version | Out-Null
    Write-Host "✓ Node.js encontrado" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js não encontrado. Instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Configurando Backend..." -ForegroundColor Yellow

# Navegar para o Backend
Set-Location "$ROOT_DIR\Backend"

# Verificar se o ambiente virtual existe
if (!(Test-Path "venv")) {
    Write-Host "Criando ambiente virtual..." -ForegroundColor Cyan
    python -m venv venv
}

# Ativar ambiente virtual
Write-Host "Ativando ambiente virtual..." -ForegroundColor Cyan
& ".\venv\Scripts\Activate.ps1"

# Instalar dependências
Write-Host "Instalando dependências do backend..." -ForegroundColor Cyan
pip install -r requirements.txt --quiet

# Verificar migrações
Write-Host "Verificando migrações do banco de dados..." -ForegroundColor Cyan
python manage.py migrate

Write-Host ""
Write-Host "🎨 Configurando Frontend..." -ForegroundColor Yellow

# Navegar para o Frontend
Set-Location "$ROOT_DIR\Frontend"

# Verificar se node_modules existe
if (!(Test-Path "node_modules")) {
    Write-Host "Instalando dependências do frontend..." -ForegroundColor Cyan
    npm install
}

Write-Host ""
Write-Host "✨ Configuração concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar o projeto:" -ForegroundColor Cyan
Write-Host "  Backend:  cd Backend && python manage.py runserver" -ForegroundColor White
Write-Host "  Frontend: cd Frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Ou use os scripts específicos:" -ForegroundColor Cyan
Write-Host "  .\start-backend.ps1" -ForegroundColor White
Write-Host "  .\start-frontend.ps1" -ForegroundColor White
Write-Host ""
