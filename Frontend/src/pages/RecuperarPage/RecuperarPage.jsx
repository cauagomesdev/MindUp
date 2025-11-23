import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import "./RecuperarPage.css"; // Importa o CSS que puxa o do Login

import imgVisual from "../../assets/mulher_terapeuta_login.png"; 
import logoMindUp from "../../assets/MindUp Logo.png";

function RecuperarPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (!email) {
            setMessage({ type: 'error', text: 'Por favor, digite seu e-mail.' });
            return;
        }

        try {
            // Simulação de envio
            await new Promise(resolve => setTimeout(resolve, 1500));
            setMessage({ 
                type: 'success', 
                text: 'Se este e-mail estiver cadastrado, enviamos um link para você.' 
            });
            setEmail(""); 
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao tentar enviar e-mail.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        // USANDO AS CLASSES DO LOGIN PAGE
        <div className="login-page-container">
            
            <div className="login-form-section">
                
                <header className="login-header">
                    <Link to="/">
                        <img src={logoMindUp} alt="MindUp Logo" className="login-logo-img"/>
                    </Link>
                    <div className="login-brand-text">
                        <h1>MindUp</h1>
                        <p>Seu espaço de Acolhimento</p>
                    </div>
                </header>

                {/* 'login-box' garante o fundo verde e bordas arredondadas */}
                <div className="login-box">
                    <h2>Recuperar Senha</h2>
                    
                    <p className="recuperar-description">
                        Esqueceu sua senha? Digite seu e-mail abaixo e enviaremos instruções.
                    </p>

                    {message && (
                        <div className={`feedback-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Input
                            type="email"
                            placeholder="Digite seu e-mail cadastrado"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        {/* 'btn-login-submit' garante o botão cinza grande */}
                        <Button 
                            type="submit" 
                            className="btn-login-submit"
                            disabled={loading}
                        >
                            {loading ? "Enviando..." : "Enviar Link"}
                        </Button>
                    </form>

                    <div className="back-link">
                        <Link to="/login">
                            ← Voltar para o Login
                        </Link>
                    </div>
                </div>
            </div>

            <div className="login-visual-section">
                <div className="visual-blob"></div>
                <img src={imgVisual} alt="Ilustração MindUp" className="login-visual-img"/>
            </div>

        </div>
    );
}

export default RecuperarPage;