import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getVoluntarioDetail, updateVoluntario, getPacienteDetail, updatePaciente } from '../../services/api'; // Ajuste o caminho
import Button from '../../components/Button/Button';
import './PerfilPage.css';

const PerfilPage = () => {
    const { user } = useAuth();
    
    // Estado dos dados
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [mensagem, setMensagem] = useState(null);

    const isVoluntario = user?.nivel_acesso === 'voluntario';

    // 1. CARREGAR DADOS AO ABRIR
    useEffect(() => {
        if (!user) return;

        async function fetchProfile() {
            try {
                let response;
                
                if (isVoluntario) {
                    // Pega o ID do voluntário que salvamos no user context
                    response = await getVoluntarioDetail(user.id_voluntario);
                } else {
                    // Pega o ID do paciente
                    response = await getPacienteDetail(user.id_paciente);
                }

                if (response.success) {
                    // O backend pode retornar os dados dentro de 'results' se for lista, ou direto se for detail
                    // Ajuste conforme seu backend retorna o GET by ID
                    setProfileData(response.data); 
                }
            } catch (error) {
                console.error("Erro ao carregar perfil", error);
                setMensagem({ type: 'error', text: 'Erro ao carregar informações.' });
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [user, isVoluntario]);

    // 2. MANIPULAR MUDANÇAS NOS INPUTS
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    // 3. SALVAR ALTERAÇÕES
    const handleSave = async () => {
        setLoading(true);
        setMensagem(null);

        try {
            let response;
            // Removemos campos que não devem ser enviados no PATCH (como objetos aninhados 'usuario')
            // Enviamos apenas o que o serializer espera receber para update
            const payload = { ...profileData };
            delete payload.usuario; // Geralmente não editamos o objeto usuario aninhado diretamente assim

            if (isVoluntario) {
                response = await updateVoluntario(user.id_voluntario, payload);
            } else {
                response = await updatePaciente(user.id_paciente, payload);
            }

            if (response.success) {
                setMensagem({ type: 'success', text: 'Perfil atualizado com sucesso!' });
                setIsEditing(false);
                // Atualiza o estado com os dados novos retornados
                setProfileData(response.data);
            } else {
                setMensagem({ type: 'error', text: 'Erro ao salvar: ' + JSON.stringify(response.message) });
            }
        } catch (error) {
            setMensagem({ type: 'error', text: 'Erro interno ao salvar.' });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profileData.id_usuario && !profileData.id_voluntario && !profileData.id_paciente) {
        return <div style={{padding:40, textAlign:'center', color:'white'}}>Carregando perfil...</div>;
    }

    return (
        <div className="perfil-page">
            <div className="perfil-container">
                
                {/* CABEÇALHO: AVATAR E NOME */}
                <div className="perfil-header">
                    <div className="avatar-circle">
                        <svg className="avatar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    {/* Mostra o nome que veio do backend ou do user context */}
                    <h2 className="perfil-name">{profileData.nome || user.nome}</h2>
                    <span className="perfil-role">{isVoluntario ? 'Voluntário(a)' : 'Paciente'}</span>
                </div>

                {/* MENSAGENS DE FEEDBACK */}
                {mensagem && (
                    <div style={{
                        padding: '10px', marginBottom: '20px', borderRadius: '5px', textAlign: 'center',
                        backgroundColor: mensagem.type === 'error' ? '#fee2e2' : '#dcfce7',
                        color: mensagem.type === 'error' ? '#991b1b' : '#166534'
                    }}>
                        {mensagem.text}
                    </div>
                )}

                {/* FORMULÁRIO */}
                <div className="perfil-form">
                    
                    {/* CAMPOS COMUNS (READ ONLY POR ENQUANTO) */}
                    <div className="form-group full-width">
                        <label>Email (Login)</label>
                        <div className="info-value" style={{color:'#888'}}>{profileData.email || user.email}</div>
                    </div>

                    {/* --- CAMPOS ESPECÍFICOS DO VOLUNTÁRIO --- */}
                    {isVoluntario && (
                        <>
                            <div className="form-group">
                                <label>Universidade</label>
                                {isEditing ? (
                                    <input 
                                        name="universidade" 
                                        value={profileData.universidade || ''} 
                                        onChange={handleChange} 
                                    />
                                ) : (
                                    <div className="info-value">{profileData.universidade || '-'}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Especialidade / Semestre</label>
                                {isEditing ? (
                                    <input 
                                        name="especialidade" 
                                        value={profileData.especialidade || ''} 
                                        onChange={handleChange} 
                                    />
                                ) : (
                                    <div className="info-value">{profileData.especialidade || '-'}</div>
                                )}
                            </div>

                            <div className="form-group full-width">
                                <label>Contato (Telefone/WhatsApp)</label>
                                {isEditing ? (
                                    <input 
                                        name="contato" 
                                        value={profileData.contato || ''} 
                                        onChange={handleChange} 
                                        placeholder="(XX) XXXXX-XXXX"
                                    />
                                ) : (
                                    <div className="info-value">{profileData.contato || '-'}</div>
                                )}
                            </div>
                        </>
                    )}

                    {/* --- CAMPOS ESPECÍFICOS DO PACIENTE --- */}
                    {!isVoluntario && (
                        <>
                            <div className="form-group full-width">
                                <label>Endereço</label>
                                {isEditing ? (
                                    <input 
                                        name="endereco" 
                                        value={profileData.endereco || ''} 
                                        onChange={handleChange} 
                                    />
                                ) : (
                                    <div className="info-value">{profileData.endereco || '-'}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Data de Nascimento</label>
                                {isEditing ? (
                                    <input 
                                        type="date"
                                        name="data_nascimento" 
                                        value={profileData.data_nascimento || ''} 
                                        onChange={handleChange} 
                                    />
                                ) : (
                                    <div className="info-value">{profileData.data_nascimento || '-'}</div>
                                )}
                            </div>
                             <div className="form-group">
                                <label>Comunidade</label>
                                <div className="info-value" style={{color:'#888'}}>
                                    {profileData.comunidade_nome || 'Não vinculada'}
                                </div>
                            </div>
                        </>
                    )}

                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="action-buttons">
                    {isEditing ? (
                        <>
                            <Button 
                                className="secondary" 
                                onClick={() => {
                                    setIsEditing(false);
                                    setMensagem(null);
                                    // Opcional: Recarregar dados originais para cancelar alterações
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button className="primary" onClick={handleSave}>
                                {loading ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </>
                    ) : (
                        <Button className="primary" onClick={() => setIsEditing(true)}>
                            Editar Perfil
                        </Button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PerfilPage;