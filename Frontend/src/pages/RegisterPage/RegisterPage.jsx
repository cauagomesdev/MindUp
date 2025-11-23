import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // <--- IMPORT NOVO
import { useAuth } from "../../context/AuthContext";
import { getComunidades } from "../../services/api"; 
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import "./RegisterPage.css"; 

import logoMindUp from "../../assets/MindUp Logo.png";
import imgVoluntario from "../../assets/mulher_terapeuta_login.png";
import imgPaciente from "../../assets/psicologa-cadastro.webp"; 

function RegisterPage() {
    const [step, setStep] = useState(1); 
    const [role, setRole] = useState("voluntario"); 

    // Etapa 1
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Etapa 2
    const [address, setAddress] = useState("");
    const [communityId, setCommunityId] = useState(""); 
    const [birthDate, setBirthDate] = useState("");
    const [university, setUniversity] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [contact, setContact] = useState("");

    const [comunidadesList, setComunidadesList] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth(); 

    useEffect(() => {
        async function fetchComunidades() {
            const result = await getComunidades();
            if (result.success && Array.isArray(result.data.results)) {
                setComunidadesList(result.data.results);
            } else {
                console.error("Erro ao buscar comunidades:", result.message);
                setError("Não foi possível carregar a lista de comunidades.");
                setComunidadesList([]);
            }
        }
        fetchComunidades();
    }, []); 

    const handleNextStep = (selectedRole) => {
        setError(""); 
        
        if (!name || !email || !password || !confirmPassword) {
            setError("Por favor, preencha todos os campos básicos.");
            return;
        }
        if (password.length < 8) { 
            setError("A senha deve ter pelo menos 8 caracteres.");
            return;
        }
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setRole(selectedRole);
        setStep(2); 
    };

    const handlePrevStep = () => {
        setError("");
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const userData = {
            nome: name,
            email: email,
            password: password,
            nivel_acesso: role, 
            
            ...(role === 'paciente' && { 
                endereco: address, 
                id_comunidade: communityId, 
                data_nascimento: birthDate
            }),
            
            ...(role === 'voluntario' && { 
                universidade: university, 
                especialidade: specialty,
                contato: contact
            }),
        };

        const result = await register(userData); 

        if (!result.success) {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            
            <div className="login-form-section">
                
                <header className="login-header">
                    {/* ALTERAÇÃO AQUI: Link envolvendo a imagem */}
                    <Link to="/">
                        <img src={logoMindUp} alt="MindUp Logo" className="login-logo-img"/>
                    </Link>
                    
                    <div className="login-brand-text">
                        <h1>MindUp</h1>
                        <p>Seu espaço de Acolhimento</p>
                    </div>
                </header>

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