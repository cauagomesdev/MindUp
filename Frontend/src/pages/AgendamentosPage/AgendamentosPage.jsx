import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getAtendimentos, 
  createAtendimento, 
  updateAtendimento,
  deleteAtendimento,
  getEspacosComunitarios,
  getUsuarios
} from '../../services/api';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './AgendamentosPage.css';

function AgendamentosPage() {
  const { user } = useAuth();
  const [atendimentos, setAtendimentos] = useState([]);
  const [espacos, setEspacos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    data: '',
    horario: '',
    tipo_atendimento: 'consulta',
    id_espaco_comunitario: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [atendimentosResult, espacosResult, profissionaisResult] = await Promise.all([
        getAtendimentos(),
        getEspacosComunitarios(),
        getUsuarios()
      ]);

      if (atendimentosResult.success) {
        // Filtrar atendimentos do usuário logado se for paciente
        const meusAtendimentos = user?.nivel_acesso === 'paciente'
          ? atendimentosResult.data.atendimentos.filter(a => a.id_paciente === user.id)
          : atendimentosResult.data.atendimentos;
        
        setAtendimentos(meusAtendimentos || []);
      }

      if (espacosResult.success) {
        setEspacos(espacosResult.data.espacos || []);
      }

      if (profissionaisResult.success) {
        setProfissionais(profissionaisResult.data || []);
      }
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user?.id) {
      setError('Usuário não autenticado');
      return;
    }

    const atendimentoData = {
      ...formData,
      id_paciente: user.id,
      status: 'agendado'
    };

    const result = await createAtendimento(atendimentoData);

    if (result.success) {
      setSuccess('Agendamento criado com sucesso!');
      setShowForm(false);
      setFormData({
        data: '',
        horario: '',
        tipo_atendimento: 'consulta',
        id_espaco_comunitario: '',
      });
      loadData();
    } else {
      setError(result.message || 'Erro ao criar agendamento');
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('Deseja realmente cancelar este agendamento?')) {
      return;
    }

    const result = await updateAtendimento(id, { status: 'cancelado' });

    if (result.success) {
      setSuccess('Agendamento cancelado com sucesso!');
      loadData();
    } else {
      setError(result.message || 'Erro ao cancelar agendamento');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'agendado':
        return 'badge-agendado';
      case 'realizado':
        return 'badge-realizado';
      case 'cancelado':
        return 'badge-cancelado';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="agendamentos-page">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="agendamentos-page">
      <div className="agendamentos-header">
        <h1>Meus Agendamentos</h1>
        <Button onClick={() => setShowForm(!showForm)} className="btn-novo">
          {showForm ? 'Cancelar' : '+ Novo Agendamento'}
        </Button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="form-card">
          <h2>Novo Agendamento</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Data</label>
                <Input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Horário</label>
                <Input
                  type="time"
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tipo de Atendimento</label>
              <select
                className="select-input"
                value={formData.tipo_atendimento}
                onChange={(e) => setFormData({ ...formData, tipo_atendimento: e.target.value })}
                required
              >
                <option value="consulta">Consulta</option>
                <option value="terapia">Terapia</option>
                <option value="avaliacao">Avaliação</option>
                <option value="retorno">Retorno</option>
              </select>
            </div>

            <div className="form-group">
              <label>Espaço Comunitário</label>
              <select
                className="select-input"
                value={formData.id_espaco_comunitario}
                onChange={(e) => setFormData({ ...formData, id_espaco_comunitario: e.target.value })}
              >
                <option value="">Selecione um espaço (opcional)</option>
                {espacos.map((espaco) => (
                  <option key={espaco.id_espaco_comunitario} value={espaco.id_espaco_comunitario}>
                    {espaco.nome}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="btn-submit">
              Agendar
            </Button>
          </form>
        </div>
      )}

      <div className="agendamentos-list">
        {atendimentos.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum agendamento encontrado</p>
            <Button onClick={() => setShowForm(true)} className="btn-primary">
              Criar primeiro agendamento
            </Button>
          </div>
        ) : (
          <div className="cards-grid">
            {atendimentos.map((atendimento) => (
              <div key={atendimento.id_atendimento} className="atendimento-card">
                <div className="card-header">
                  <h3>{atendimento.tipo_atendimento}</h3>
                  <span className={`badge ${getStatusBadgeClass(atendimento.status)}`}>
                    {atendimento.status}
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Data:</span>
                    <span className="value">{new Date(atendimento.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">Horário:</span>
                    <span className="value">{atendimento.horario}</span>
                  </div>
                  
                  {atendimento.espaco_nome && (
                    <div className="info-row">
                      <span className="label">Local:</span>
                      <span className="value">{atendimento.espaco_nome}</span>
                    </div>
                  )}

                  {user?.nivel_acesso !== 'paciente' && atendimento.paciente_nome && (
                    <div className="info-row">
                      <span className="label">Paciente:</span>
                      <span className="value">{atendimento.paciente_nome}</span>
                    </div>
                  )}
                </div>

                {atendimento.status === 'agendado' && (
                  <div className="card-actions">
                    <Button
                      onClick={() => handleCancelar(atendimento.id_atendimento)}
                      className="btn-cancelar"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AgendamentosPage;