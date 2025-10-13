// src/services/mockApi.js

// --- Dados Mockados (Fictícios) ---
// Simula um "banco de dados" temporário no navegador
let users = JSON.parse(localStorage.getItem('mockUsers')) || []; // Para login/cadastro
let agendamentos = JSON.parse(localStorage.getItem('mockAgendamentos')) || []; // Para agendamentos

// Função auxiliar para simular delay de rede (como uma chamada real a API)
const simulateDelay = (ms) => new Promise(res => setTimeout(res, ms));

// --- Funções que simulam as chamadas da API ---

// 1. Simula o Login
async function login(email, password) {
  await simulateDelay(1000); // Simula 1 segundo de carregamento
  
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    // Em um cenário real, o backend retornaria um token JWT
    const fakeToken = `fake-jwt-token-for-${user.email}`;
    localStorage.setItem('authToken', fakeToken); // Salva um token falso
    localStorage.setItem('currentUser', JSON.stringify({ email: user.email, role: user.role })); // Salva o usuário logado
    return { success: true, token: fakeToken, user: { email: user.email, role: user.role } };
  } else {
    return { success: false, message: "Email ou senha inválidos." };
  }
}

// 2. Simula o Cadastro
async function register(email, password, role = 'patient') { // 'patient' ou 'volunteer'
  await simulateDelay(1500);
  
  if (users.some(u => u.email === email)) {
    return { success: false, message: "Este email já está cadastrado." };
  }

  const newUser = { id: users.length + 1, email, password, role };
  users.push(newUser);
  localStorage.setItem('mockUsers', JSON.stringify(users)); // Salva no localStorage
  
  // Automaticamente loga o usuário após o cadastro para simplificar o fluxo
  return login(email, password); 
}

// 3. Simula a obtenção dos agendamentos
async function getAgendamentos() {
  await simulateDelay(800);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    return { success: false, message: "Usuário não logado." };
  }

  // Filtra agendamentos baseados no papel (role) do usuário logado
  if (currentUser.role === 'patient') {
    return { success: true, data: agendamentos.filter(a => a.patientEmail === currentUser.email) };
  } else if (currentUser.role === 'volunteer') {
    return { success: true, data: agendamentos.filter(a => a.volunteerEmail === currentUser.email) };
  } else {
     return { success: true, data: agendamentos }; // Admin ou outro role vê todos
  }
}

// 4. Simula a criação de um agendamento
async function createAgendamento(data) {
  await simulateDelay(1200);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser || currentUser.role !== 'patient') { // Apenas pacientes podem criar agendamentos (no MVP)
    return { success: false, message: "Apenas pacientes podem criar agendamentos." };
  }

  const newAgendamento = { 
    id: agendamentos.length + 1, 
    patientEmail: currentUser.email, // O paciente logado é quem agenda
    status: 'pendente', 
    ...data // Data, hora, voluntário selecionado
  };
  agendamentos.push(newAgendamento);
  localStorage.setItem('mockAgendamentos', JSON.stringify(agendamentos));
  return { success: true, data: newAgendamento };
}

// 5. Simula o registro de evolução (apenas voluntário)
async function recordEvolucao(agendamentoId, notes) {
  await simulateDelay(1000);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser || currentUser.role !== 'volunteer') {
    return { success: false, message: "Apenas voluntários podem registrar evolução." };
  }

  const agendamentoIndex = agendamentos.findIndex(a => a.id === agendamentoId);
  if (agendamentoIndex === -1) {
    return { success: false, message: "Agendamento não encontrado." };
  }

  agendamentos[agendamentoIndex].evolutionNotes = notes;
  agendamentos[agendamentoIndex].status = 'realizada'; // Marca como realizada após evolução
  localStorage.setItem('mockAgendamentos', JSON.stringify(agendamentos));
  return { success: true, data: agendamentos[agendamentoIndex] };
}


// Exporta as funções para serem usadas nos componentes
export { login, register, getAgendamentos, createAgendamento, recordEvolucao };