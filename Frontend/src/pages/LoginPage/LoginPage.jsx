import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { login } from "../../services/mockApi";
import "./LoginPage.css";
import imgmulher from "../../assets/mulher-terapeuta.jpg";

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(False);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await login(email, password);

        if(result.success){
            console.log("Login bem-sucedido", result.user);
            navigate("/agendamentos");
        }else{
            setError(result.message);
            console.error("Erro no login:", result.message);
        }
        setLoading(false);
    }

    return (
        <main className="login-container">
            <section className="login-section">
                
                <div className="login-content">
                    <form action="" className="login-form">
                        
                    </form>
                </div>

                <div className="login-img-wrapper">
                    <img src={imgmulher} alt="login-img-mulher" className="login-img"/>
                </div>

            </section>
        </main>

    );
}

export default LoginPage;