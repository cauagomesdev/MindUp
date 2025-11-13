// src/services/api.js
// Serviço para comunicação com o backend Django

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Função auxiliar para fazer requisições HTTP
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
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || data.message || 'Erro na requisição',
        status: response.status,
      };
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('Erro na requisição:', error);
    return {
      success: false,
      message: 'Erro de conexão com o servidor',
      error,
    };
  }
}

// === AUTENTICAÇÃO ===

export async function login(email, password) {
  const result = await fetchAPI('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({
      nome_login: email,
      senha: password,
    }),
  });

  if (result.success) {
    const { data } = result;
    const token = `token-${data.id}`; // Token simplificado
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify({
      id: data.id,
      nome: data.nome,
      email: email,
      nivel_acesso: data.nivel_acesso,
    }));
    
    return {
      success: true,
      user: {
        id: data.id,
        nome: data.nome,
        email: email,
        nivel_acesso: data.nivel_acesso,
      },
    };
  }

  return result;
}

export async function register(nome, email, password, endereco = '', id_comunidade = null) {
  const result = await fetchAPI('/pacientes/', {
    method: 'POST',
    body: JSON.stringify({
      nome,
      email,
      senha: password,
      endereco,
      id_comunidade,
    }),
  });

  if (result.success) {
    // Após cadastro bem-sucedido, fazer login automaticamente
    return await login(email, password);
  }

  return result;
}

export async function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  return { success: true };
}

// === PACIENTES ===

export async function getPacientes() {
  return await fetchAPI('/pacientes/listar', {
    method: 'GET',
  });
}

export async function createPaciente(pacienteData) {
  return await fetchAPI('/pacientes/', {
    method: 'POST',
    body: JSON.stringify(pacienteData),
  });
}

// === COMUNIDADES ===

export async function getComunidades() {
  return await fetchAPI('/comunidades/', {
    method: 'GET',
  });
}

export async function createComunidade(comunidadeData) {
  return await fetchAPI('/comunidades/', {
    method: 'POST',
    body: JSON.stringify(comunidadeData),
  });
}

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

// === USUÁRIOS (PROFISSIONAIS) ===

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

export async function createEspacoComunitario(espacoData) {
  return await fetchAPI('/espacos/', {
    method: 'POST',
    body: JSON.stringify(espacoData),
  });
}

// === COLABORADORES ===

export async function getColaboradores() {
  return await fetchAPI('/colaboradores/', {
    method: 'GET',
  });
}

export async function createColaborador(colaboradorData) {
  return await fetchAPI('/colaboradores/', {
    method: 'POST',
    body: JSON.stringify(colaboradorData),
  });
}

// === VOLUNTÁRIOS ===

export async function getVoluntarios() {
  return await fetchAPI('/voluntarios/', {
    method: 'GET',
  });
}

export async function createVoluntario(voluntarioData) {
  return await fetchAPI('/voluntarios/', {
    method: 'POST',
    body: JSON.stringify(voluntarioData),
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
