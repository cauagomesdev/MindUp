// src/services/api.js
// Serviço para comunicação com o backend Django

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 1. FUNÇÃO AUXILIAR (Já estava correta)
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
   };

  const token = localStorage.getItem('authToken');
  if (token) {
    // Django espera 'Bearer ' (com espaço) se você usar simple-jwt
    defaultHeaders['Authorization'] = `Bearer ${token}`; 
    }

    const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
        success: false,
        // O DRF geralmente retorna erros em 'detail' ou nomes de campos
        message: data.detail || data.email || data.password || 'Erro na requisição',
        status: response.status,
      };
    }
    return { success: true, data, status: response.status };
  } catch (error) {
    console.error('Erro na requisição:', error);
    return { success: false, message: 'Erro de conexão com o servidor.' };
    }
}

// === AUTENTICAÇÃO ===

// 2. FUNÇÃO LOGIN (CORRIGIDA)
// Não "inventa" mais o token. Ela recebe o token e o usuário do backend.
export async function login(email, password) {
  const result = await fetchAPI('/auth/login/', { // Endpoint de login do backend
    method: 'POST',
    body: JSON.stringify({
      email: email,       // Seu LoginSerializer espera 'email'
      password: password, // Seu LoginSerializer espera 'password'
    }),
  });

  if (result.success) {
    const { data } = result;
    
    // O backend (views.py) AGORA retorna 'token' e 'user'
    const token = data.token; 
    const user = data.user;   

    if (!token || !user) {
      return { success: false, message: "Resposta de login inválida do servidor." };
    }

    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return { success: true, user: user };
  }
  return result;
}

// 3. FUNÇÃO REGISTER (CORRIGIDA)
// Agora chama o endpoint unificado /auth/register/
export async function register(userData) {
  // 'userData' é o objeto completo do formulário (nome, email, senha, role, etc.)
  const result = await fetchAPI('/auth/register/', { // Novo endpoint
    method: 'POST',
    body: JSON.stringify(userData), // Envia todos os dados de uma vez
  });

  if (result.success) {
    // O backend já faz o login e retorna o token e o usuário
    const { data } = result;
    const token = data.token;
    const user = data.user;

    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));

    return { success: true, user: user };
  }
  return result;
}

// 4. FUNÇÃO LOGOUT (CORRIGIDA)
export async function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  // Se o backend tiver um endpoint de blacklist, chame-o aqui
  // await fetchAPI('/auth/logout/', { method: 'POST' }); 
  return { success: true };
}


// === DADOS (Ex: Comunidades) ===
// Você precisará disso para o Dropdown de Cadastro de Paciente

export async function getComunidades() {
   return await fetchAPI('/comunidades/', {
    method: 'GET',
   });
}

// ... (Mantenha as outras funções de API como getAtendimentos, etc.)