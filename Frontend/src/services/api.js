// src/services/api.js
// Serviço para comunicação com o backend Django

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 1. FUNÇÃO AUXILIAR
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
   };

  const token = localStorage.getItem('authToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`; 
    }

    const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
    };

    try {
      const response = await fetch(url, config);
      
      // Se a resposta não tiver conteúdo (ex: DELETE), retorne sucesso
      if (response.status === 204) { 
        return { success: true, status: response.status, data: null };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
        success: false,
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
export async function login(email, password) {
  const result = await fetchAPI('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({
      email: email,
      password: password, // O LoginSerializer renomeia para 'senha'
    }),
  });

  if (result.success) {
    const { data } = result;
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
export async function register(userData) {
  // 'userData' é o objeto completo do formulário (nome, email, password, nivel_acesso, etc.)
  const result = await fetchAPI('/auth/register/', {
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
  // Se o backend tiver um endpoint de blacklist (ex: /auth/logout/), chame-o aqui
  // await fetchAPI('/auth/logout/', { method: 'POST' }); 
  return { success: true };
}


// === PACIENTES ===
export async function getPacientes() {
  return await fetchAPI('/pacientes/listar', {
    method: 'GET',
  });
}

export async function getPacienteDetail(id) {
    return await fetchAPI(`/pacientes/${id}/`, { method: 'GET' }); // Ajuste a rota se for /pacientes/listar
}

// Atualiza dados do Paciente
export async function updatePaciente(id, data) {
    // Nota: Se sua rota de pacientes for apenas lista, você precisará de uma rota de detalhe no backend
    // Supondo que exista /pacientes/{id}/
    return await fetchAPI(`/pacientes/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
}

// === VOLUNTÁRIOS ===
export async function getVoluntarios() {
  return await fetchAPI('/voluntarios/', {
    method: 'GET',
  });
}

export async function getVoluntarioDetail(id) {
    // Assumindo que você tenha um endpoint /voluntarios/pk/ ou use o filtro
    // Como sua API é ViewSet, geralmente é /voluntarios/{id}/
    return await fetchAPI(`/voluntarios/${id}/`, { method: 'GET' });
}

// Atualiza dados do Voluntário
export async function updateVoluntario(id, data) {
    return await fetchAPI(`/voluntarios/${id}/`, {
        method: 'PATCH', // PATCH atualiza só o que mudou
        body: JSON.stringify(data)
    });
}

// === COMUNIDADES ===
export async function getComunidades() {
   return await fetchAPI('/comunidades/', {
    method: 'GET',
   });
}
// (createComunidade removido daqui, pois é uma ação de admin)

// === ATENDIMENTOS ===
export async function getAtendimentos() {
  return await fetchAPI('/atendimentos/', {
    method: 'GET',
  });
}

export async function createAtendimento(atendimentoData) {
  return await fetchAPI('/atendimentos/', {
    method: 'POST',
    body: JSON.stringify(atendimentoData),
  });
}

export async function updateAtendimento(id, atendimentoData) {
  return await fetchAPI(`/atendimentos/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(atendimentoData),
  });
}

export async function deleteAtendimento(id) {
  return await fetchAPI(`/atendimentos/${id}/`, {
    method: 'DELETE',
  });
}

// === ACOMPANHAMENTOS ===
export async function getAcompanhamentos() {
  return await fetchAPI('/acompanhamentos/', {
    method: 'GET',
  });
}

export async function createAcompanhamento(acompanhamentoData) {
  return await fetchAPI('/acompanhamentos/', {
    method: 'POST',
    body: JSON.stringify(acompanhamentoData),
  });
}

export async function updateAcompanhamento(id, acompanhamentoData) {
  return await fetchAPI(`/acompanhamentos/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(acompanhamentoData),
  });
}

export async function getUsuarios() {
  return await fetchAPI('/usuarios/', {
    method: 'GET',
  });
}

export async function createUsuario(usuarioData) {
  return await fetchAPI('/usuarios/', {
    method: 'POST',
    body: JSON.stringify(usuarioData),
  });
}

// === ESPAÇOS COMUNITÁRIOS ===
export async function getEspacosComunitarios() {
  return await fetchAPI('/espacos/', {
    method: 'GET',
  });
}

// === DISPONIBILIDADES ===
export async function getDisponibilidades() {
  return await fetchAPI('/disponibilidades/', {
    method: 'GET',
  });
}

export async function createDisponibilidade(disponibilidadeData) {
  return await fetchAPI('/disponibilidades/', {
    method: 'POST',
    body: JSON.stringify(disponibilidadeData),
  });
}

