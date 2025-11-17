import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAcompanhamentos, createAcompanhamento, getPacientes } from '../../services/api'; // (Precisa importar createAcompanhamento e getPacientes)
import "./AcompanhamentoPage.css"; 
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Textarea from '../../components/Textarea/Textarea'; // Precisamos do Textarea

function AcompanhamentoPage() {
    const [acompanhamentos, setAcompanhamentos] = useState([]);
    const [pacientes, setPacientes] = useState([]); // Para o dropdown do voluntário
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth(); // Pega o usuário logado (ex: user.nivel_acesso)

    // --- Estados do Formulário (para o Voluntário) ---
    const [pacienteId, setPacienteId] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [situacao, setSituacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [formError, setFormError] = useState('');

    // --- EFEITO: Busca os dados necessários ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            
            if (user.nivel_acesso === 'paciente') {
                // Se for Paciente, busca só os seus acompanhamentos
                const result = await getAcompanhamentos(); // O backend filtra pelo user logado
                if (result.success) {
                    setAcompanhamentos(result.data.results); 
                } else {
                    setError(result.message);
                }
            } else if (user.nivel_acesso === 'voluntario') {
                // Se for Voluntário, busca a lista de pacientes para o dropdown
                const resultPacientes = await getPacientes();
                if (resultPacientes.success && Array.isArray(resultPacientes.data.results)) {
                    setPacientes(resultPacientes.data.results); // Assumindo que a API retorna 'pacientes'
                } else {
                    setError("Erro ao carregar lista de pacientes.");
                }
            }
            setLoading(false);
        };

        if (user) {
            fetchData();
        }
    }, [user]); // Roda quando o 'user' é carregado

    // --- Handler para o Voluntário criar um registro ---
    const handleSubmitAcompanhamento = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError('');

        const acompanhamentoData = {
            id_paciente: pacienteId,
            data_inicio: dataInicio,
            situacao: situacao,
            descricao: descricao
        };

        const result = await createAcompanhamento(acompanhamentoData);
        
        if (result.success) {
            // Limpa o formulário
            setPacienteId('');
            setDataInicio('');
            setSituacao('');
            setDescricao('');
            alert('Acompanhamento registrado com sucesso!');
        } else {
            setFormError(result.message);
        }
        setLoading(false);
    };


    // --- RENDERIZAÇÃO ---
    
    if (loading) {
        return <div className="loading-container">Carregando...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    // --- VISÃO DO VOLUNTÁRIO ---
    if (user.nivel_acesso === 'voluntario') {
        return (
            <div className="acompanhamento-container-voluntario">
                <header className="acompanhamento-header">
                    <h1>Registrar Acompanhamento</h1>
                    <p>Use este formulário para registrar a evolução de um paciente.</p>
                </header>
                
                <form onSubmit={handleSubmitAcompanhamento} className="acompanhamento-form">
                    {formError && <p className="error-message">{formError}</p>}
                    
                    <div className="input-group">
                        <label htmlFor="paciente-select">Paciente</label>
                        <select 
                            id="paciente-select"
                            className="input-field" 
                            value={pacienteId} 
                            onChange={(e) => setPacienteId(e.target.value)}
                            required
                        >
                            <option value="" disabled>Selecione um paciente</option>
                            {pacientes.map(pac => (
                                // O serializer do paciente expõe 'nome'
                                <option key={pac.id_paciente} value={pac.id_paciente}>
                                    {pac.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Data do Registro"
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        required
                    />

                    <Input
                        label="Situação (ex: Em progresso, Estável)"
                        type="text"
                        placeholder="Situação atual"
                        value={situacao}
                        onChange={(e) => setSituacao(e.target.value)}
                        required
                    />

                    <Textarea
                        label="Descrição da Evolução"
                        placeholder="Descreva a evolução do paciente, observações, etc."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        required
                        rows={6}
                    />
                    
                    <Button type="submit" className="primary" disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar Registro'}
                    </Button>
                </form>
            </div>
        );
    }

    // --- VISÃO DO PACIENTE (O seu código original) ---
    return (
        <div className="acompanhamento-container">
            <header className="acompanhamento-header">
                <h1>Minha Evolução</h1>
                <p>Aqui está o histórico do seu acompanhamento na MindUp, registrado pelo seu voluntário.</p>
            </header>
            
            <div className="timeline">
                {acompanhamentos.length === 0 ? (
                    <div className="timeline-item-empty">
                        <h3>Nenhum registro encontrado</h3>
                        <p>Quando seu voluntário adicionar um registro, ele aparecerá aqui.</p>
                    </div>
                ) : (
                    acompanhamentos.sort((a, b) => new Date(b.data_inicio) - new Date(a.data_inicio))
                    .map(item => (
                        <div className="timeline-item" key={item.id_acompanhamento}>
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div className="timeline-header">
                                    <span className="timeline-date">
                                        {new Date(item.data_inicio).toLocaleDateString('pt-BR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            timeZone: 'UTC'
                                        })}
                                    </span>
                                    {item.situacao && (
                                        <span className="timeline-status">{item.situacao}</span>
                                    )}
                                </div>
                                <h3>Registro de Acompanhamento</h3>
                                <p className="timeline-description">
                                    {item.descricao || "Nenhuma descrição fornecida."}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AcompanhamentoPage;