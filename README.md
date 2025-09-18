# 🧠 MindUp - Backend

Este projeto é um **backend em Flask** para gerenciamento de **pacientes, profissionais, consultas e oficinas**, com integração a um banco de dados **PostgreSQL**.

---

## 📌 Pré-requisitos

- **Python 3.10+**
- **PostgreSQL** rodando localmente (ou ajuste a string de conexão em `config.py`)
- **Node.js** e **npm** (necessários para rodar o frontend, veja instruções na pasta `frontend`)

---

## 🚀 Instalação e Execução

### 1. Clone o repositório
```sh
git clone https://github.com/seu-usuario/back-mindup.git
cd back-mindup
```

### 2. Crie e ative um ambiente virtual
```sh
python -m venv venv
```

No **Windows**:
```sh
venv\Scripts\activate
```

No **Linux/Mac**:
```sh
source venv/bin/activate
```

### 3. Instale as dependências
```sh
pip install -r requirements.txt
```

### 4. Configure o banco de dados
1. Certifique-se de que o **PostgreSQL** está rodando.  
2. Crie o banco de dados **kanban** (ou altere o nome em `config.py`).  
3. Execute o conteúdo do arquivo `db/kanban.db` no PostgreSQL para criar as tabelas e extensões necessárias.  

> ⚙️ Opcional: Você pode alterar a string de conexão no arquivo `config.py`.

### 5. Inicie o backend
```sh
python app.py
```

O backend estará disponível em:  
👉 [http://localhost:5000](http://localhost:5000)

---

## 🎨 Frontend

O frontend está localizado na pasta `frontend`. Para rodá-lo:

```sh
cd frontend
npm install
npm start
```

Acesse o sistema em:  
👉 [http://localhost:3000](http://localhost:3000)

---

## 📚 Estrutura das Rotas

### 👥 Pacientes
- `GET /pacientes/listar` → Lista todos os pacientes  
- `POST /pacientes/` → Cadastra um novo paciente  

### 🧑‍⚕️ Profissionais
- `GET /profissionais/listar` → Lista todos os profissionais  
- `POST /profissionais/` → Cadastra um novo profissional  

---

## ⚠️ Observações Importantes

- O backend **depende** do banco de dados PostgreSQL configurado conforme o arquivo `db/kanban.db`.  
- As **senhas são armazenadas como hash** para maior segurança.  
- O projeto já está preparado para **CORS**, permitindo integração com o frontend React.  
- Para ambiente de **produção**, altere:
  - O valor da variável `SECRET_KEY`
  - A string de conexão com o banco de dados  

---

## 🛠️ Tecnologias Utilizadas

- **Flask**
- **Flask-SQLAlchemy**
- **PostgreSQL**
- **React (Frontend)**
