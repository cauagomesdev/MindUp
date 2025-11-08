import React, { useState } from "react";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import "./LoginPage.css";
import { useAuth } from "../../context/AuthContext";

import imgmulher from "../../assets/mulher_terapeuta_login.png";
import logoMindUp from "../../assets/MindUp Logo.png";

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await login(email, password);

        if(!result.success){
            setError(result.message);
            console.error("Erro no login:", result.message);
        }
        
        setLoading(false);
    }

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

                <div className="login-box">
                    <h2>Conecte-se</h2>

                    <form onSubmit={handleSubmit}>
                        {error && <p className="error-message">{error}</p>}

                        <Input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-label="E-mail"
                        />

                        <Input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            aria-label="Senha"
                        />

                        <div className="login-options">
                            <label className="lembrar">
                                <input type="checkbox"/> Lembre-se
                            </label>
                            <a href="/recuperar-senha">Recuperar Senha</a>
                        </div>

                        <Button
                            type="submit"
                            className="btn-login-submit"
                            disabled={loading}
                        >
                                {loading ? "Entrando..." : "Entrar"}
                        </Button> 
                    </form> 

                     <div className="register-link">
                        <p>
                            Não possui uma conta?
                            <Button to="/cadastro" className="btn-link">Resgistre-se</Button>
                        </p>
                    </div> 
                </div>
            </div>

            <div className="login-visual-section">
                <div className="visual-blob"></div>
                <img src={imgmulher} alt="Terapeuta MindUp" className="login-visual-img"/>
            </div>
        </div>
    );
}

export default LoginPage;