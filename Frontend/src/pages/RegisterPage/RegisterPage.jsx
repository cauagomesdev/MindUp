import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getComunidades } from "../../services/api"; // Importa a função da API
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import "./RegisterPage.css"; // Estilos para esta página

// Importe suas imagens
import logoMindUp from "../../assets/MindUp Logo.png";
import imgVoluntario from "../../assets/mulher_terapeuta_login.png";
import imgPaciente from "../../assets/psicologa-cadastro.webp"; // (Certifique-se de ter essa imagem)

function RegisterPage() {
    // --- ESTADOS ---
    const [step, setStep] = useState(1); // 1 = Básico, 2 = Específico
    const [role, setRole] = useState("voluntario"); // 'voluntario' ou 'paciente'

    // Etapa 1: Campos Básicos
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Etapa 2: Campos Paciente
    const [address, setAddress] = useState("");
    const [communityId, setCommunityId] = useState(""); // Armazena o ID (UUID)
    const [birthDate, setBirthDate] = useState("");

    // Etapa 2: Campos Voluntário
    const [university, setUniversity] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [contact, setContact] = useState("");

    // Lista para o dropdown
    const [comunidadesList, setComunidadesList] = useState([]);

    // Controle
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth(); // Pega a função 'register' do AuthContext

    // --- EFEITOS (Hooks) ---
    // Busca as comunidades da API real quando a página carrega
    useEffect(() => {
        async function fetchComunidades() {
            const result = await getComunidades();
            if (result.success) {
                // O backend (views.py) retorna {"comunidades": [...]}
                setComunidadesList(result.data.comunidades);
            } else {
                console.error("Erro ao buscar comunidades:", result.message);
                setError("Não foi possível carregar a lista de comunidades.");
            }
        }
        fetchComunidades();
    }, []); // O array vazio [] faz isso rodar só uma vez

    // --- FUNÇÕES (Handlers) ---

    // Valida a Etapa 1 e avança
    const handleNextStep = (selectedRole) => {
        setError(""); // Limpa erros anteriores
        
        if (!name || !email || !password || !confirmPassword) {
            setError("Por favor, preencha todos os campos básicos.");
            return;
        }
        if (password.length < 8) { // VALIDAÇÃO DOS 8 CARACTERES
            setError("A senha deve ter pelo menos 8 caracteres.");
            return;
        }
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setRole(selectedRole);
        setStep(2); // Avança para a Etapa 2
    };

    // Volta para a Etapa 1
    const handlePrevStep = () => {
        setError("");
        setStep(1);
    };

    // Envia o formulário completo (na Etapa 2)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Monta o objeto userData EXATAMENTE como o backend (serializers.py) espera
        const userData = {
            nome: name,
            email: email,
            password: password,
            nivel_acesso: role, // 'paciente' ou 'voluntario'
            
            ...(role === 'paciente' && { 
                endereco: address, 
                id_comunidade: communityId, // Envia o UUID da comunidade
                data_nascimento: birthDate
            }),
            
            ...(role === 'voluntario' && { 
                universidade: university, 
                especialidade: specialty,
                contato: contact
            }),
        };

        const result = await register(userData); // Chama a função 'register' do AuthContext

        if (!result.success) {
            setError(result.message);
            setLoading(false);
        }
        // Se der certo, o AuthContext já redirecionou
    };

    // --- RENDERIZAÇÃO (JSX) ---
    return (
        <div className="login-page-container">
            
            <div className="login-form-section">
                
                <header className="login-header">
                    <img src={logoMindUp} alt="MindUp Logo" className="login-logo-img"/>
                    <div className="login-brand-text">
                        <h1>MindUp</h1>
                        <p>Seu espaço de Acolhimento</p>
                    </div>
                </header>

                {/* --- ETAPA 1: INFORMAÇÕES BÁSICAS --- */}
                {step === 1 && (
                    <div className="login-box">
                        <h2>Cadastre-se</h2>
                        <form onSubmit={(e) => e.preventDefault()}> 
                            {error && <p className="error-message">{error}</p>}

                            <Input type="text" placeholder="Nome Completo" value={name} onChange={(e) => setName(e.target.value)} required />
                            <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <Input type="password" placeholder="Senha (mín. 8 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <Input type="password" placeholder="Confirmar Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            
                            <div className="register-role-selector">
                                <label>Qual o seu tipo de usuário?</label>
                                <div className="role-buttons">
                                    <Button type="button" onClick={() => handleNextStep('voluntario')} className="btn-role-select">
                                        Voluntário
                                    </Button>
                                    <Button type="button" onClick={() => handleNextStep('paciente')} className="btn-role-select">
                                        Paciente
                                    </Button>
                                </div>
                            </div>
                        </form>
                        <div className="register-link">
                            <p>Já possui uma conta? <Button to="/login" className="btn-link">Entrar</Button></p>
                        </div>
                    </div>
                )}

                {/* --- ETAPA 2: INFORMAÇÕES DE VOLUNTÁRIO --- */}
                {step === 2 && role === 'voluntario' && (
                    <div className="login-box">
                        <h2>Olá voluntário, complete o seu cadastro</h2>
                        <form onSubmit={handleSubmit}>
                            {error && <p className="error-message">{error}</p>}
                            <Input type="text" placeholder="Universidade" value={university} onChange={(e) => setUniversity(e.target.value)} required />
                            <Input type="text" placeholder="Especialidade" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required />
                            <Input type="text" placeholder="Telefone para contato (com DDD)" value={contact} onChange={(e) => setContact(e.target.value)} required />
                            
                            <Button type="submit" className="btn-login-submit" disabled={loading}>
                                {loading ? 'Finalizando...' : 'Cadastrar'}
                            </Button>
                        </form>
                        <Button onClick={handlePrevStep} className="btn-link btn-link-voltar">Voltar</Button>
                    </div>
                )}

                {/* --- ETAPA 2: INFORMAÇÕES DE PACIENTE --- */}
                {step === 2 && role === 'paciente' && (
                    <div className="login-box">
                        <h2>Olá paciente, complete o seu cadastro</h2>
                        <form onSubmit={handleSubmit}>
                            {error && <p className="error-message">{error}</p>}
                            <Input type="text" placeholder="Endereço" value={address} onChange={(e) => setAddress(e.target.value)} required />
                            
                            <div className="input-group">
                                <label htmlFor="comunidade-select">Comunidade</label>
                                <select 
                                    id="comunidade-select"
                                    className="input-field" 
                                    value={communityId} 
                                    onChange={(e) => setCommunityId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Selecione sua comunidade</option>
                                    {comunidadesList.map(com => (
                                        <option key={com.id_comunidade} value={com.id_comunidade}>
                                            {com.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="input-group">
                                <label htmlFor="birthdate-input">Data de Nascimento</label>
                                <Input type="date" id="birthdate-input" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                            </div>

                            <Button type="submit" className="btn-login-submit" disabled={loading}>
                                {loading ? 'Finalizando...' : 'Cadastrar'}
                            </Button>
                        </form>
                        <Button onClick={handlePrevStep} className="btn-link btn-link-voltar">Voltar</Button>
                    </div>
                )}

            </div>

            {/* --- Seção Direita: Imagem Dinâmica --- */}
            <div className="login-visual-section">
                <div className="visual-blob"></div>
                <img 
                    src={step === 1 ? imgVoluntario : (role === 'paciente' ? imgPaciente : imgVoluntario)} 
                    alt="MindUp" 
                    className="login-visual-img"
                />
            </div>
        </div>
    );
}

export default RegisterPage;