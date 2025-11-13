import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getAcompanhamentos,
  createAcompanhamento,
  updateAcompanhamento,
  getPacientes
} from '../../services/api';
import Input from '../../components/Input/Input';
import Textarea from '../../components/Textarea/Textarea';
import Button from '../../components/Button/Button';
import './EvolucaoPage.css';

function EvolucaoPage() {
  const { user } = useAuth();
  const [acompanhamentos, setAcompanhamentos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    id_paciente: '',
    data_inicio: '',
    descricao: '',
    situacao: 'em andamento',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [acompanhamentosResult, pacientesResult] = await Promise.all([
        getAcompanhamentos(),
        getPacientes()
      ]);

      if (acompanhamentosResult.success) {
        setAcompanhamentos(acompanhamentosResult.data.acompanhamentos || []);
      }

      if (pacientesResult.success) {
        setPacientes(pacientesResult.data.pacientes || []);
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

    if (editingId) {
      // Atualizar acompanhamento existente
      const result = await updateAcompanhamento(editingId, formData);
      if (result.success) {
        setSuccess('Evolução atualizada com sucesso!');
        resetForm();
        loadData();
      } else {
        setError(result.message || 'Erro ao atualizar evolução');
      }
    } else {
      // Criar novo acompanhamento
      const result = await createAcompanhamento(formData);
      if (result.success) {
        setSuccess('Evolução registrada com sucesso!');
        resetForm();
        loadData();
      } else {
        setError(result.message || 'Erro ao registrar evolução');
      }
    }
  };

  const handleEdit = (acompanhamento) => {
    setEditingId(acompanhamento.id_acompanhamento);
    setFormData({
      id_paciente: acompanhamento.id_paciente,
      data_inicio: acompanhamento.data_inicio,
      descricao: acompanhamento.descricao,
      situacao: acompanhamento.situacao,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      id_paciente: '',
      data_inicio: '',
      descricao: '',
      situacao: 'em andamento',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getSituacaoBadgeClass = (situacao) => {
    switch (situacao?.toLowerCase()) {
      case 'ativo':
      case 'em andamento':
        return 'badge-ativo';
      case 'concluído':
      case 'concluido':
        return 'badge-concluido';
      case 'pausado':
        return 'badge-pausado';
      default:
        return 'badge-default';
    }
  };

  if (loading) {
    return (
      <div className="evolucao-page">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  // Apenas profissionais podem acessar esta página
  if (user?.nivel_acesso === 'paciente') {
    return (
      <div className="evolucao-page">
        <div className="access-denied">
          <h2>Acesso Restrito</h2>
          <p>Esta página é exclusiva para profissionais.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="evolucao-page">
      <div className="evolucao-header">
        <h1>Evolução de Pacientes</h1>
        <Button 
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }} 
          className="btn-novo"
        >
          {showForm ? 'Cancelar' : '+ Nova Evolução'}
        </Button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Editar Evolução' : 'Nova Evolução'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Paciente</label>
                <select
                  className="select-input"
                  value={formData.id_paciente}
                  onChange={(e) => setFormData({ ...formData, id_paciente: e.target.value })}
                  required
                >
                  <option value="">Selecione um paciente</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.id_paciente} value={paciente.id_paciente}>
                      {paciente.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Data de Início</label>
                <Input
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Situação</label>
              <select
                className="select-input"
                value={formData.situacao}
                onChange={(e) => setFormData({ ...formData, situacao: e.target.value })}
                required
              >
                <option value="em andamento">Em Andamento</option>
                <option value="ativo">Ativo</option>
                <option value="pausado">Pausado</option>
                <option value="concluído">Concluído</option>
              </select>
            </div>

            <div className="form-group">
              <label>Descrição / Observações</label>
              <Textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva a evolução do paciente, observações importantes, progressos, etc."
                rows={6}
                required
              />
            </div>

            <div className="form-actions">
              <Button type="submit" className="btn-submit">
                {editingId ? 'Atualizar' : 'Registrar'}
              </Button>
              {editingId && (
                <Button type="button" onClick={resetForm} className="btn-cancelar">
                  Cancelar Edição
                </Button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="evolucoes-list">
        {acompanhamentos.length === 0 ? (
          <div className="empty-state">
            <p>Nenhuma evolução registrada</p>
            <Button onClick={() => setShowForm(true)} className="btn-primary">
              Registrar primeira evolução
            </Button>
          </div>
        ) : (
          <div className="cards-grid">
            {acompanhamentos.map((acompanhamento) => (
              <div key={acompanhamento.id_acompanhamento} className="evolucao-card">
                <div className="card-header">
                  <div>
                    <h3>{acompanhamento.paciente_nome}</h3>
                    <p className="data-inicio">
                      Início: {new Date(acompanhamento.data_inicio).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={`badge ${getSituacaoBadgeClass(acompanhamento.situacao)}`}>
                    {acompanhamento.situacao}
                  </span>
                </div>
                
                <div className="card-body">
                  <p className="descricao">{acompanhamento.descricao}</p>
                  
                  {acompanhamento.criado_em && (
                    <p className="criado-em">
                      Criado em: {new Date(acompanhamento.criado_em).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>

                <div className="card-actions">
                  <Button
                    onClick={() => handleEdit(acompanhamento)}
                    className="btn-editar"
                  >
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EvolucaoPage;