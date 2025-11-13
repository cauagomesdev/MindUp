# Guia de Integração Frontend-Backend MindUp

## 📋 Visão Geral

Este documento descreve a integração completa entre o frontend (React + Vite) e o backend (Django REST Framework) do projeto MindUp.

## 🚀 Configuração

### Backend (Django)

1. **Instalar dependências:**
```bash
cd Backend
pip install -r requirements.txt
```

2. **Configurar banco de dados:**
   - Certifique-se de que o PostgreSQL está rodando
   - Configure as credenciais em `mindup_backend/settings.py` ou via variáveis de ambiente:
     - `DB_NAME` (padrão: mindupdb)
     - `DB_USER` (padrão: postgres)
     - `DB_PASSWORD` (padrão: 030406)
     - `DB_HOST` (padrão: localhost)
     - `DB_PORT` (padrão: 5432)

3. **Executar migrações:**
```bash
python manage.py migrate
```

4. **Criar superusuário (opcional):**
```bash
python manage.py criar_admin
```

5. **Iniciar servidor:**
```bash
python manage.py runserver
```

O backend estará rodando em: `http://localhost:8000`

### Frontend (React + Vite)

1. **Instalar dependências:**
```bash
cd Frontend
npm install
```

2. **Configurar variáveis de ambiente:**
   - Copie `.env.example` para `.env`
   - Configure `VITE_API_URL=http://localhost:8000`

3. **Iniciar servidor de desenvolvimento:**
```bash
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

## 🔌 Endpoints da API

### Autenticação

- **POST** `/auth/login/` - Login de usuário
  ```json
  {
    "nome_login": "email@exemplo.com",
    "senha": "senha123"
  }
  ```

### Pacientes

- **GET** `/pacientes/listar` - Lista todos os pacientes
- **POST** `/pacientes/` - Cadastra novo paciente
  ```json
  {
    "nome": "Nome do Paciente",
    "email": "email@exemplo.com",
    "senha": "senha123",
    "endereco": "Endereço (opcional)",
    "id_comunidade": "uuid (opcional)"
  }
  ```

### Comunidades

- **GET** `/comunidades/` - Lista todas as comunidades
- **POST** `/comunidades/` - Cadastra nova comunidade

### Atendimentos

- **GET** `/atendimentos/` - Lista todos os atendimentos
- **POST** `/atendimentos/` - Cadastra novo atendimento
- **PATCH** `/atendimentos/{id}/` - Atualiza atendimento
- **DELETE** `/atendimentos/{id}/` - Remove atendimento

### Acompanhamentos (Evolução)

- **GET** `/acompanhamentos/` - Lista todos os acompanhamentos
- **POST** `/acompanhamentos/` - Cadastra novo acompanhamento
- **PATCH** `/acompanhamentos/{id}/` - Atualiza acompanhamento
- **DELETE** `/acompanhamentos/{id}/` - Remove acompanhamento

### Usuários (Profissionais)

- **GET** `/usuarios/` - Lista todos os usuários
- **POST** `/usuarios/` - Cadastra novo usuário

### Espaços Comunitários

- **GET** `/espacos/` - Lista todos os espaços comunitários
- **POST** `/espacos/` - Cadastra novo espaço

### Colaboradores

- **GET** `/colaboradores/` - Lista todos os colaboradores
- **POST** `/colaboradores/` - Cadastra novo colaborador

### Voluntários

- **GET** `/voluntarios/` - Lista todos os voluntários
- **POST** `/voluntarios/` - Cadastra novo voluntário

### Disponibilidades

- **GET** `/disponibilidades/` - Lista todas as disponibilidades
- **POST** `/disponibilidades/` - Cadastra nova disponibilidade

## 📱 Páginas Implementadas

### Públicas
- **HomePage** (`/`) - Página inicial
- **LoginPage** (`/login`) - Autenticação de usuários
- **RegisterPage** (`/cadastro`) - Cadastro de novos pacientes
- **RecuperarPage** (`/recuperar-senha`) - Recuperação de senha
- **SobreNosPage** (`/sobre-nos`) - Informações sobre o projeto
- **SuportePage** (`/suporte`) - Suporte e contato

### Protegidas (Requer Autenticação)
- **PainelPage** (`/painel`) - Dashboard principal
- **AgendamentosPage** (`/agendamentos`) - Gerenciamento de atendimentos
- **EvolucaoPage** (`/evolucao`) - Registro de evolução (apenas profissionais)

## 🔐 Autenticação e Autorização

### Níveis de Acesso

- **paciente** - Acesso básico (pode agendar e ver seus próprios atendimentos)
- **voluntario** - Acesso intermediário
- **colaborador** - Acesso avançado (pode registrar evoluções)
- **admin** - Acesso total

### Fluxo de Autenticação

1. Usuário faz login via `/auth/login/`
2. Backend retorna dados do usuário e nível de acesso
3. Frontend armazena token e dados do usuário no localStorage
4. AuthContext gerencia estado global de autenticação
5. ProtectedRoute valida acesso às páginas protegidas

## 🎨 Componentes Reutilizáveis

- **Button** - Botões estilizados
- **Input** - Campos de entrada
- **Textarea** - Área de texto
- **Header** - Cabeçalho com navegação
- **Layout** - Layout padrão com header
- **ProtectedRoute** - Proteção de rotas

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 18
- React Router DOM
- Vite
- CSS Modules

### Backend
- Django 4.2+
- Django REST Framework
- PostgreSQL
- django-cors-headers

## 📝 Modelos de Dados

### Principais Entidades

- **Comunidade** - Comunidades atendidas
- **EspacoComunitario** - Locais de atendimento
- **Paciente** - Pacientes cadastrados
- **Colaborador** - Colaboradores do projeto
- **Voluntario** - Voluntários
- **Usuario** - Usuários do sistema
- **Atendimento** - Agendamentos de atendimento
- **Acompanhamento** - Evolução dos pacientes
- **Disponibilidade** - Horários disponíveis

## 🔧 Configurações CORS

O backend está configurado para aceitar requisições de:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:5173`
- `http://127.0.0.1:5173`

## 🐛 Troubleshooting

### Erro de CORS
- Verifique se o backend está rodando
- Confirme que a URL do frontend está na lista CORS_ALLOWED_ORIGINS

### Erro de conexão com banco de dados
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais em settings.py

### Erro 404 nas rotas
- Verifique se o backend está rodando na porta 8000
- Confirme se a URL da API está correta no .env do frontend

## 📚 Próximos Passos

- [ ] Implementar recuperação de senha
- [ ] Adicionar upload de arquivos
- [ ] Implementar notificações
- [ ] Criar testes automatizados
- [ ] Adicionar paginação nas listagens
- [ ] Implementar filtros e busca
- [ ] Adicionar validações avançadas
- [ ] Implementar JWT para autenticação mais segura

## 📄 Licença

Este projeto é de uso interno do MindUp.
