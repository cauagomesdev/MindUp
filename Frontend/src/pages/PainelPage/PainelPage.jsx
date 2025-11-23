import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './PainelPage.css';
import imgroda from "../../assets/img-painel.png";

const PainelPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // Estados para os dados dinâmicos
    const [dashboardData, setDashboardData] = useState({
        proximo_agendamento: null,
        pacientes_ativos: 0
    });
    const [loading, setLoading] = useState(true);

    const isVoluntario = user?.nivel_acesso === 'voluntario';
    const API_URL = 'http://localhost:8000';

    // BUSCAR DADOS DO DASHBOARD (Só se for voluntário)
    useEffect(() => {
        if (isVoluntario) {
            async function fetchDashboard() {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await axios.get(`${API_URL}/dashboard/voluntario/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setDashboardData(response.data);
                } catch (error) {
                    console.error("Erro ao carregar dashboard", error);
                } finally {
                    setLoading(false);
                }
            }
            fetchDashboard();
        } else {
            setLoading(false);
        }
    }, [isVoluntario]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return <div>Carregando...</div>;

    // Formatar data para PT-BR (Ex: 20/11/2025)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="painel-page">
            <div className="painel-container">
                
                <h1 className="painel-title">
                    Seu Painel, {isVoluntario ? 'Voluntário' : 'Paciente'}!
                </h1>

                <div className="top-section">
                    <div className="welcome-card">
                        <img 
                            src={imgroda} alt="Grupo MindUp" />
                    </div>

                    <div className="widgets-area">
                        
                        {/* CARD 1: PRÓXIMO AGENDAMENTO DINÂMICO */}
                        <div className="widget-card">
                            <h3 className="widget-title">Próximo Agendamento:</h3>
                            <div className="widget-content">
                                {loading ? (
                                    <p>Carregando...</p>
                                ) : dashboardData.proximo_agendamento ? (
                                    <div className="appointment-info">
                                        {/* Nome do Paciente */}
                                        <h4 style={{color: '#00695C', fontSize: '1.2rem'}}>
                                            Pct. {dashboardData.proximo_agendamento.paciente_nome}
                                        </h4>
                                        
                                        {/* Data */}
                                        <p style={{fontSize: '1.1rem', marginTop: 5}}>
                                            {formatDate(dashboardData.proximo_agendamento.data)}
                                        </p>
                                        
                                        {/* Horário */}
                                        <p style={{fontWeight:'bold', fontSize: '1.3rem'}}>
                                            {dashboardData.proximo_agendamento.horario.slice(0, 5)}
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{textAlign: 'center', color: '#666'}}>
                                        <p>Nenhum agendamento futuro.</p>
                                        <small>Aguarde novos pacientes.</small>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CARD 2: PACIENTES ATIVOS DINÂMICO */}
                        <div className="widget-card">
                            {isVoluntario ? (
                                <>
                                    <div className="big-number">
                                        {loading ? '-' : dashboardData.pacientes_ativos}
                                    </div>
                                    <span className="label-number">Pacientes Atendidos</span>
                                </>
                            ) : (
                                <>
                                    <div className="big-number" style={{color:'#00796B'}}>OK</div>
                                    <span className="label-number">Status</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* BOTÕES DE AÇÃO (MANTIDO IGUAL) */}
                <div className="actions-grid">
                    <Link to="/agendamentos" className="action-card">
                        <div className="icon-box">
                           <svg className="icon-svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                        </div>
                        <div className="card-text">
                            <h3>{isVoluntario ? 'Gerenciar Agendamentos' : 'Novo Agendamento'}</h3>
                            <p>{isVoluntario ? 'Visualize seus horários' : 'Marque uma consulta'}</p>
                        </div>
                    </Link>

                    <Link to="/acompanhamentos" className="action-card">
                        <div className="icon-box">
                            <svg className="icon-svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                            </svg>
                        </div>
                        <div className="card-text">
                            <h3>{isVoluntario ? 'Registrar Evolução' : 'Minha Evolução'}</h3>
                            <p>{isVoluntario ? 'Histórico dos pacientes' : 'Visualize seu progresso'}</p>
                        </div>
                    </Link>

                    <Link to="/perfil" className="action-card">
                        <div className="icon-box">
                             <svg className="icon-svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div className="card-text">
                            <h3>Meu Perfil</h3>
                            <p>Acesse suas configurações</p>
                        </div>
                    </Link>

                    <button onClick={handleLogout} className="action-card">
                        <div className="icon-box">
                             <svg className="icon-svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </div>
                        <div className="card-text">
                            <h3>Sair da Conta</h3>
                            <p>Desconecte sua conta</p>
                        </div>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PainelPage;