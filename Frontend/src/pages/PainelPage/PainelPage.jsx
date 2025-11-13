import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  getAtendimentos, 
  getAcompanhamentos,
  getPacientes,
  getUsuarios
} from '../../services/api';
import Button from '../../components/Button/Button';
import './PainelPage.css';

function PainelPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    proximosAtendimentos: 0,
    atendimentosRealizados: 0,
    acompanhamentosAtivos: 0,
    totalPacientes: 0,
  });
  const [proximosAtendimentos, setProximosAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const atendimentosResult = await getAtendimentos();
      const acompanhamentosResult = await getAcompanhamentos();

      if (atendimentosResult.success) {
        const allAtendimentos = atendimentosResult.data.atendimentos || [];
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        // Filtrar atendimentos do usuário se for paciente
        const meusAtendimentos = user?.nivel_acesso === 'paciente'
          ? allAtendimentos.filter(a => a.id_paciente === user.id)
          : allAtendimentos;

        const proximos = meusAtendimentos.filter(a => {
          const dataAtendimento = new Date(a.data);
          return dataAtendimento >= hoje && a.status === 'agendado';
        }).sort((a, b) => new Date(a.data) - new Date(b.data)).slice(0, 3);

        const realizados = meusAtendimentos.filter(a => a.status === 'realizado').length;

        setProximosAtendimentos(proximos);
        setStats(prev => ({
          ...prev,
          proximosAtendimentos: proximos.length,
          atendimentosRealizados: realizados,
        }));
      }

      if (acompanhamentosResult.success) {
        const acompanhamentos = acompanhamentosResult.data.acompanhamentos || [];
        const ativos = acompanhamentos.filter(a => 
          a.situacao === 'ativo' || a.situacao === 'em andamento'
        ).length;

        setStats(prev => ({
          ...prev,
          acompanhamentosAtivos: ativos,
        }));
      }

      // Se for admin/colaborador, carregar total de pacientes
      if (user?.nivel_acesso !== 'paciente') {
        const pacientesResult = await getPacientes();
        if (pacientesResult.success) {
          setStats(prev => ({
            ...prev,
            totalPacientes: (pacientesResult.data.pacientes || []).length,
          }));
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getNivelAcessoLabel = (nivel) => {
    const labels = {
      admin: 'Administrador',
      colaborador: 'Colaborador',
      voluntario: 'Voluntário',
      paciente: 'Paciente',
    };
    return labels[nivel] || nivel;
  };

  if (loading) {
    return (
      <div className="painel-page">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="painel-page">
      <div className="painel-header">
        <div className="welcome-section">
          <h1>{getGreeting()}, {user?.nome}!</h1>
          <p className="user-role">{getNivelAcessoLabel(user?.nivel_acesso)}</p>
        </div>
        <Button onClick={logout} className="btn-logout">
          Sair
        </Button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
            <span style={{ color: '#1e40af' }}>📅</span>
          </div>
          <div className="stat-content">
            <h3>Próximos Atendimentos</h3>
            <p className="stat-value">{stats.proximosAtendimentos}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
            <span style={{ color: '#065f46' }}>✓</span>
          </div>
          <div className="stat-content">
            <h3>Atendimentos Realizados</h3>
            <p className="stat-value">{stats.atendimentosRealizados}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <span style={{ color: '#92400e' }}>📊</span>
          </div>
          <div className="stat-content">
            <h3>Acompanhamentos Ativos</h3>
            <p className="stat-value">{stats.acompanhamentosAtivos}</p>
          </div>
        </div>

        {user?.nivel_acesso !== 'paciente' && (
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#e0e7ff' }}>
              <span style={{ color: '#3730a3' }}>👥</span>
            </div>
            <div className="stat-content">
              <h3>Total de Pacientes</h3>
              <p className="stat-value">{stats.totalPacientes}</p>
            </div>
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Ações Rápidas</h2>
        <div className="actions-grid">
          <Button 
            onClick={() => navigate('/agendamentos')} 
            className="action-btn"
          >
            📅 Ver Agendamentos
          </Button>
          
          {user?.nivel_acesso !== 'paciente' && (
            <Button 
              onClick={() => navigate('/evolucao')} 
              className="action-btn"
            >
              📝 Registrar Evolução
            </Button>
          )}
          
          <Button 
            onClick={() => navigate('/suporte')} 
            className="action-btn"
          >
            💬 Suporte
          </Button>
        </div>
      </div>

      {proximosAtendimentos.length > 0 && (
        <div className="proximos-atendimentos">
          <h2>Próximos Atendimentos</h2>
          <div className="atendimentos-list">
            {proximosAtendimentos.map((atendimento) => (
              <div key={atendimento.id_atendimento} className="atendimento-item">
                <div className="atendimento-info">
                  <h3>{atendimento.tipo_atendimento}</h3>
                  <p className="atendimento-data">
                    {new Date(atendimento.data).toLocaleDateString('pt-BR')} às {atendimento.horario}
                  </p>
                  {atendimento.espaco_nome && (
                    <p className="atendimento-local">📍 {atendimento.espaco_nome}</p>
                  )}
                  {user?.nivel_acesso !== 'paciente' && atendimento.paciente_nome && (
                    <p className="atendimento-paciente">👤 {atendimento.paciente_nome}</p>
                  )}
                </div>
                <Button 
                  onClick={() => navigate('/agendamentos')} 
                  className="btn-detalhes"
                >
                  Ver Detalhes
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {proximosAtendimentos.length === 0 && (
        <div className="empty-state">
          <p>Você não tem atendimentos agendados</p>
          <Button 
            onClick={() => navigate('/agendamentos')} 
            className="btn-agendar"
          >
            Agendar Atendimento
          </Button>
        </div>
      )}
    </div>
  );
}

export default PainelPage;