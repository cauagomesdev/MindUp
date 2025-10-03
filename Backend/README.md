# 🧠 MindUp - Sistema de Saúde Mental Comunitária

Sistema completo para gestão de saúde mental comunitária com Django e PostgreSQL.

## 🚀 Tecnologias

- **Backend:** Django 4.2 + Django REST Framework
- **Banco:** PostgreSQL
- **Autenticação:** Sistema customizado com hash de senhas
- **Admin:** Interface administrativa Django

## 📋 Funcionalidades

- ✅ Cadastro de pacientes e profissionais
- ✅ Sistema de login/autenticação
- ✅ Gestão de comunidades
- ✅ Agendamento de atendimentos
- ✅ Dashboard administrativo
- ✅ API REST completa

## 🛠️ Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/SEU_USUARIO/MindUp.git
cd MindUp
```

2. **Crie ambiente virtual:**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

3. **Instale dependências:**
```bash
pip install -r requirements.txt
```

4. **Configure banco PostgreSQL:**
```bash
# Crie banco: mindupdb
# Configure settings.py com suas credenciais
```

5. **Execute migrações:**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Crie usuário admin:**
```bash
python manage.py criar_admin
```

7. **Execute servidor:**
```bash
python manage.py runserver
```

## 📡 API Endpoints

- `GET/POST /pacientes/` - Listar/Cadastrar pacientes
- `GET/POST /usuarios/` - Listar/Cadastrar profissionais
- `GET /comunidades/` - Listar comunidades
- `POST /auth/login/` - Login
- `GET /admin/` - Interface administrativa

## 👥 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.