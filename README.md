# 🧠 MindUp - Sistema de Gestão de Saúde Mental Comunitária

![MindUp](https://img.shields.io/badge/Status-Integrado-success)
![Backend](https://img.shields.io/badge/Backend-Django-green)
![Frontend](https://img.shields.io/badge/Frontend-React-blue)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)

## 📖 Sobre o Projeto

MindUp é uma plataforma web desenvolvida para facilitar o gerenciamento de atendimentos e acompanhamentos em saúde mental em comunidades. O sistema permite que pacientes agendem consultas, profissionais registrem evoluções e administradores gerenciem todo o processo.

link do video do youtube: https://youtu.be/pcCy0_kDR90

## ✨ Funcionalidades

### Para Pacientes 👤
- ✅ Cadastro e autenticação
- ✅ Agendamento de atendimentos
- ✅ Visualização de histórico
- ✅ Dashboard personalizado
- ✅ Cancelamento de agendamentos

### Para Profissionais 👨‍⚕️
- ✅ Gerenciamento de atendimentos
- ✅ Registro de evoluções
- ✅ Visualização de pacientes
- ✅ Acompanhamento de casos
- ✅ Dashboard com estatísticas

### Para Administradores 🔐
- ✅ Gestão completa de usuários
- ✅ Gerenciamento de espaços comunitários
- ✅ Relatórios e métricas
- ✅ Configuração do sistema

## 🚀 Início Rápido

### Pré-requisitos

- Python 3.8 ou superior
- Node.js 16 ou superior
- PostgreSQL 12 ou superior
- Git

### Instalação Rápida

```powershell
# 1. Clone o repositório
git clone <url-do-repositorio>
cd MindUp

# 2. Execute o setup automático
.\setup.ps1

# 3. Inicie o backend (terminal 1)
.\start-backend.ps1

# 4. Inicie o frontend (terminal 2)
.\start-frontend.ps1
```

🌐 Acesse: **http://localhost:5173**

📚 **Para instruções detalhadas, veja:** [QUICKSTART.md](QUICKSTART.md)

## 🏗️ Arquitetura

```
┌─────────────────┐
│   Frontend      │
│  React + Vite   │ ← http://localhost:5173
└────────┬────────┘
         │ API REST
         ↓
┌─────────────────┐
│    Backend      │
│ Django REST API │ ← http://localhost:8000
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   PostgreSQL    │
│   Database      │
└─────────────────┘
```

## 📁 Estrutura do Projeto

```
MindUp/
├── Backend/                    # Django REST Framework
│   ├── core/                  # App principal
│   │   ├── models.py         # Modelos de dados
│   │   ├── views.py          # Views da API
│   │   ├── serializers.py    # Serializers
│   │   └── urls.py           # Rotas
│   ├── mindup_backend/       # Configurações
│   │   └── settings.py       # Settings Django
│   └── manage.py
│
├── Frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Chamadas à API
│   │   ├── context/         # Context API
│   │   └── routes/          # Configuração de rotas
│   └── package.json
│
├── setup.ps1                 # Setup automático
├── start-backend.ps1         # Iniciar backend
├── start-frontend.ps1        # Iniciar frontend
├── QUICKSTART.md            # Guia de início rápido
├── INTEGRATION.md           # Documentação de integração
└── INTEGRATION_SUMMARY.md   # Resumo da integração
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Django 4.2+** - Framework web
- **Django REST Framework** - API REST
- **PostgreSQL** - Banco de dados
- **django-cors-headers** - Configuração CORS

### Frontend
- **React 18** - Biblioteca UI
- **React Router DOM** - Roteamento
- **Vite** - Build tool
- **CSS3** - Estilização

## 📚 Documentação

- 📘 [Quick Start Guide](QUICKSTART.md) - Comece aqui!
- 📗 [Integration Guide](INTEGRATION.md) - Documentação completa
- 📙 [Integration Summary](INTEGRATION_SUMMARY.md) - Resumo técnico

## 🔌 API Endpoints

### Autenticação
```http
POST /auth/login/
```

### Pacientes
```http
GET  /pacientes/listar
POST /pacientes/
```

### Atendimentos
```http
GET    /atendimentos/
POST   /atendimentos/
PATCH  /atendimentos/{id}/
DELETE /atendimentos/{id}/
```

### Acompanhamentos
```http
GET    /acompanhamentos/
POST   /acompanhamentos/
PATCH  /acompanhamentos/{id}/
DELETE /acompanhamentos/{id}/
```

📖 **Documentação completa da API:** [INTEGRATION.md](INTEGRATION.md)

## 🎨 Screenshots

### Dashboard
Dashboard personalizado com estatísticas em tempo real.

### Agendamentos
Gestão completa de agendamentos com calendário e filtros.

### Evolução
Registro detalhado da evolução dos pacientes.

## 🧪 Testes

### Backend
```powershell
cd Backend
python manage.py test
```

### Frontend
```powershell
cd Frontend
npm test
```

## 🚢 Deploy

### Variáveis de Ambiente

**Backend (.env):**
```env
DEBUG=False
SECRET_KEY=your-secret-key
DB_NAME=mindupdb
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

**Frontend (.env):**
```env
VITE_API_URL=https://api.mindup.com
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é de uso interno do MindUp.

## 👥 Equipe

- **Desenvolvimento** - Equipe MindUp
- **Design** - Equipe MindUp
- **Gestão** - Equipe MindUp

## 📧 Contato

Para mais informações, entre em contato através de:
- Email: contato@mindup.com
- Website: www.mindup.com

---

## 🎯 Roadmap

- [x] Sistema de autenticação
- [x] Gestão de pacientes
- [x] Agendamento de atendimentos
- [x] Registro de evoluções
- [x] Dashboard com estatísticas
- [ ] Notificações em tempo real
- [ ] Sistema de mensagens
- [ ] Relatórios em PDF
- [ ] App mobile
- [ ] Integração com calendários

## ⚙️ Status do Projeto

✅ **Backend:** Totalmente integrado e funcional  
✅ **Frontend:** Todas as páginas implementadas  
✅ **Autenticação:** Sistema completo  
✅ **CRUD:** Todas as entidades funcionando  
🔄 **Testes:** Em desenvolvimento  
🔄 **Deploy:** Preparando ambiente de produção  

---

<div align="center">

**Desenvolvido com ❤️ pela equipe MindUp**

*Seu espaço de acolhimento*

</div>
