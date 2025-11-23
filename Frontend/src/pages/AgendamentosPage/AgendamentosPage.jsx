import React, { useState, useEffect } from 'react';
import './AgendamentosPage.css'; 
import Button from '../../components/Button/Button';
import { createAtendimento, getPacientes } from '../../services/api'; 
import { useAuth } from '../../context/AuthContext';
import axios from 'axios'; 

const AgendamentosPage = () => {
    const { user } = useAuth();
    const API_URL = 'http://localhost:8000'; 
    
    // --- ESTADOS ---
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);

    // Calendário
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    
    // Dados
    const [vagas, setVagas] = useState([]);
    const [listaPacientes, setListaPacientes] = useState([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState("");
    
    // NOVO: Lista de dias que o usuário já tem compromisso
    const [diasComAgendamento, setDiasComAgendamento] = useState([]);

    // 1. CARREGAR DADOS INICIAIS (Pacientes e Dias Agendados)
    useEffect(() => {
        const token = localStorage.getItem('authToken');

        // Função para buscar os dias que terão "bolinha" no calendário
        async function fetchMeusDias() {
            try {
                const response = await axios.get(`${API_URL}/meus-dias-agendados/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDiasComAgendamento(response.data); // Ex: ['2025-12-02', '2025-12-15']
            } catch (error) {
                console.error("Erro ao buscar dias agendados", error);
            }
        }

        fetchMeusDias();

        // Se for voluntário, carrega lista de pacientes para o select
        if (user && user.nivel_acesso === 'voluntario') {
            async function carregarPacientes() {
                try {
                    const response = await getPacientes();
                    if (response.success) {
                        setListaPacientes(response.data.results || response.data);
                    }
                } catch (error) {
                    console.error("Erro ao listar pacientes", error);
                }
            }
            carregarPacientes();
        }
    }, [user]);

    // --- HELPERS DE CALENDÁRIO ---
    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const diasDaSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    
    const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

    const handlePrevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
        else { setCurrentMonth(currentMonth - 1); }
    };
    const handleNextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
        else { setCurrentMonth(currentMonth + 1); }
    };

    // --- BUSCA VAGAS ---
    const handleDateClick = async (day) => {
        setSelectedDate(day);
        setMensagem(null);
        setVagas([]);
        setLoading(true);

        const mesFmt = String(currentMonth + 1).padStart(2, '0');
        const diaFmt = String(day).padStart(2, '0');
        const dataCompleta = `${currentYear}-${mesFmt}-${diaFmt}`;

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setMensagem({ type: 'error', text: 'Sessão expirada. Faça login novamente.' });
                setLoading(false);
                return;
            }
            
            const response = await axios.get(`${API_URL}/vagas/?data=${dataCompleta}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setVagas(response.data);
            if (response.data.length === 0) {
                setMensagem({ type: 'info', text: 'Nenhum horário disponível nesta data.' });
            }
        } catch (error) {
            setMensagem({ type: 'error', text: 'Erro ao buscar horários.' });
        } finally {
            setLoading(false);
        }
    };

    // --- AGENDAR ---
    const handleAgendar = async (vaga) => {
        let idPacienteFinal = null;

        if (user.nivel_acesso === 'voluntario') {
            if (!pacienteSelecionado) {
                alert("Por favor, selecione um paciente na lista antes de agendar.");
                return;
            }
            idPacienteFinal = pacienteSelecionado;
        } else {
            idPacienteFinal = user.id_paciente; 
        }

        if (!idPacienteFinal) {
            setMensagem({ type: 'error', text: "Erro: ID do paciente não encontrado. Faça login novamente." });
            return;
        }

        if (!window.confirm(`Confirmar agendamento às ${vaga.horario}?`)) return;

        setLoading(true);
        try {
            const mesFmt = String(currentMonth + 1).padStart(2, '0');
            const diaFmt = String(selectedDate).padStart(2, '0');
            const dataCompleta = `${currentYear}-${mesFmt}-${diaFmt}`;

            const payload = {
                data: dataCompleta,
                horario: vaga.horario,
                tipo_atendimento: 'Presencial',
                id_paciente: idPacienteFinal,
                id_voluntario: vaga.voluntario.id,
                status: 'agendado'
            };

            const response = await createAtendimento(payload);
            
            if (response.success) {
                setMensagem({ type: 'success', text: 'Consulta agendada com sucesso!' });
                
                // --- SOLUÇÃO PARA NÃO DUPLICAR ---
                // Removemos IMEDIATAMENTE este horário da lista de vagas visíveis.
                // Assim, o botão some e ninguém clica de novo.
                setVagas(prevVagas => prevVagas.filter(v => v.horario !== vaga.horario));
                
                // Adiciona o dia atual na lista de dias com "bolinha" visualmente
                if (!diasComAgendamento.includes(dataCompleta)) {
                    setDiasComAgendamento([...diasComAgendamento, dataCompleta]);
                }

                if (user.nivel_acesso === 'voluntario') setPacienteSelecionado("");
            } else {
                setMensagem({ type: 'error', text: 'Erro ao agendar: ' + (response.message || 'Horário já ocupado.') });
            }
        } catch (error) {
            setMensagem({ type: 'error', text: 'Erro interno.' });
        } finally {
            setLoading(false);
        }
    };

    // RENDERIZAÇÃO
    const totalDays = getDaysInMonth(currentMonth, currentYear);
    const firstDayIndex = getFirstDayOfMonth(currentMonth, currentYear);
    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
    const emptySlots = Array.from({ length: firstDayIndex }, (_, i) => i);

    // Função para verificar se o dia deve ter bolinha
    const checkHasAppointment = (day) => {
        const mesFmt = String(currentMonth + 1).padStart(2, '0');
        const diaFmt = String(day).padStart(2, '0');
        const dataCompleta = `${currentYear}-${mesFmt}-${diaFmt}`;
        return diasComAgendamento.includes(dataCompleta);
    };

    return (
        <div className="agendamento-page">
            <div className="page-title">
                <h2>Agendamento de Consultas</h2>
                <p>{user.nivel_acesso === 'voluntario' ? 'Gerencie os agendamentos.' : 'Agende seu atendimento.'}</p>
            </div>

            <div className="cards-container">
                <div className="card results-card">
                    <h3 className="form-title">
                        {selectedDate ? `Horários em ${selectedDate}/${currentMonth + 1}` : 'Selecione uma data'}
                    </h3>

                    {user.nivel_acesso === 'voluntario' && (
                        <div style={{ marginBottom: 20, padding: 10, backgroundColor: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5, color: '#166534' }}>
                                Para qual Paciente é esta consulta?
                            </label>
                            <select className="custom-select" value={pacienteSelecionado} onChange={(e) => setPacienteSelecionado(e.target.value)}>
                                <option value="">-- Selecione o Paciente --</option>
                                {listaPacientes.map(pac => (
                                    <option key={pac.id_paciente} value={pac.id_paciente}>{pac.nome}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="lista-vagas">
                        {!selectedDate && <p className="placeholder-text">Use o calendário ao lado.</p>}
                        
                        {vagas.length > 0 && vagas.map((vaga, index) => (
                            <div key={index} className="vaga-card">
                                <div className="vaga-info">
                                    <span className="vaga-horario">{vaga.horario.slice(0,5)}</span>
                                    <div className="vaga-detalhes">
                                        <strong>{vaga.voluntario.nome}</strong>
                                        <small>{vaga.voluntario.universidade}</small>
                                    </div>
                                </div>
                                <Button className="primary" style={{padding:'5px 10px'}} onClick={() => handleAgendar(vaga)}>
                                    Agendar
                                </Button>
                            </div>
                        ))}

                        {selectedDate && !loading && vagas.length === 0 && !mensagem && (
                             <p className="placeholder-text">Nenhuma vaga disponível.</p>
                        )}
                    </div>
                    {mensagem && <div className={`mensagem-box ${mensagem.type}`}>{mensagem.text}</div>}
                </div>

                <div className="card calendar-card">
                    <div className="calendar-header">
                        <span className="nav-arrow" onClick={handlePrevMonth}>&lt;</span>
                        <span>{nomesMeses[currentMonth]} {currentYear}</span>
                        <span className="nav-arrow" onClick={handleNextMonth}>&gt;</span>
                    </div>
                    <div className="calendar-grid">
                        {diasDaSemana.map(d => <div key={d} className="day-label">{d}</div>)}
                        {emptySlots.map(i => <div key={`empty-${i}`} className="empty-slot"></div>)}
                        
                        {/* RENDERIZAÇÃO DOS DIAS COM BOLINHA */}
                        {daysArray.map(day => {
                            const hasAppointment = checkHasAppointment(day);
                            return (
                                <div 
                                    key={day} 
                                    className={`day-number ${selectedDate === day ? 'selected' : ''} ${hasAppointment ? 'has-appointment' : ''}`} 
                                    onClick={() => handleDateClick(day)}
                                    title={hasAppointment ? "Você tem um compromisso neste dia" : ""}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                    <div style={{marginTop: 10, fontSize: '0.8rem', color: '#666', textAlign:'center'}}>
                        <span style={{display:'inline-block', width:6, height:6, backgroundColor:'#e11d48', borderRadius:'50%', marginRight:5}}></span>
                        Dias com agendamento
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgendamentosPage;