# 🚀 Quick Start - MindUp

## Início Rápido (5 minutos)

### Pré-requisitos
- Python 3.8+
- Node.js 16+
- PostgreSQL rodando

### Passo 1: Clone e Configure

```powershell
# Clone o repositório (se ainda não fez)
git clone <url-do-repo>
cd MindUp

# Execute o setup automático
.\setup.ps1
```

### Passo 2: Configure o Banco de Dados

Certifique-se que o PostgreSQL está rodando e crie o banco:

```sql
CREATE DATABASE mindupdb;
```

### Passo 3: Inicie os Servidores

**Terminal 1 - Backend:**
```powershell
.\start-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
.\start-frontend.ps1
```

### Passo 4: Acesse a Aplicação

🌐 Frontend: http://localhost:5173
📡 Backend API: http://localhost:8000

---

## Primeiro Acesso

### Criar Usuário Admin (Opcional)

```powershell
cd Backend
python manage.py createsuperuser
```

### Cadastrar um Paciente

1. Acesse http://localhost:5173
2. Clique em "Registre-se"
3. Preencha o formulário
4. Faça login com suas credenciais

---

## Estrutura de Pastas

```
MindUp/
├── Backend/           # Django REST API
│   ├── core/         # App principal
│   ├── mindup_backend/ # Configurações
│   └── manage.py
├── Frontend/         # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── context/
│   └── package.json
├── setup.ps1         # Setup automático
├── start-backend.ps1 # Iniciar backend
└── start-frontend.ps1 # Iniciar frontend
```

---

## Comandos Úteis

### Backend

```powershell
cd Backend

# Criar migrações
python manage.py makemigrations

# Aplicar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Rodar servidor
python manage.py runserver

# Shell do Django
python manage.py shell
```

### Frontend

```powershell
cd Frontend

# Instalar dependências
npm install

# Rodar dev server
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

---

## Troubleshooting Rápido

### ❌ Erro de CORS
**Solução:** Verifique se o backend está rodando e se a URL está correta no `.env`

### ❌ Erro de banco de dados
**Solução:** 
```powershell
cd Backend
python manage.py migrate
```

### ❌ Erro "Module not found"
**Solução (Frontend):**
```powershell
cd Frontend
npm install
```

**Solução (Backend):**
```powershell
cd Backend
pip install -r requirements.txt
```

### ❌ Porta já em uso
**Backend (8000):**
```powershell
# Encontre o processo
netstat -ano | findstr :8000

# Mate o processo
taskkill /PID <PID> /F
```

**Frontend (5173):**
```powershell
# Encontre o processo
netstat -ano | findstr :5173

# Mate o processo
taskkill /PID <PID> /F
```

---

## Endpoints Principais

### Autenticação
- `POST /auth/login/` - Login

### Pacientes
- `GET /pacientes/listar` - Listar
- `POST /pacientes/` - Cadastrar

### Atendimentos
- `GET /atendimentos/` - Listar
- `POST /atendimentos/` - Criar
- `PATCH /atendimentos/{id}/` - Atualizar

### Acompanhamentos
- `GET /acompanhamentos/` - Listar
- `POST /acompanhamentos/` - Criar
- `PATCH /acompanhamentos/{id}/` - Atualizar

📚 Para lista completa de endpoints, veja `INTEGRATION.md`

---

## Níveis de Acesso

| Nível | Permissões |
|-------|-----------|
| **paciente** | Ver e criar seus próprios agendamentos |
| **voluntario** | Ver agendamentos + registrar evoluções |
| **colaborador** | Acesso completo de profissional |
| **admin** | Acesso total ao sistema |

---

## Suporte

- 📖 Documentação completa: `INTEGRATION.md`
- 📋 Resumo de integração: `INTEGRATION_SUMMARY.md`
- 🐛 Problemas? Abra uma issue no GitHub

---

**Desenvolvido para MindUp - Seu espaço de acolhimento** ❤️
