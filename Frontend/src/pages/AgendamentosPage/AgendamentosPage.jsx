import React, { useState, useEffect } from 'react';
import './AgendamentosPage.css'; // <--- GARANTA QUE O ARQUIVO CSS TEM ESSE NOME EXATO NA PASTA
import Button from '../../components/Button/Button';
import { createAtendimento, getPacientes } from '../../services/api'; 
import { useAuth } from '../../context/AuthContext';
import axios from 'axios'; 

const AgendamentosPage = () => {
    const { user } = useAuth();
    
    // --- ESTADOS GERAIS ---
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState(null);

    // --- CALENDÁRIO E VAGAS ---
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [vagas, setVagas] = useState([]);

    // --- ESTADOS EXCLUSIVOS PARA VOLUNTÁRIO ---
    const [listaPacientes, setListaPacientes] = useState([]);
    const [pacienteSelecionado, setPacienteSelecionado] = useState("");

    const API_URL = 'http://localhost:8000'; // Ajuste se necessário

    // 1. CARREGAR PACIENTES (SE FOR VOLUNTÁRIO)
    useEffect(() => {
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
            // RECUPERA O TOKEN MANUALMENTE PARA O AXIOS
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                setMensagem({ type: 'error', text: 'Sessão expirada. Faça login novamente.' });
                setLoading(false);
                return;
            }

            console.log("Buscando vagas em:", `${API_URL}/vagas/?data=${dataCompleta}`);
            
            const response = await axios.get(`${API_URL}/vagas/?data=${dataCompleta}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setVagas(response.data);
            if (response.data.length === 0) {
                setMensagem({ type: 'info', text: 'Nenhum horário disponível nesta data.' });
            }
        } catch (error) {
            console.error("Erro detalhado:", error);
            if (error.response && error.response.status === 404) {
                 setMensagem({ type: 'error', text: 'Erro 404: Rota de vagas não encontrada no backend.' });
            } else if (error.response && error.response.status === 401) {
                 setMensagem({ type: 'error', text: 'Sessão inválida (401). Saia e entre novamente.' });
            } else {
                 setMensagem({ type: 'error', text: 'Erro ao buscar horários.' });
            }
        } finally {
            setLoading(false);
        }
    };

    // --- AGENDAR ---
    const handleAgendar = async (vaga) => {
        let idPacienteFinal = null;

        // Validação Voluntário
        if (user.nivel_acesso === 'voluntario') {
            if (!pacienteSelecionado) {
                alert("Por favor, selecione um paciente na lista antes de agendar.");
                return;
            }
            idPacienteFinal = pacienteSelecionado;
        } else {
            // Validação Paciente
            // Tenta pegar o ID do perfil de paciente, ou o ID do usuário como fallback
            idPacienteFinal = user.paciente_perfil?.id_paciente || user.id_paciente || user.id; 
        }

        const textoConfirmacao = user.nivel_acesso === 'voluntario' 
            ? `Confirmar agendamento para o paciente selecionado com ${vaga.voluntario.nome} às ${vaga.horario}?`
            : `Confirmar seu agendamento com ${vaga.voluntario.nome} às ${vaga.horario}?`;

        if (!window.confirm(textoConfirmacao)) return;

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
                setVagas(vagas.filter(v => v.id_disponibilidade !== vaga.id_disponibilidade));
                if (user.nivel_acesso === 'voluntario') setPacienteSelecionado("");
            } else {
                setMensagem({ type: 'error', text: 'Erro ao agendar: ' + (response.message || 'Tente novamente.') });
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

    return (
        <div className="agendamento-page">
            <div className="page-title">
                <h2>Agendamento de Consultas</h2>
                <p>
                    {user.nivel_acesso === 'voluntario' 
                        ? 'Selecione um paciente e agende um horário.' 
                        : 'Escolha um profissional para seu atendimento presencial.'}
                </p>
            </div>

            <div className="cards-container">
                
                {/* LISTA VAGAS */}
                <div className="card results-card">
                    <h3 className="form-title">
                        {selectedDate 
                            ? `Horários em ${selectedDate}/${currentMonth + 1}` 
                            : 'Selecione uma data'}
                    </h3>

                    {/* SELECT DO VOLUNTÁRIO */}
                    {user.nivel_acesso === 'voluntario' && (
                        <div style={{ marginBottom: 20, padding: 10, backgroundColor: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5, color: '#166534' }}>
                                Para qual Paciente é esta consulta?
                            </label>
                            <select 
                                className="custom-select"
                                value={pacienteSelecionado}
                                onChange={(e) => setPacienteSelecionado(e.target.value)}
                            >
                                <option value="">-- Selecione o Paciente --</option>
                                {listaPacientes.map(pac => (
                                    <option key={pac.id_paciente} value={pac.id_paciente}>
                                        {pac.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="lista-vagas">
                        {!selectedDate && <p className="placeholder-text">Use o calendário ao lado.</p>}
                        
                        {loading && <p style={{textAlign:'center'}}>Carregando...</p>}

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
                                    {user.nivel_acesso === 'voluntario' ? 'Agendar' : 'Confirmar'}
                                </Button>
                            </div>
                        ))}

                        {selectedDate && !loading && vagas.length === 0 && !mensagem && (
                             <p className="placeholder-text">Nenhuma vaga nesta data.</p>
                        )}
                    </div>

                    {mensagem && <div className={`mensagem-box ${mensagem.type}`}>{mensagem.text}</div>}
                </div>

                {/* CALENDÁRIO */}
                <div className="card calendar-card">
                    <div className="calendar-header">
                        <span className="nav-arrow" onClick={handlePrevMonth}>&lt;</span>
                        <span>{nomesMeses[currentMonth]} {currentYear}</span>
                        <span className="nav-arrow" onClick={handleNextMonth}>&gt;</span>
                    </div>
                    <div className="calendar-grid">
                        {diasDaSemana.map(d => <div key={d} className="day-label">{d}</div>)}
                        {emptySlots.map(i => <div key={`empty-${i}`} className="empty-slot"></div>)}
                        {daysArray.map(day => (
                            <div key={day} className={`day-number ${selectedDate === day ? 'selected' : ''}`} onClick={() => handleDateClick(day)}>
                                {day}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AgendamentosPage;